import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class ChatsService {
  private prisma;
  private openAIClient;

  constructor(
    prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.prisma = prismaService;
    this.openAIClient = new OpenAI({
      baseURL: 'https://models.inference.ai.azure.com',
      apiKey: this.configService.get('OPEN_AI_KEY'),
    });
  }

  private async isExist(name: string, folderId: string | null, userId: string) {
    const isExist = await this.prisma.chat.findMany({
      where: { AND: [{ name }, { folderId }, { userId }] },
    });

    if (isExist.length > 0) {
      throw new ConflictException('Taki czat na tym poziomie już istnieje');
    }
  }

  async getChat(userId: string, chatId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId, userId },
        select: {
          id: true,
          name: true,
          Message: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              body: true,
              createdAt: true,
            },
          },
        },
      });
      if (!chat) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { lastOpenedChat: null },
        });
        throw new NotFoundException('Czat nie istnieje');
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: { lastOpenedChat: chatId },
      });
      return { ...chat };
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

  async getRootChats(userId: string) {
    try {
      const chats = await this.prisma.chat.findMany({
        where: { AND: [{ userId }, { folderId: null }] },
        orderBy: { createdAt: 'desc' },
      });
      return {
        chats: [
          ...chats.map((chat) => ({
            id: chat.id,
            name: chat.name,
            userId: chat.userId,
            parentId: chat.folderId,
          })),
        ],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas pobierania czatów',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createRootChat(userId: string, name: string) {
    try {
      await this.isExist(name, null, userId);
      await this.prisma.chat.create({
        data: { userId, name },
      });
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas tworzenia czatu',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createChat(userId: string, name: string, folderId: string) {
    try {
      await this.isExist(name, folderId, userId);
      await this.prisma.chat.create({
        data: { userId, name, folderId },
      });
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas tworzenia czatu',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas pobierania historii czatu',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createMessage(userId: string, chatId: string, question: string) {
    try {
      const message = await this.prisma.message.create({
        data: { body: question, userId, chatId },
      });

      if (!message)
        throw new InternalServerErrorException(
          'Wystąpił błąd podczas tworzenia wiadomości',
        );

      const openAIData = await this.openAIClient.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'Odpowiadaj na wszystkie pytania w sposób dokładny i szczegółowy',
          },
          { role: 'user', content: message.body },
        ],
        model: 'gpt-4o',
        temperature: 1,
        max_tokens: 512,
        top_p: 1,
        frequency_penalty: 0.4,
      });
      const response = openAIData.choices[0].message.content;
      if (!response)
        throw new InternalServerErrorException(
          'Wystąpił błąd podczas generowania odpowiedzi',
        );

      await this.prisma.message.create({
        data: { body: response, userId: null, chatId },
      });
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas generowania odpowiedzi',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
