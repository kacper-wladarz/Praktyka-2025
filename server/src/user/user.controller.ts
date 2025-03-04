import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { GoogleLoginUserDto } from './dtos/google-login-user.dto';
import { GoogleRegistrationAuth } from './dtos/google-registration-auth.dto';

@Controller('user')
export class UserController {
  private userService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post('/login')
  login(@Body() body: LoginUserDto) {
    return this.userService.loginUser(body.login, body.password);
  }

  @Post('google-login')
  googleLogin(@Body() body: GoogleLoginUserDto) {
    return this.userService.googleLoginUser(body.token);
  }

  @Post('/registration')
  registration(@Body() body: RegisterUserDto) {
    return this.userService.registerUser(
      body.login,
      body.password,
      body.repeatPassword,
    );
  }

  @Post('google-auth/registration')
  googleRegistration(@Body() body: GoogleRegistrationAuth) {
    return this.userService.googleRegistration(body.token);
  }
}
