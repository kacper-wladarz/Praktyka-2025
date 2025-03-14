import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Błędne dane rejestracji' })
  @IsEmail({}, { message: 'Błędne dane rejestracji' })
  login: string;

  @IsNotEmpty({ message: 'Błędne dane rejestracji' })
  @MinLength(8, { message: 'Hasło musi mieć conajmniej 8 znaków' })
  password: string;

  @IsNotEmpty({ message: 'Błędne dane rejestracji' })
  repeatedPassword: string;
}
