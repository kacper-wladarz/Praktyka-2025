import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class NewChatDTO {
  @IsNotEmpty({ message: i18nValidationMessage('chats.DTO.emptyName') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage('chats.DTO.creatingError') })
  folderId: string;
}
