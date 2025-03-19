import { NewRootFolderDTO } from './dtos/new-root-folder.dto';
import { FoldersService } from './folders.service';
import { NewFolderDTO } from './dtos/new-folder.dto';
export declare class FoldersController {
    private foldersService;
    constructor(foldersService: FoldersService);
    getRootFolders(req: Request): Promise<any>;
    createRootFolder(req: Request, body: NewRootFolderDTO): Promise<any>;
    createFolder(req: Request, body: NewFolderDTO): Promise<any>;
    deleteFolder(folderId: string, req: Request): Promise<any>;
}
