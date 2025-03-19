import { NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthMiddleware implements NestMiddleware {
    private configService;
    private prisma;
    private jwtSecret;
    constructor(prismaService: PrismaService, configService: ConfigService);
    use(req: Request, _: Response, next: NextFunction): Promise<void>;
}
