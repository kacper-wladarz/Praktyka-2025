import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatedUserDTO } from './dtos/updated-user.dto';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class DashboardService {
  private isServerToReset: boolean = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {}

  formatUser(user) {
    const date = new Date(user.createdAt);
    return {
      ...user,
      createdAt: `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}, ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
    };
  }

  async isAdminAuth(adminId: string) {
    if (!(await this.authService.adminAuth(adminId))) {
      throw new UnauthorizedException(
        this.i18n.t('dashboard.error.adminNotAuth'),
      );
    }
  }

  async getUsers(
    adminId: string,
    login: string,
    role: 'ADMIN' | 'USER' | 'ALL',
  ) {
    await this.isAdminAuth(adminId);
    const users = await this.prisma.user.findMany({
      where: {
        login: {
          contains: login !== '' ? login : undefined,
        },
        role: role === 'ALL' ? undefined : role,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map((user) => this.formatUser(user));
  }

  async createUser(
    login: string,
    password: string,
    role: 'ADMIN' | 'USER',
    adminId: string,
  ) {
    await this.isAdminAuth(adminId);
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (user) {
      throw new BadRequestException(this.i18n.t('dashboard.error.userExists'));
    }

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );

    await this.prisma.user.create({
      data: { login, password: hashedPassword, role },
    });
    return;
  }

  async getUser(id: string, adminId: string) {
    await this.isAdminAuth(adminId);
    return this.formatUser(
      await this.prisma.user.findUnique({
        where: { id },
      }),
    );
  }

  async deleteUser(id: string, adminId: string) {
    await this.isAdminAuth(adminId);
    await this.prisma.user.delete({ where: { id } });
    return;
  }

  async getUserToUpdate(id: string, adminId: string) {
    await this.isAdminAuth(adminId);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        password: true,
        lastOpenedChat: true,
        role: true,
        PIN: true,
      },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('dashboard.error.userNotExist'));
    }

    user.password = '';

    return { ...user };
  }

  async updateUser(id: string, user: UpdatedUserDTO, adminId: string) {
    await this.isAdminAuth(adminId);
    const isExist = await this.prisma.user.findUnique({
      where: { login: user.login },
    });
    if (isExist && isExist.id !== id) {
      throw new BadRequestException(this.i18n.t('dashboard.error.userExists'));
    }
    const { id: userId, login, password, lastOpenedChat, role, PIN } = user;

    let finalPassword: string;

    if (password === '') {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
        select: { password: true },
      });
      if (!existingUser) {
        throw new NotFoundException(
          this.i18n.t('dashboard.error.userNotExist'),
        );
      }
      finalPassword = existingUser.password ?? '';
    } else {
      finalPassword = await bcrypt.hash(
        user.password,
        await bcrypt.genSalt(10),
      );
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          id: userId,
          login,
          password: finalPassword || null,
          lastOpenedChat,
          role,
          PIN: PIN ? String(PIN) : '',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        this.i18n.t('dashboard.error.unexpectedError'),
      );
    }
    return;
  }

  async getSettings(adminId: string) {
    await this.isAdminAuth(adminId);
    return {
      settings: dotenv.parse(fs.readFileSync('.env', 'utf8')),
      toReset: this.isServerToReset,
    };
  }

  async updateSettings(settings: Record<string, string>, adminId: string) {
    await this.isAdminAuth(adminId);

    const content = Object.entries(settings)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', content);
    this.isServerToReset = true;
    return;
  }

  async getStats(adminId: string) {
    await this.isAdminAuth(adminId);
    const users = await this.prisma.user.count({ where: { role: 'USER' } });
    const admins = await this.prisma.user.count({ where: { role: 'ADMIN' } });
    const folders = await this.prisma.folder.count();
    const chats = await this.prisma.chat.count();
    const messages = await this.prisma.message.count();
    const usersInTime = await this.prisma.user.findMany({
      select: { id: true, createdAt: true },
    });

    const groupedUsersInTime = Object.entries(
      usersInTime.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        acc[formattedDate] = (acc[formattedDate] || 0) + 1;
        return acc;
      }, {}),
    ).map(([date, count]) => ({ date: new Date(date), count }));

    return {
      users,
      admins,
      folders,
      chats,
      messages,
      usersInTime: groupedUsersInTime.sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      ),
    };
  }
}
