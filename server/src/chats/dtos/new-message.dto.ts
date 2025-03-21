import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class NewMessageDTO {
  @IsNotEmpty({ message: i18nValidationMessage('chats.DTO.emptyMessage') })
  question: string;
}
