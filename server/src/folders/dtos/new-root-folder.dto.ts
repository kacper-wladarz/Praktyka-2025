import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class NewRootFolderDTO {
  @IsNotEmpty({ message: i18nValidationMessage('folders.DTO.emptyName') })
  name: string;
}
