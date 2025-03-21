import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StructuresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getStructuresList(userId: string, folderId: string) {
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
  }

  async getChatPath(userId: string, chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId, userId },
      select: { name: true, folderId: true },
    });

    if (!chat) {
      throw new NotFoundException(
        this.i18n.t('structures.error.chatPathError'),
      );
    }

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

      if (!folder) {
        return [chat.name];
      }

      path.push(folder.name);
      if (folder.parentId === null) {
        isRoot = true;
      } else {
        folderId = folder.parentId;
      }
    }

    return path.reverse();
  }

  async updateStructureParentId(
    userId: string,
    type: 'CHAT' | 'FOLDER',
    structureId: string,
    parentId: string | null,
  ) {
    if (parentId === '') {
      parentId = null;
    }
    if (type === 'FOLDER') {
      const element = await this.prisma.folder.findUnique({
        where: { id: structureId },
        select: { name: true },
      });
      const isExist = await this.prisma.folder.findMany({
        where: {
          AND: [
            { userId },
            { parentId },
            { name: element?.name },
            { id: { not: structureId } },
          ],
        },
      });
      if (isExist.length > 0) {
        throw new ConflictException(
          this.i18n.t('structures.error.folderExists'),
        );
      }
      const updatedFolder = await this.prisma.folder.update({
        where: { id: structureId },
        data: { parentId },
      });
      if (!updatedFolder) {
        throw new NotFoundException(
          this.i18n.t('structures.error.folderNotExist'),
        );
      }
    }
    if (type === 'CHAT') {
      const element = await this.prisma.chat.findUnique({
        where: { id: structureId },
        select: { name: true },
      });
      const isExist = await this.prisma.chat.findMany({
        where: {
          AND: [
            { userId },
            { folderId: parentId },
            { name: element?.name },
            { id: { not: structureId } },
          ],
        },
      });
      if (isExist.length > 0) {
        throw new ConflictException(this.i18n.t('structures.error.chatExists'));
      }
      const updatedChat = await this.prisma.chat.update({
        where: { id: structureId },
        data: { folderId: parentId },
      });
      if (!updatedChat) {
        throw new NotFoundException(
          this.i18n.t('structures.error.chatNotExist'),
        );
      }
    }
  }
}
