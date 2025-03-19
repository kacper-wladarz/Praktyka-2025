import { ChatsService } from './chats.service';
import { NewRootChatDTO } from './dtos/new-root-chat.dto';
import { NewChatDTO } from './dtos/new-chat.dto';
import { NewMessageDTO } from './dtos/new-message.dto';
export declare class ChatsController {
    private chatsService;
    constructor(chatsService: ChatsService);
    getRootChats(req: Request): Promise<any>;
    reateRootChat(req: Request, body: NewRootChatDTO): Promise<any>;
    createChat(req: Request, body: NewChatDTO): Promise<any>;
    getMessages(id: string): Promise<any>;
    createMessage(id: string, req: Request, body: NewMessageDTO): Promise<any>;
    generateAnswer(id: string, messageId: string, req: Request): Promise<any>;
    deleteChat(id: string, req: Request): Promise<any>;
}
