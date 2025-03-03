import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';

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

  @Post('/registration')
  registration(@Body() body: RegisterUserDto) {
    return this.userService.registerUser(
      body.login,
      body.password,
      body.repeatPassword,
    );
  }
}
