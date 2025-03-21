import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class NewFolderDTO {
  @IsNotEmpty({ message: i18nValidationMessage('folders.DTO.emptyName') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage('folders.DTO.creatingError') })
  folderId: string;
}
