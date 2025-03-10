import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { NewRootFolderDTO } from './dtos/new-root-folder.dto';
import { FoldersService } from './folders.service';
import { NewFolderDTO } from './dtos/new-folder.dto';

@Controller('folders')
export class FoldersController {
  private foldersService;

  constructor(foldersService: FoldersService) {
    this.foldersService = foldersService;
  }

  @Get('list/root')
  async getRootFolders(@Req() req: Request) {
    return await this.foldersService.getRootFolders(req['user']);
  }

  @Post('root')
  async createRootFolder(@Req() req: Request, @Body() body: NewRootFolderDTO) {
    return await this.foldersService.createRootFolder(req['user'], body.name);
  }

  @Post('')
  async createFolder(@Req() req: Request, @Body() body: NewFolderDTO) {
    await this.foldersService.createFolder(
      req['user'],
      body.name,
      body.folderId,
    );
  }
}
