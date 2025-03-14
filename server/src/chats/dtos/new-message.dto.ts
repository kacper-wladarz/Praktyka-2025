import { IsNotEmpty } from 'class-validator';

export class NewMessageDTO {
  @IsNotEmpty({ message: 'Wiadomość nie może byc pusta' })
  question: string;
}
