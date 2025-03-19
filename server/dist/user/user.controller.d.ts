import { UserService } from './user.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { GoogleLoginUserDto } from './dtos/google-login-user.dto';
import { GoogleRegistrationAuth } from './dtos/google-registration-auth.dto';
import { UpdateLastOpenedChatDTO } from './dtos/update-last-opened-chat.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    login(body: LoginUserDto): Promise<any>;
    getUserData(req: Request): {
        login: any;
    };
    registration(body: RegisterUserDto): Promise<any>;
    googleLogin(body: GoogleLoginUserDto): Promise<any>;
    googleRegistration(body: GoogleRegistrationAuth): Promise<any>;
    googleRegistrationCancel(authCode: string): Promise<any>;
    googleRegistrtionConfirm(authCode: string): Promise<any>;
    getLastOpenedChat(req: Request): Promise<any>;
    pdateLastOpenedChat(req: Request, body: UpdateLastOpenedChatDTO): Promise<any>;
}
