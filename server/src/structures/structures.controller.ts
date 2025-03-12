import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { StructuresService } from './structures.service';

@Controller('structures')
export class StructuresController {
  private structuresService;

  constructor(structuresService: StructuresService) {
    this.structuresService = structuresService;
  }

  @Get('list')
  async getStructuresList(
    @Query('folder-id') folderId: string,
    @Req() req: Request,
  ) {
    return await this.structuresService.getStructuresList(
      req['user'],
      folderId,
    );
  }

  @Get('chat-path/:chatId')
  async getChatPath(@Param('chatId') chatId: string, @Req() req: Request) {
    return await this.structuresService.getChatPath(req['user'], chatId);
  }

  @Patch(':type/:structureId')
  async updateStructureParentId(
    @Param('type') type: 'CHAT' | 'FOLDER',
    @Param('structureId') structureId: string,
    @Body() body: { parentId: string },
    @Req() req: Request,
  ) {
    return await this.structuresService.updateStructureParentId(
      req['user'],
      type,
      structureId,
      body.parentId,
    );
  }
}
