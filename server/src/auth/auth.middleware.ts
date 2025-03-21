import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private jwtSecret;

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.jwtSecret =
      this.configService.get('JWT_SECRET') ||
      '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';
  }

  async use(req: Request, _: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(this.i18n.t('auth.error.emptyToken'));
    }

    let id: string | null = null;

    await jwt.verify(token, this.jwtSecret, (error, decoded) => {
      if (error) {
        throw new UnauthorizedException(this.i18n.t('auth.error.invalidToken'));
      } else {
        id = decoded.id;
      }
    });

    if (!id) {
      throw new UnauthorizedException(this.i18n.t('auth.error.invalidToken'));
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, login: true },
    });

    if (!user) {
      throw new UnauthorizedException(this.i18n.t('auth.error.userNotExists'));
    }

    req['jwt'] = token;
    req['user'] = user.id;
    req['login'] = user.login;

    next();
  }
}
