import { StructuresService } from './structures.service';
export declare class StructuresController {
    private structuresService;
    constructor(structuresService: StructuresService);
    getStructuresList(folderId: string, req: Request): Promise<any>;
    getChatPath(chatId: string, req: Request): Promise<any>;
    updateStructureParentId(type: 'CHAT' | 'FOLDER', structureId: string, body: {
        parentId: string;
    }, req: Request): Promise<any>;
}
