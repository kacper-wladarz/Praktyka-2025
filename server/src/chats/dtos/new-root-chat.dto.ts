import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class NewRootChatDTO {
  @IsNotEmpty({ message: i18nValidationMessage('chats.DTO.emptyName') })
  name: string;
}
