import { ConflictException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoldersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  private async isExist(name: string, folderId: string | null, userId: string) {
    const isExist = await this.prisma.folder.findMany({
      where: { AND: [{ name }, { parentId: folderId }, { userId }] },
    });

    if (isExist.length > 0) {
      throw new ConflictException(this.i18n.t('folders.error.folderExist'));
    }
  }

  async getRootFolders(userId: string) {
    const folders = await this.prisma.folder.findMany({
      where: { AND: [{ userId }, { parentId: null }] },
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });
    return { folders };
  }

  async createRootFolder(userId: string, name: string) {
    await this.isExist(name, null, userId);
    const folder = await this.prisma.folder.create({
      data: { userId, name },
      select: { id: true, name: true },
    });
    return { folder };
  }

  async createFolder(userId: string, name: string, folderId: string) {
    await this.isExist(name, folderId, userId);
    const folder = await this.prisma.folder.create({
      data: { name, parentId: folderId, userId },
      select: { id: true, name: true },
    });
    return { folder: { ...folder, type: 'FOLDER' } };
  }

  async deleteFolder(folderId: string, userId: string) {
    await this.prisma.folder.delete({
      where: { userId, id: folderId },
    });
    return;
  }
}
