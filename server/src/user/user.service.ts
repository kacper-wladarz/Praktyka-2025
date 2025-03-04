import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { v4 } from 'uuid';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class UserService {
  loginUser(login: string, password: string) {
    console.log(login, password);
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      return null;
    }
  }

  async googleLoginUser(token: string) {
    const payload = this.verifyGoogleToken(token);
  }

  registerUser(login: string, password: string, repeatPassword: string) {}

  async googleRegistration(token: string) {
    try {
      const payload = await this.verifyGoogleToken(token);
      //zapytanie do bazy czy istnieje user z tym payload.email
      const authCode = v4();
      //zapisanie authCode do bazy
      return { authCode };
    } catch (error) {
      return null;
    }
  }
}
