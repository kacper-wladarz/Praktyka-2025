import { Injectable, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  async getUsers(userId: string) {
    if (!(await this.authService.adminAuth(userId))) {
      throw new UnauthorizedException(
        this.i18n.t('dashboard.error.adminNotAuth'),
      );
    }
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        googleId: true,
        createdAt: true,
        role: true,
      },
    });
    let date: Date;
    return users.map((user) => {
      date = new Date(user.createdAt);
      return {
        ...user,
        createdAt: `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}, ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
      };
    });
  }
}
