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
exports.StructuresController = void 0;
const common_1 = require("@nestjs/common");
const structures_service_1 = require("./structures.service");
let StructuresController = class StructuresController {
    constructor(structuresService) {
        this.structuresService = structuresService;
    }
    async getStructuresList(folderId, req) {
        return await this.structuresService.getStructuresList(req['user'], folderId);
    }
    async getChatPath(chatId, req) {
        return await this.structuresService.getChatPath(req['user'], chatId);
    }
    async updateStructureParentId(type, structureId, body, req) {
        return await this.structuresService.updateStructureParentId(req['user'], type, structureId, body.parentId);
    }
};
exports.StructuresController = StructuresController;
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('folder-id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "getStructuresList", null);
__decorate([
    (0, common_1.Get)('chat-path/:chatId'),
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "getChatPath", null);
__decorate([
    (0, common_1.Patch)(':type/:structureId'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('structureId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Request]),
    __metadata("design:returntype", Promise)
], StructuresController.prototype, "updateStructureParentId", null);
exports.StructuresController = StructuresController = __decorate([
    (0, common_1.Controller)('structures'),
    __metadata("design:paramtypes", [structures_service_1.StructuresService])
], StructuresController);
//# sourceMappingURL=structures.controller.js.map