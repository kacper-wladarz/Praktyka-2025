import { IsNotEmpty } from 'class-validator';

export class NewRootChatDTO {
  @IsNotEmpty({ message: 'Nazwa nie może być pusta' })
  name: string;
}
