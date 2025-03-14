import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StructuresController } from './structures.controller';
import { StructuresService } from './structures.service';

@Module({
  imports: [PrismaModule],
  controllers: [StructuresController],
  providers: [StructuresService],
})
export class StructuresModule {}
