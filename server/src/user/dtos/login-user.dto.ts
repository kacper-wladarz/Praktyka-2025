import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Błędne dane logowania' })
  @IsEmail({}, { message: 'Błędne dane logowania' })
  login: string;

  @IsNotEmpty({ message: 'Błędne dane logowania' })
  password: string;
}
