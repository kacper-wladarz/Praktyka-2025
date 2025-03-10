import { IsNotEmpty } from 'class-validator';

export class NewChatDTO {
  @IsNotEmpty({ message: 'Nazwa nie może być pusta' })
  name: string;

  @IsNotEmpty({ message: 'Wystąpił błąd podczas tworzenia czatu' })
  folderId: string;
}
