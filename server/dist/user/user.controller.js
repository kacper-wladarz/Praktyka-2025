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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const login_user_dto_1 = require("./dtos/login-user.dto");
const register_user_dto_1 = require("./dtos/register-user.dto");
const google_login_user_dto_1 = require("./dtos/google-login-user.dto");
const google_registration_auth_dto_1 = require("./dtos/google-registration-auth.dto");
const update_last_opened_chat_dto_1 = require("./dtos/update-last-opened-chat.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async login(body) {
        return await this.userService.loginUser(body.login, body.password);
    }
    getUserData(req) {
        return { login: req['login'] };
    }
    async registration(body) {
        return await this.userService.registerUser(body.login, body.password, body.repeatedPassword);
    }
    async googleLogin(body) {
        return await this.userService.googleLoginUser(body.token);
    }
    async googleRegistration(body) {
        return await this.userService.googleRegistration(body.token);
    }
    async googleRegistrationCancel(authCode) {
        return await this.userService.googleRegistrationCancel(authCode);
    }
    async googleRegistrtionConfirm(authCode) {
        return await this.userService.googleRegistrationConfirm(authCode);
    }
    async getLastOpenedChat(req) {
        return await this.userService.getLastOpenedChat(req['user']);
    }
    async pdateLastOpenedChat(req, body) {
        return await this.userService.updateLastOpenedChat(req['user'], body.id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('data'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserData", null);
__decorate([
    (0, common_1.Post)('registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registration", null);
__decorate([
    (0, common_1.Post)('google-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_login_user_dto_1.GoogleLoginUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('google-auth/registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_registration_auth_dto_1.GoogleRegistrationAuth]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleRegistration", null);
__decorate([
    (0, common_1.Delete)('google-auth/registration/cancel/:authCode'),
    __param(0, (0, common_1.Param)('authCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleRegistrationCancel", null);
__decorate([
    (0, common_1.Put)('google-auth/registration/confirm/:authCode'),
    __param(0, (0, common_1.Param)('authCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "googleRegistrtionConfirm", null);
__decorate([
    (0, common_1.Get)('last-opened-chat'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLastOpenedChat", null);
__decorate([
    (0, common_1.Put)('last-opened-chat'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request,
        update_last_opened_chat_dto_1.UpdateLastOpenedChatDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "pdateLastOpenedChat", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map