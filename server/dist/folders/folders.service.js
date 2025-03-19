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
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FoldersService = class FoldersService {
    constructor(prismaService) {
        this.prisma = prismaService;
    }
    async isExist(name, folderId, userId) {
        const isExist = await this.prisma.folder.findMany({
            where: { AND: [{ name }, { parentId: folderId }, { userId }] },
        });
        if (isExist.length > 0) {
            throw new common_1.ConflictException('Taki folder na tym poziomie już istnieje');
        }
    }
    async getRootFolders(userId) {
        try {
            const folders = await this.prisma.folder.findMany({
                where: { AND: [{ userId }, { parentId: null }] },
                select: { id: true, name: true },
                orderBy: { createdAt: 'desc' },
            });
            return { folders };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas pobierania folderów', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createRootFolder(userId, name) {
        try {
            await this.isExist(name, null, userId);
            const folder = await this.prisma.folder.create({
                data: { userId, name },
                select: { id: true, name: true },
            });
            return { folder };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas tworzenia folderu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async createFolder(userId, name, folderId) {
        try {
            await this.isExist(name, folderId, userId);
            const folder = await this.prisma.folder.create({
                data: { name, parentId: folderId, userId },
                select: { id: true, name: true },
            });
            return { folder: { ...folder, type: 'FOLDER' } };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas tworzenia folderu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deleteFolder(folderId, userId) {
        try {
            await this.prisma.folder.delete({
                where: { userId, id: folderId },
            });
            return;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.HttpException('Wystąpił błąd podczas usuwania folderu', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoldersService);
//# sourceMappingURL=folders.service.js.map