import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StructuresService {
  private prisma;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  async getStructuresList(userId: string, folderId: string) {
    try {
      const folders = await this.prisma.folder.findMany({
        where: { AND: [{ userId }, { parentId: folderId }] },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true },
      });
      const chats = await this.prisma.chat.findMany({
        where: { AND: [{ userId }, { folderId }] },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true },
      });
      return {
        list: [
          ...folders.map((folder) => ({ ...folder, type: 'FOLDER' })),
          ...chats.map((chat) => ({ ...chat, type: 'CHAT' })),
        ],
      };
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
