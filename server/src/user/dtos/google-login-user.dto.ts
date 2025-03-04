import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginUserDto {
  @IsString({ message: 'Wystąpił błąd podczas logowania' })
  @IsNotEmpty({ message: 'Wystąpił błąd podczas logowania' })
  token: string;
}
