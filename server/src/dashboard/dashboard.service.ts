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

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
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

  async getUsers(adminId: string) {
    await this.isAdminAuth(adminId);
    const users = await this.prisma.user.findMany({
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

    console.log(finalPassword, user);

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          id: userId,
          login,
          password: finalPassword || null,
          lastOpenedChat,
          role,
          PIN: PIN ? String(PIN) : undefined,
        },
      });
    } catch (error) {
      console.error('BŁĄD::::::', error);
      throw new BadRequestException(
        this.i18n.t('dashboard.error.unexpectedError'),
      );
    }
    return;
  }
}
