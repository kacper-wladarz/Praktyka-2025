import { IsNotEmpty } from 'class-validator';

export class NewRootFolderDTO {
  @IsNotEmpty({ message: 'Nazwa nie może być pusta' })
  name: string;
}
