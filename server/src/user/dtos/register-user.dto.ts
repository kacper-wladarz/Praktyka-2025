import { IsEmail, isEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'Błędne dane rejestracji' })
  @IsEmail({}, { message: 'Błędne dane rejestracji' })
  login: string;

  @IsString({ message: 'Błędne dane rejestracji' })
  password: string;

  @IsString({ message: 'Błędne dane rejestracji' })
  repeatPassword: string;
}
