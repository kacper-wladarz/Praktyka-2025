import { PrismaService } from 'src/prisma/prisma.service';
export declare class FoldersService {
    private prisma;
    constructor(prismaService: PrismaService);
    private isExist;
    getRootFolders(userId: string): Promise<{
        folders: any;
    }>;
    createRootFolder(userId: string, name: string): Promise<{
        folder: any;
    }>;
    createFolder(userId: string, name: string, folderId: string): Promise<{
        folder: any;
    }>;
    deleteFolder(folderId: string, userId: string): Promise<void>;
}
