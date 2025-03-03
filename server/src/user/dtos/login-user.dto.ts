import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Błędne dane logowania' })
  @IsEmail({}, { message: 'Błędne dane logowania' })
  login: string;

  @IsString({ message: 'Błędne dane logowania' })
  password: string;
}
