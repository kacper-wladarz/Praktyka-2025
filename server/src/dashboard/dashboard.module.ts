import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService, AuthService],
})
export class DashboardModule {}
