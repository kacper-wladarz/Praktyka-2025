import { IsOptional } from 'class-validator';

export class UpdateLastOpenedChatDTO {
  @IsOptional()
  id: string;
}
