import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.jwtSecret =
      this.configService.get('JWT_SECRET') ||
      '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(this.i18n.t('auth.error.emptyToken'));
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string };
      if (!decoded || !decoded.id) {
        throw new UnauthorizedException(this.i18n.t('auth.error.invalidToken'));
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, login: true },
      });

      if (!user) {
        throw new UnauthorizedException(this.i18n.t('auth.error.userNotFound'));
      }

      request['jwt'] = token;
      request['user'] = user.id;
      request['login'] = user.login;

      return true;
    } catch (error) {
      throw new UnauthorizedException(this.i18n.t('auth.error.invalidToken'));
    }
  }
}
