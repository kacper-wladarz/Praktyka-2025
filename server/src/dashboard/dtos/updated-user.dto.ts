import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  IsDate,
  IsEmail,
  MinLength,
  Length,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdatedUserDTO {
  @IsString()
  id: string;

  @IsString()
  @IsEmail(
    {},
    { message: i18nValidationMessage('dashboard.DTO.updateBadLogin') },
  )
  login: string;

  @ValidateIf((obj) => obj.password !== '')
  @MinLength(8, {
    message: i18nValidationMessage('dashboard.DTO.updatePasswordMinLength'),
  })
  password: string;

  lastOpenedChat: string;

  @IsEnum(['ADMIN', 'USER'], {
    message: i18nValidationMessage('dashboard.DTO.updateBadRole'),
  })
  role: 'ADMIN' | 'USER';

  @IsString()
  @Length(4, 4, {
    message: i18nValidationMessage('dashboard.DTO.updatePINLength'),
  })
  PIN?: string | null;
}
