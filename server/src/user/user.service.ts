import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  private jwtSecret;
  private client;
  private googleClientId;

  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private configService: ConfigService,
  ) {
    this.jwtSecret =
      this.configService.get('JWT_SECRET') ||
      '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';
    this.client = new OAuth2Client(this.jwtSecret);
    this.googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
  }

  private generateJWT(userId: string) {
    const options: jwt.SignOptions = { expiresIn: '1d' };
    if (!userId) {
      throw new UnauthorizedException(this.i18n.t('user.error.noAuthToken'));
    }
    return jwt.sign({ id: userId }, this.jwtSecret, options);
  }

  private async verifyGoogleToken(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.googleClientId,
    });
    const payload = ticket.getPayload();
    return payload;
  }

  async getUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('user.error.userNotFound'));
    }

    return { login: user.login, role: user.role };
  }

  async loginUser(login: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('user.error.incorrectLoginCredentials'),
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.i18n.t('user.error.incorrectLoginCredentials'),
      );
    }

    const jwt = this.generateJWT(user.id);
    return { jwt };
  }

  async registerUser(
    login: string,
    password: string,
    repeatedPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (user) {
      throw new BadRequestException(this.i18n.t('user.error.userExists'));
    }

    if (password !== repeatedPassword) {
      throw new BadRequestException(this.i18n.t('user.error.samePasswords'));
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
  }

  async googleLoginUser(token: string) {
    const payload = await this.verifyGoogleToken(token);
    if (!payload) {
      throw new UnauthorizedException(
        this.i18n.t('user.error.googleVerification'),
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { login: payload.email },
    });

    if (!user || user.googleId !== payload.sub) {
      throw new NotFoundException(this.i18n.t('user.error.userNotFound'));
    }

    const jwt = this.generateJWT(user.id);
    return { jwt };
  }

  async googleRegistration(token: string) {
    const authCode = v4();
    const payload = await this.verifyGoogleToken(token);

    if (!payload) {
      throw new UnauthorizedException(
        this.i18n.t('user.error.googleVerification'),
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { login: payload.email },
    });

    if (user) {
      const tempUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { confirmed: true },
      });
      if (tempUser?.confirmed) {
        throw new BadRequestException(this.i18n.t('user.error.userExists'));
      } else {
        await this.prisma.user.update({
          where: { login: user.login },
          data: { authCode },
        });
        return { authCode, email: user.login };
      }
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
  }

  async googleRegistrationCancel(authCode: string) {
    if (!authCode) {
      throw new BadRequestException(this.i18n.t('user.error.authCodeRequired'));
    }
    await this.prisma.user.delete({ where: { authCode } });
    return { message: this.i18n.t('user.success.registrationCanceled') };
  }

  async googleRegistrationConfirm(authCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { authCode },
    });
    if (!user) {
      throw new BadRequestException(
        this.i18n.t('user.error.registrationError'),
      );
    }
    const jwt = this.generateJWT(user.id);
    await this.prisma.user.update({
      where: { authCode },
      data: { authCode: null, confirmed: true },
    });
    return { jwt };
  }

  async getLastOpenedChat(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, lastOpenedChat: true },
    });

    if (!user) {
      throw new NotFoundException(this.i18n.t('user.error.userNotFound'));
    }

    if (!user.lastOpenedChat) {
      return { chatId: null };
    }

    const chat = await this.prisma.chat.findUnique({
      where: { id: user.lastOpenedChat },
    });
    if (chat) {
      return { chatId: chat.id };
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { lastOpenedChat: null },
    });
    return;
  }

  async updateLastOpenedChat(userId: string, chatId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastOpenedChat: chatId },
    });
    return { chatId };
  }
}
