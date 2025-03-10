import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoldersService {
  private prisma;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  private async isExist(name: string, folderId: string | null, userId: string) {
    const isExist = await this.prisma.folder.findMany({
      where: { AND: [{ name }, { parentId: folderId }, { userId }] },
    });

    if (isExist.length > 0) {
      throw new ConflictException('Taki folder na tym poziomie już istnieje');
    }
  }

  async getRootFolders(userId: string) {
    try {
      const folders = await this.prisma.folder.findMany({
        where: { AND: [{ userId }, { parentId: null }] },
        orderBy: { createdAt: 'desc' },
      });
      return {
        folders: [
          ...folders.map((folder) => ({
            id: folder.id,
            name: folder.name,
            userId: folder.userId,
            parentId: folder.parentId,
          })),
        ],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas pobierania folderów',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createRootFolder(userId: string, name: string) {
    try {
      await this.isExist(name, null, userId);
      await this.prisma.folder.create({
        data: { userId, name },
      });
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas tworzenia folderu',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createFolder(userId: string, name: string, folderId: string) {
    try {
      await this.isExist(name, folderId, userId);
      await this.prisma.folder.create({
        data: { name, parentId: folderId, userId },
      });
      return;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error(error);
        throw new HttpException(
          'Wystąpił błąd podczas tworzenia folderu',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
