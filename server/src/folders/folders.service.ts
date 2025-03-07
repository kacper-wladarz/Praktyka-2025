import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FoldersService {
  private prisma;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
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
      const isExist = await this.prisma.folder.findMany({
        where: { AND: [{ name }, { parentId: null }] },
      });

      if (isExist.length > 0) {
        throw new HttpException(
          'Taki folder na tym poziomie już istnieje',
          HttpStatus.BAD_REQUEST,
        );
      }

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
}
