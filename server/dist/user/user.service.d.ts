import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private configService;
    private prisma;
    private jwtSecret;
    private client;
    private googleClientId;
    constructor(prismaService: PrismaService, configService: ConfigService);
    private generateJWT;
    private verifyGoogleToken;
    loginUser(login: string, password: string): Promise<{
        jwt: string;
    }>;
    registerUser(login: string, password: string, repeatedPassword: string): Promise<{
        jwt: string;
    }>;
    googleLoginUser(token: string): Promise<{
        jwt: string;
    }>;
    googleRegistration(token: string): Promise<{
        authCode: string;
        email: any;
    }>;
    googleRegistrationCancel(authCode: string): Promise<{
        message: string;
    }>;
    googleRegistrationConfirm(authCode: string): Promise<{
        jwt: string;
    }>;
    getLastOpenedChat(userId: string): Promise<any>;
    updateLastOpenedChat(userId: string, chatId: string): Promise<{
        chatId: string;
    }>;
}
