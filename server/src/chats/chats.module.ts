import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatsService } from './chats.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
