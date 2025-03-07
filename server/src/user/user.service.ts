import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { JWTOptions, OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class UserService {
  private prisma;
  private jwtSecret =
    process.env.JWT_SECRET ||
    '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  private generateJWT(userId: string) {
    try {
      const options: jwt.SignOptions = { expiresIn: '1d' };
      if (!userId) {
        throw new HttpException(
          'Brak tokenu uwierzytelniajęcego',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return jwt.sign({ id: userId }, this.jwtSecret, options);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async verifyGoogleToken(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas weryfikacji użytkownika przez Google',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async loginUser(login: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { login } });

      if (!user) {
        throw new HttpException(
          'Błędne dane logowania',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Błędne dane logowania',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwt = this.generateJWT(user.id);
      return { jwt };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas logowania',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async registerUser(
    login: string,
    password: string,
    repeatedPassword: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({ where: { login } });
      if (user) {
        throw new HttpException(
          'Taki użytkownik juz istnieje',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (password !== repeatedPassword) {
        throw new HttpException(
          'Hasła muszą być takie same',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(
        password,
        await bcrypt.genSalt(10),
      );

      const createdUser = await this.prisma.user.create({
        data: { login, password: hashedPassword },
      });

      const jwt = this.generateJWT(createdUser.id);

      return { jwt };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas rejestracji',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async googleLoginUser(token: string) {
    try {
      const payload = await this.verifyGoogleToken(token);
      if (!payload) {
        throw new HttpException(
          'Wystąpił błąd podczas weryfikacji Google',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { login: payload.email },
      });

      if (!user || user.googleId !== payload.sub) {
        throw new HttpException(
          'Użytkownik nie istnieje',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const jwt = this.generateJWT(user.id);
      return { jwt };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas weryfikacji Google',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async googleRegistration(token: string) {
    const authCode = v4();
    try {
      const payload = await this.verifyGoogleToken(token);

      if (!payload) {
        throw new HttpException(
          'Wystąpił błąd podczas weryfikacji użytkownika przez Google',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { login: payload.email },
      });

      if (user) {
        throw new HttpException(
          'Taki użytkownik juz istnieje',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.user.create({
        data: {
          login: payload.email,
          authCode,
          googleId: payload.sub,
          confirmed: false,
        },
      });
      return { authCode, email: payload.email };
    } catch (error) {
      await this.prisma.user.delete({ where: { authCode } });
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas rejestracji użytkownika',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async googleRegistrationCancel(authCode: string) {
    try {
      if (!authCode) {
        throw new HttpException(
          'Wymagany jest kod autoryzacji',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.prisma.user.delete({ where: { authCode } });
      return { message: 'Pomyślnie anulowano rejestrację' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas anulowania rejestracji użytkownika',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async googleRegistrationConfirm(authCode: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { authCode },
      });
      const jwt = this.generateJWT(user.id);
      await this.prisma.user.update({
        where: { authCode },
        data: { authCode: null, confirmed: true },
      });
      return { jwt };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas rejestracji użytkownika',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateLastOpenedChat(userId: string, chatId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastOpenedChat: chatId },
      });
      return { chatId };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas otwierania czatu',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
