import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RegisterUserDto {
  @IsNotEmpty({
    message: i18nValidationMessage('user.DTO.incorrectRegistrationData'),
  })
  @IsEmail(
    {},
    { message: i18nValidationMessage('user.DTO.incorrectRegistrationData') },
  )
  login: string;

  @IsNotEmpty({
    message: i18nValidationMessage('user.DTO.incorrectRegistrationData'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('user.DTO.minPasswordLength'),
  })
  password: string;

  @IsNotEmpty({
    message: i18nValidationMessage('user.DTO.incorrectRegistrationData'),
  })
  repeatedPassword: string;
}
