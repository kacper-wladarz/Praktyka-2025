import { PrismaService } from 'src/prisma/prisma.service';
export declare class StructuresService {
    private prisma;
    constructor(prismaService: PrismaService);
    getStructuresList(userId: string, folderId: string): Promise<{
        list: any[];
    }>;
    getChatPath(userId: string, chatId: string): Promise<any[]>;
    updateStructureParentId(userId: string, type: 'CHAT' | 'FOLDER', structureId: string, parentId: any): Promise<void>;
}
