import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GoogleLoginUserDto {
  @IsString({ message: i18nValidationMessage('user.DTO.loginError') })
  @IsNotEmpty({ message: i18nValidationMessage('user.DTO.loginError') })
  token: string;
}
