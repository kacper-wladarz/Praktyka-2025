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
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(prismaService, configService) {
        this.configService = configService;
        this.prisma = prismaService;
        this.jwtSecret =
            this.configService.get('JWT_SECRET') ||
                '57a9f4703036c0d7688b14df13b694567bf990da2784735a4f4a800dca99a938c07801214e9e99fe2778d786e3fb6e1e2a61bc1571cf3fb28f20c3a384b84ffe';
    }
    async use(req, _, next) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                throw new common_1.HttpException('Brak tokena uwierzytelnijącego', common_1.HttpStatus.UNAUTHORIZED);
            }
            let id = null;
            await jwt.verify(token, this.jwtSecret, (error, decoded) => {
                if (error) {
                    throw new common_1.HttpException('Niepoprawny token uwierzytelniający', common_1.HttpStatus.UNAUTHORIZED);
                }
                else {
                    id = decoded.id;
                }
            });
            const user = await this.prisma.user.findUnique({
                where: { id },
                select: { id: true, login: true },
            });
            if (!user) {
                throw new common_1.HttpException('Użytkownik nie istnieje', common_1.HttpStatus.UNAUTHORIZED);
            }
            req['jwt'] = token;
            req['user'] = user.id;
            req['login'] = user.login;
            next();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd uwierzytelniania', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map