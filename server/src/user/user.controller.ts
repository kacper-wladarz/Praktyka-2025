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
  login(@Body() body: LoginUserDto) {
    return this.userService.loginUser(body.login, body.password);
  }

  @Post('registration')
  registration(@Body() body: RegisterUserDto) {
    return this.userService.registerUser(
      body.login,
      body.password,
      body.repeatedPassword,
    );
  }

  @Post('google-login')
  googleLogin(@Body() body: GoogleLoginUserDto) {
    return this.userService.googleLoginUser(body.token);
  }

  @Post('google-auth/registration')
  googleRegistration(@Body() body: GoogleRegistrationAuth) {
    return this.userService.googleRegistration(body.token);
  }

  @Delete('google-auth/registration/cancel/:authCode')
  googleRegistrationCancel(@Param('authCode') authCode: string) {
    return this.userService.googleRegistrationCancel(authCode);
  }

  @Put('google-auth/registration/confirm/:authCode')
  googleRegistrtionConfirm(@Param('authCode') authCode: string) {
    return this.userService.googleRegistrationConfirm(authCode);
  }

  @Put('last-opened-chat')
  updateLastOpenedChat(
    @Req() req: Request,
    @Body() body: UpdateLastOpenedChatDTO,
  ) {
    return this.userService.updateLastOpenedChat(req['user'], body.id);
  }
}
