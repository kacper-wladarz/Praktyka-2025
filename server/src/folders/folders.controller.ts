import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { NewRootFolderDTO } from './dtos/new-root-folder.dto';
import { FoldersService } from './folders.service';

@Controller('folders')
export class FoldersController {
  private foldersService;

  constructor(foldersService: FoldersService) {
    this.foldersService = foldersService;
  }

  @Get('root')
  getRootFolders(@Req() req: Request) {
    return this.foldersService.getRootFolders(req['user']);
  }

  @Post('root')
  async createRootFolder(@Req() req: Request, @Body() body: NewRootFolderDTO) {
    return this.foldersService.createRootFolder(req['user'], body.name);
  }
}
