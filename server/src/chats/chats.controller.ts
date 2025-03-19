import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { NewRootChatDTO } from './dtos/new-root-chat.dto';
import { NewChatDTO } from './dtos/new-chat.dto';
import { NewMessageDTO } from './dtos/new-message.dto';

@Controller('chats')
export class ChatsController {
  private chatsService;

  constructor(chatsService: ChatsService) {
    this.chatsService = chatsService;
  }

  @Get('list/root')
  async getRootChats(@Req() req: Request) {
    return await this.chatsService.getRootChats(req['user']);
  }

  @Post('root')
  async reateRootChat(@Req() req: Request, @Body() body: NewRootChatDTO) {
    return await this.chatsService.createRootChat(req['user'], body.name);
  }

  @Post()
  async createChat(@Req() req: Request, @Body() body: NewChatDTO) {
    return await this.chatsService.createChat(
      req['user'],
      body.name,
      body.folderId,
    );
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    return await this.chatsService.getMessages(id);
  }

  @Post(':id/messages')
  async createMessage(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: NewMessageDTO,
  ) {
    return await this.chatsService.createMessage(
      req['user'],
      id,
      body.question,
    );
  }

  @Post(':id/messages/:messageId')
  async generateAnswer(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Req() req: Request,
  ) {
    return await this.chatsService.generateAnswer(req['user'], id, messageId);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string, @Req() req: Request) {
    return await this.chatsService.deleteChat(id, req['user']);
  }
}
