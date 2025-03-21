import { Controller, Get, Req } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  async auth(@Req() req: Request) {
    return { jwt: req['jwt'], login: req['login'] };
  }
}
