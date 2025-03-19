"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const new_root_chat_dto_1 = require("./dtos/new-root-chat.dto");
const new_chat_dto_1 = require("./dtos/new-chat.dto");
const new_message_dto_1 = require("./dtos/new-message.dto");
let ChatsController = class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    async getRootChats(req) {
        return await this.chatsService.getRootChats(req['user']);
    }
    async reateRootChat(req, body) {
        return await this.chatsService.createRootChat(req['user'], body.name);
    }
    async createChat(req, body) {
        return await this.chatsService.createChat(req['user'], body.name, body.folderId);
    }
    async getMessages(id) {
        return await this.chatsService.getMessages(id);
    }
    async createMessage(id, req, body) {
        return await this.chatsService.createMessage(req['user'], id, body.question);
    }
    async generateAnswer(id, messageId, req) {
        return await this.chatsService.generateAnswer(req['user'], id, messageId);
    }
    async deleteChat(id, req) {
        return await this.chatsService.deleteChat(id, req['user']);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.Get)('list/root'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getRootChats", null);
__decorate([
    (0, common_1.Post)('root'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, new_root_chat_dto_1.NewRootChatDTO]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "reateRootChat", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, new_chat_dto_1.NewChatDTO]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createChat", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request,
        new_message_dto_1.NewMessageDTO]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Post)(':id/messages/:messageId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Request]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "generateAnswer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "deleteChat", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map