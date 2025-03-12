import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getChatPath(userId: string, chatId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId, userId },
        select: { name: true, folderId: true },
      });

      if (chat.folderId === null) {
        return [chat.name];
      }
      let path: string[] = [];
      path.push(chat.name);
      let isRoot = false;
      let folderId = chat.folderId;

      while (!isRoot) {
        const folder = await this.prisma.folder.findUnique({
          where: { id: folderId, userId },
          select: { id: true, name: true, parentId: true },
        });

        path.push(folder.name);
        if (folder.parentId === null) {
          isRoot = true;
        } else {
          folderId = folder.parentId;
        }
      }

      return path.reverse();
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

  async updateStructureParentId(
    userId: string,
    type: 'CHAT' | 'FOLDER',
    structureId: string,
    parentId,
  ) {
    try {
      if (parentId === '') {
        parentId = null;
      }
      if (type === 'FOLDER') {
        const element = await this.prisma.folder.findUnique({
          where: { id: structureId },
          select: { name: true },
        });
        const isExist = await this.prisma.folder.findMany({
          where: { AND: [{ parentId }, { name: element.name }] },
        });
        if (isExist.length > 0) {
          throw new ConflictException('Taki folder w tym miejscu już istnieje');
        }
        const updatedFolder = await this.prisma.folder.update({
          where: { id: structureId },
          data: { parentId },
        });
        if (!updatedFolder) {
          throw new NotFoundException('Folder nie istnieje');
        }
      }
      if (type === 'CHAT') {
        const element = await this.prisma.chat.findUnique({
          where: { id: structureId },
          select: { name: true },
        });
        const isExist = await this.prisma.chat.findMany({
          where: { AND: [{ folderId: parentId }, { name: element.name }] },
        });
        if (isExist.length > 0) {
          throw new ConflictException('Taki czat w tym miejscu już istnieje');
        }
        const updatedChat = await this.prisma.chat.update({
          where: { id: structureId },
          data: { folderId: parentId },
        });
        if (!updatedChat) {
          throw new NotFoundException('Czat nie istnieje');
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          `Wystąpił błąd podczas przenoszenia ${type === 'CHAT' ? 'czatu' : 'folderu'}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
