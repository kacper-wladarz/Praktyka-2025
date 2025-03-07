import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { NewRootChatDTO } from './dtos/new-root-chat.dto';

@Controller('chats')
export class ChatsController {
  private chatsService;

  constructor(chatsService: ChatsService) {
    this.chatsService = chatsService;
  }

  @Get('root')
  getRootChats(@Req() req: Request) {
    return this.chatsService.getRootChats(req['user']);
  }

  @Get(':id')
  getChat(@Param('id') id: string, @Req() req: Request) {
    return this.chatsService.getChat(req['user'], id);
  }

  @Post('root')
  async createRootChat(@Req() req: Request, @Body() body: NewRootChatDTO) {
    return this.chatsService.createRootChat(req['user'], body.name);
  }
}
