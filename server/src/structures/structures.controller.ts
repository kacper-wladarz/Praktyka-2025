import { Controller, Get, Query, Req } from '@nestjs/common';
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
}
