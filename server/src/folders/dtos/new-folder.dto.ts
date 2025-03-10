import { IsNotEmpty } from 'class-validator';

export class NewFolderDTO {
  @IsNotEmpty({ message: 'Nazwa nie może być pusta' })
  name: string;

  @IsNotEmpty({ message: 'Wystąpił błąd podczas tworzenia folderu' })
  folderId: string;
}
