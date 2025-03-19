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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const openai_1 = require("openai");
const tiktoken_1 = require("tiktoken");
let ChatsService = class ChatsService {
    constructor(prismaService, configService) {
        this.configService = configService;
        this.openAIModel = 'gpt-4o';
        this.enc = (0, tiktoken_1.encoding_for_model)(this.openAIModel);
        this.prisma = prismaService;
        this.openAIClient = new openai_1.default({
            baseURL: 'https://models.inference.ai.azure.com',
            apiKey: this.configService.get('OPEN_AI_KEY'),
        });
    }
    openAICountTokens(text) {
        return this.enc.decode(text).length;
    }
    async isExist(name, folderId, userId) {
        const isExist = await this.prisma.chat.findMany({
            where: { AND: [{ name }, { folderId }, { userId }] },
        });
        if (isExist.length > 0) {
            throw new common_1.ConflictException('Taki czat na tym poziomie już istnieje');
        }
    }
    async getRootChats(userId) {
        try {
            const chats = await this.prisma.chat.findMany({
                where: { AND: [{ userId }, { folderId: null }] },
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true },
            });
            return { chats };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas pobierania czatów', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createRootChat(userId, name) {
        try {
            await this.isExist(name, null, userId);
            const chat = await this.prisma.chat.create({
                data: { userId, name },
                select: { id: true, name: true },
            });
            return { chat };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas tworzenia czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createChat(userId, name, folderId) {
        try {
            await this.isExist(name, folderId, userId);
            const chat = await this.prisma.chat.create({
                data: { userId, name, folderId },
            });
            return { chat: { ...chat, type: 'CHAT' } };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas tworzenia czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getMessages(chatId) {
        try {
            const messages = await this.prisma.message.findMany({
                where: { chatId },
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    body: true,
                    userId: true,
                },
            });
            return { messages };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas pobierania historii czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createMessage(userId, chatId, question) {
        try {
            const message = await this.prisma.message.create({
                data: { body: question, userId, chatId },
                select: { id: true, body: true, userId: true },
            });
            if (!message)
                throw new common_1.InternalServerErrorException('Wystąpił błąd podczas tworzenia wiadomości');
            return { message };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas zadawania pytania', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async generateAnswer(userId, chatId, messageId) {
        try {
            const question = await this.prisma.message.findUnique({
                where: { userId, id: messageId, chatId },
                select: { body: true },
            });
            if (!question) {
                throw new common_1.NotFoundException('Wystąpił błąd podczas pobierania pytania');
            }
            const messages = await this.prisma.message.findMany({
                where: { chatId },
                select: { body: true, userId: true },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            const convertedMessages = messages.map((message) => ({
                role: message.userId ? 'user' : 'assistant',
                content: message.body,
            }));
            let selectedMessages = [];
            let totalTokens = 0;
            for (let i = convertedMessages.length - 1; i >= 0; i--) {
                const tokensInMessage = this.openAICountTokens(convertedMessages[i].role) +
                    this.openAICountTokens(convertedMessages[i].content);
                if (totalTokens + tokensInMessage > 8000) {
                    break;
                }
                totalTokens += tokensInMessage;
                selectedMessages.push(convertedMessages[i]);
            }
            if (selectedMessages[selectedMessages.length - 1].role === 'user') {
                selectedMessages.pop();
            }
            const openAIData = await this.openAIClient.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'Odpowiadaj na wszystkie pytania w sposób dokładny i szczegółowy',
                    },
                    ...selectedMessages.reverse(),
                    { role: 'user', content: question.body },
                ],
                model: this.openAIModel,
                temperature: 1,
                max_tokens: 4096,
                top_p: 1,
                frequency_penalty: 0.4,
            });
            const response = openAIData.choices[0].message.content;
            if (!response)
                throw new common_1.InternalServerErrorException('Wystąpił błąd podczas generowania odpowiedzi');
            const answer = await this.prisma.message.create({
                data: { body: response, userId: null, chatId },
                select: { id: true, body: true, userId: true },
            });
            return { answer };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas generowania odpowiedzi', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deleteChat(id, userId) {
        try {
            await this.prisma.chat.delete({ where: { userId, id } });
            return;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas usuwania czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ChatsService);
//# sourceMappingURL=chats.service.js.map