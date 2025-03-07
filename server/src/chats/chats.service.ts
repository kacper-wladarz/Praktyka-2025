import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatsService {
  private prisma;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  async getChat(userId: string, chatId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
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
        throw new HttpException('Czat nie istnieje', HttpStatus.BAD_REQUEST);
      }
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
      const isExist = await this.prisma.chat.findMany({
        where: { AND: [{ name }, { folderId: null }] },
      });

      if (isExist.length > 0) {
        throw new HttpException(
          'Taki czat na tym poziomie już istnieje',
          HttpStatus.BAD_REQUEST,
        );
      }

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
}
