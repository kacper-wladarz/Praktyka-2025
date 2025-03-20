"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
let UserService = class UserService {
    constructor(prismaService, configService) {
        this.configService = configService;
        this.jwtSecret =
            this.configService.get('JWT_SECRET') ||
                '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';
        this.prisma = prismaService;
        this.client = new google_auth_library_1.OAuth2Client(this.jwtSecret);
        this.googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
    }
    generateJWT(userId) {
        try {
            const options = { expiresIn: '1d' };
            if (!userId) {
                throw new common_1.HttpException('Brak tokenu uwierzytelniajęcego', common_1.HttpStatus.UNAUTHORIZED);
            }
            return jwt.sign({ id: userId }, this.jwtSecret, options);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async verifyGoogleToken(token) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: this.googleClientId,
            });
            const payload = ticket.getPayload();
            return payload;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas weryfikacji użytkownika przez Google', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async loginUser(login, password) {
        try {
            const user = await this.prisma.user.findUnique({ where: { login } });
            if (!user) {
                throw new common_1.HttpException('Błędne dane logowania', common_1.HttpStatus.UNAUTHORIZED);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.HttpException('Błędne dane logowania', common_1.HttpStatus.UNAUTHORIZED);
            }
            const jwt = this.generateJWT(user.id);
            return { jwt };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas logowania', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async registerUser(login, password, repeatedPassword) {
        try {
            console.log(login, password);
            const user = await this.prisma.user.findUnique({ where: { login } });
            if (user) {
                throw new common_1.HttpException('Taki użytkownik juz istnieje', common_1.HttpStatus.BAD_REQUEST);
            }
            if (password !== repeatedPassword) {
                throw new common_1.HttpException('Hasła muszą być takie same', common_1.HttpStatus.BAD_REQUEST);
            }
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
            const createdUser = await this.prisma.user.create({
                data: { login, password: hashedPassword },
            });
            const jwt = this.generateJWT(createdUser.id);
            return { jwt };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas rejestracji', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async googleLoginUser(token) {
        try {
            const payload = await this.verifyGoogleToken(token);
            if (!payload) {
                throw new common_1.HttpException('Wystąpił błąd podczas weryfikacji Google', common_1.HttpStatus.UNAUTHORIZED);
            }
            const user = await this.prisma.user.findUnique({
                where: { login: payload.email },
            });
            if (!user || user.googleId !== payload.sub) {
                throw new common_1.HttpException('Użytkownik nie istnieje', common_1.HttpStatus.UNAUTHORIZED);
            }
            const jwt = this.generateJWT(user.id);
            return { jwt };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas weryfikacji Google', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async googleRegistration(token) {
        const authCode = (0, uuid_1.v4)();
        try {
            const payload = await this.verifyGoogleToken(token);
            if (!payload) {
                throw new common_1.HttpException('Wystąpił błąd podczas weryfikacji użytkownika przez Google', common_1.HttpStatus.UNAUTHORIZED);
            }
            const user = await this.prisma.user.findUnique({
                where: { login: payload.email },
            });
            if (user) {
                const { confirmed } = await this.prisma.user.findUnique({
                    where: { id: user.id },
                    select: { confirmed: true },
                });
                if (confirmed) {
                    throw new common_1.HttpException('Taki użytkownik juz istnieje', common_1.HttpStatus.BAD_REQUEST);
                }
                else {
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
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas rejestracji użytkownika', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async googleRegistrationCancel(authCode) {
        try {
            if (!authCode) {
                throw new common_1.HttpException('Wymagany jest kod autoryzacji', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.prisma.user.delete({ where: { authCode } });
            return { message: 'Pomyślnie anulowano rejestrację' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas anulowania rejestracji użytkownika', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async googleRegistrationConfirm(authCode) {
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
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas rejestracji użytkownika', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getLastOpenedChat(userId) {
        try {
            return await this.prisma.user.findUnique({
                where: { id: userId },
                select: { lastOpenedChat: true },
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas otwierania czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateLastOpenedChat(userId, chatId) {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { lastOpenedChat: chatId },
            });
            return { chatId };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas otwierania czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map