import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatsService {
    private configService;
    private prisma;
    private openAIClient;
    private openAIModel;
    private enc;
    constructor(prismaService: PrismaService, configService: ConfigService);
    private openAICountTokens;
    private isExist;
    getRootChats(userId: string): Promise<{
        chats: any;
    }>;
    createRootChat(userId: string, name: string): Promise<{
        chat: any;
    }>;
    createChat(userId: string, name: string, folderId: string): Promise<{
        chat: any;
    }>;
    getMessages(chatId: string): Promise<{
        messages: any;
    }>;
    createMessage(userId: string, chatId: string, question: string): Promise<{
        message: any;
    }>;
    generateAnswer(userId: string, chatId: string, messageId: string): Promise<{
        answer: any;
    }>;
    deleteChat(id: string, userId: string): Promise<void>;
}
