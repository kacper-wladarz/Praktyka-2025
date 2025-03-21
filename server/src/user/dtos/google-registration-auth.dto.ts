import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GoogleRegistrationAuth {
  @IsNotEmpty({ message: i18nValidationMessage('user.DTO.registrationError') })
  token: string;
}
