import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private prisma;
  private jwtSecret;

  constructor(
    prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.prisma = prismaService;
    this.jwtSecret =
      this.configService.get('JWT_SECRET') ||
      '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';
  }

  async use(req: Request, _: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new HttpException(
          'Brak tokena uwierzytelnijącego',
          HttpStatus.UNAUTHORIZED,
        );
      }

      let id = null;

      await jwt.verify(token, this.jwtSecret, (error, decoded) => {
        if (error) {
          throw new HttpException(
            'Niepoprawny token uwierzytelniający',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          id = decoded.id;
        }
      });

      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, login: true },
      });

      if (!user) {
        throw new HttpException(
          'Użytkownik nie istnieje',
          HttpStatus.UNAUTHORIZED,
        );
      }

      req['jwt'] = token;
      req['user'] = user.id;
      req['login'] = user.login;

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd uwierzytelniania',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
