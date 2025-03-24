import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async auth(@Req() req: Request) {
    return { jwt: req['jwt'], login: req['login'] };
  }

  @Get('admin')
  async adminAuth(@Req() req: Request) {
    return await this.authService.adminAuth(req['user']);
  }

  @Post('pin')
  async checkPIN(@Req() req: Request, @Body() body: { pin: string }) {
    return await this.authService.checkPIN(req['user'], body.pin);
  }

  @Patch('pin/expire')
  async expirePIN(@Req() req: Request) {
    return await this.authService.expirePIN(req['user']);
  }
}
