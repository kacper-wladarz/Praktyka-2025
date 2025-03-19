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
exports.FoldersController = void 0;
const common_1 = require("@nestjs/common");
const new_root_folder_dto_1 = require("./dtos/new-root-folder.dto");
const folders_service_1 = require("./folders.service");
const new_folder_dto_1 = require("./dtos/new-folder.dto");
let FoldersController = class FoldersController {
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    async getRootFolders(req) {
        return await this.foldersService.getRootFolders(req['user']);
    }
    async createRootFolder(req, body) {
        return await this.foldersService.createRootFolder(req['user'], body.name);
    }
    async createFolder(req, body) {
        return await this.foldersService.createFolder(req['user'], body.name, body.folderId);
    }
    async deleteFolder(folderId, req) {
        return await this.foldersService.deleteFolder(folderId, req['user']);
    }
};
exports.FoldersController = FoldersController;
__decorate([
    (0, common_1.Get)('list/root'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "getRootFolders", null);
__decorate([
    (0, common_1.Post)('root'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, new_root_folder_dto_1.NewRootFolderDTO]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "createRootFolder", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, new_folder_dto_1.NewFolderDTO]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "createFolder", null);
__decorate([
    (0, common_1.Delete)(':folderId'),
    __param(0, (0, common_1.Param)('folderId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], FoldersController.prototype, "deleteFolder", null);
exports.FoldersController = FoldersController = __decorate([
    (0, common_1.Controller)('folders'),
    __metadata("design:paramtypes", [folders_service_1.FoldersService])
], FoldersController);
//# sourceMappingURL=folders.controller.js.map