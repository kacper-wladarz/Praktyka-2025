import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  loginUser(login: string, password: string) {
    console.log(login, password);
  }

  registerUser(login: string, password: string, repeatPassword: string) {}
}
