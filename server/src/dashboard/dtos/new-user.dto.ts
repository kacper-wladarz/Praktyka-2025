import { IsEmail, IsIn, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class NewUserDTO {
  @IsString()
  @IsEmail(
    {},
    { message: i18nValidationMessage('dashboard.DTO.newUserInvalidData') },
  )
  login: string;
  @IsString()
  password: string;
  @IsIn(['ADMIN', 'USER'], {
    message: i18nValidationMessage('dashboard.DTO.newUserIncorrectRole'),
  })
  role: string;
}
