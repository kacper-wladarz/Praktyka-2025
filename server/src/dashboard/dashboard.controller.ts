import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DashboardService } from './dashboard.service';
import { NewUserDTO } from './dtos/new-user.dto';
import { UpdatedUserDTO } from './dtos/updated-user.dto';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('users')
  async getUsers(
    @Req() req: Request,
    @Query('login') login: string,
    @Query('role') role: 'USER' | 'ADMIN' | 'ALL',
  ) {
    return await this.dashboardService.getUsers(req['user'], login, role);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string, @Req() req: Request) {
    return await this.dashboardService.getUser(id, req['user']);
  }

  @Post('users/create')
  async createUser(@Body() body: NewUserDTO, @Req() req: Request) {
    return await this.dashboardService.createUser(
      body.login,
      body.password,
      body.role as 'ADMIN' | 'USER',
      req['user'],
    );
  }

  @Delete('users/delete/:id')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    return await this.dashboardService.deleteUser(id, req['user']);
  }

  @Get('users/to-update/:id')
  async getUserToUpdate(@Param('id') id: string, @Req() req: Request) {
    return await this.dashboardService.getUserToUpdate(id, req['user']);
  }

  @Put('users/update/:id')
  async updateUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdatedUserDTO,
  ) {
    return await this.dashboardService.updateUser(id, body, req['user']);
  }

  @Get('settings')
  async getSettings(@Req() req: Request) {
    return await this.dashboardService.getSettings(req['user']);
  }

  @Put('settings')
  async updateSettings(
    @Req() req: Request,
    @Body() body: { settings: Record<string, string> },
  ) {
    return await this.dashboardService.updateSettings(
      body.settings,
      req['user'],
    );
  }

  @Get('stats')
  async getStats(@Req() req: Request) {
    return this.dashboardService.getStats(req['user']);
  }
}
