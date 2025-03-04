import { IsNotEmpty } from 'class-validator';

export class GoogleRegistrationAuth {
  @IsNotEmpty({ message: 'Wystąpił błąd podczas rejestracji użytkownika' })
  token: string;
}
