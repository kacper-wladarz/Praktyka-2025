import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async adminAuth(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('auth.error.userNotFound'));
    }

    const date = new Date();
    if (user.PINexpires && date < user.PINexpires) {
      return true;
    }
    return false;
  }

  async checkPIN(userId: string, pin: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('auth.error.userNotFound'));
    }

    if (user.PIN === pin) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 5);
      await this.prisma.user.update({
        where: { id: userId },
        data: { PINexpires: date },
      });
      return true;
    }
    return false;
  }

  async expirePIN(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { PINexpires: null },
    });
    return;
  }
}
