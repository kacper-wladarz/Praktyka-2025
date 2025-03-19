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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StructuresService = class StructuresService {
    constructor(prismaService) {
        this.prisma = prismaService;
    }
    async getStructuresList(userId, folderId) {
        try {
            const folders = await this.prisma.folder.findMany({
                where: { AND: [{ userId }, { parentId: folderId }] },
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true },
            });
            const chats = await this.prisma.chat.findMany({
                where: { AND: [{ userId }, { folderId }] },
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true },
            });
            return {
                list: [
                    ...folders.map((folder) => ({ ...folder, type: 'FOLDER' })),
                    ...chats.map((chat) => ({ ...chat, type: 'CHAT' })),
                ],
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas otwierania czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getChatPath(userId, chatId) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: { id: chatId, userId },
                select: { name: true, folderId: true },
            });
            if (!chat) {
                throw new common_1.NotFoundException('Nie udało się pobrać ścieżki czatu');
            }
            if (chat.folderId === null) {
                return [chat.name];
            }
            let path = [];
            path.push(chat.name);
            let isRoot = false;
            let folderId = chat.folderId;
            while (!isRoot) {
                const folder = await this.prisma.folder.findUnique({
                    where: { id: folderId, userId },
                    select: { id: true, name: true, parentId: true },
                });
                path.push(folder.name);
                if (folder.parentId === null) {
                    isRoot = true;
                }
                else {
                    folderId = folder.parentId;
                }
            }
            return path.reverse();
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas otwierania czatu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updateStructureParentId(userId, type, structureId, parentId) {
        try {
            if (parentId === '') {
                parentId = null;
            }
            if (type === 'FOLDER') {
                const element = await this.prisma.folder.findUnique({
                    where: { id: structureId },
                    select: { name: true },
                });
                const isExist = await this.prisma.folder.findMany({
                    where: {
                        AND: [
                            { userId },
                            { parentId },
                            { name: element.name },
                            { id: { not: structureId } },
                        ],
                    },
                });
                if (isExist.length > 0) {
                    throw new common_1.ConflictException('Taki folder w tym miejscu już istnieje');
                }
                const updatedFolder = await this.prisma.folder.update({
                    where: { id: structureId },
                    data: { parentId },
                });
                if (!updatedFolder) {
                    throw new common_1.NotFoundException('Folder nie istnieje');
                }
            }
            if (type === 'CHAT') {
                const element = await this.prisma.chat.findUnique({
                    where: { id: structureId },
                    select: { name: true },
                });
                const isExist = await this.prisma.chat.findMany({
                    where: {
                        AND: [
                            { userId },
                            { folderId: parentId },
                            { name: element.name },
                            { id: { not: structureId } },
                        ],
                    },
                });
                if (isExist.length > 0) {
                    throw new common_1.ConflictException('Taki czat w tym miejscu już istnieje');
                }
                const updatedChat = await this.prisma.chat.update({
                    where: { id: structureId },
                    data: { folderId: parentId },
                });
                if (!updatedChat) {
                    throw new common_1.NotFoundException('Czat nie istnieje');
                }
            }
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException(`Wystąpił błąd podczas przenoszenia ${type === 'CHAT' ? 'czatu' : 'folderu'}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.StructuresService = StructuresService;
exports.StructuresService = StructuresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StructuresService);
//# sourceMappingURL=structures.service.js.map