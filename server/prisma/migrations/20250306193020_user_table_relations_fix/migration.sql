-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_userId_fkey`;

-- DropForeignKey
ALTER TABLE `folder` DROP FOREIGN KEY `Folder_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_fkey`;

-- DropIndex
DROP INDEX `Chat_userId_fkey` ON `chat`;

-- DropIndex
DROP INDEX `Folder_userId_fkey` ON `folder`;

-- DropIndex
DROP INDEX `Message_userId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `chat` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `folder` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `message` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
