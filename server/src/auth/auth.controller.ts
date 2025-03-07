import { Controller, Get, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('')
  auth(@Req() req: Request) {
    return { jwt: req['jwt'], login: req['login'] };
  }
}
