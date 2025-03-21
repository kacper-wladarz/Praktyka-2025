import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginUserDto {
  @IsNotEmpty({
    message: i18nValidationMessage('user.DTO.incorrectLoginCredentials'),
  })
  @IsEmail(
    {},
    { message: i18nValidationMessage('user.DTO.incorrectLoginCredentials') },
  )
  login: string;

  @IsNotEmpty({
    message: i18nValidationMessage('user.DTO.incorrectLoginCredentials'),
  })
  password: string;
}
