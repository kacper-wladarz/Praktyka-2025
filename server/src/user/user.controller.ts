import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { GoogleLoginUserDto } from './dtos/google-login-user.dto';
import { GoogleRegistrationAuth } from './dtos/google-registration-auth.dto';
import { UpdateLastOpenedChatDTO } from './dtos/update-last-opened-chat.dto';

@Controller('user')
export class UserController {
  private userService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return await this.userService.loginUser(body.login, body.password);
  }

  @Post('registration')
  async registration(@Body() body: RegisterUserDto) {
    return await this.userService.registerUser(
      body.login,
      body.password,
      body.repeatedPassword,
    );
  }

  @Post('google-login')
  async googleLogin(@Body() body: GoogleLoginUserDto) {
    return await this.userService.googleLoginUser(body.token);
  }

  @Post('google-auth/registration')
  async googleRegistration(@Body() body: GoogleRegistrationAuth) {
    return await this.userService.googleRegistration(body.token);
  }

  @Delete('google-auth/registration/cancel/:authCode')
  async googleRegistrationCancel(@Param('authCode') authCode: string) {
    return await this.userService.googleRegistrationCancel(authCode);
  }

  @Put('google-auth/registration/confirm/:authCode')
  async googleRegistrtionConfirm(@Param('authCode') authCode: string) {
    return await this.userService.googleRegistrationConfirm(authCode);
  }

  @Get('last-opened-chat')
  async getLastOpenedChat(@Req() req: Request) {
    return await this.userService.getLastOpenedChat(req['user']);
  }

  @Put('last-opened-chat')
  async pdateLastOpenedChat(
    @Req() req: Request,
    @Body() body: UpdateLastOpenedChatDTO,
  ) {
    return await this.userService.updateLastOpenedChat(req['user'], body.id);
  }
}
