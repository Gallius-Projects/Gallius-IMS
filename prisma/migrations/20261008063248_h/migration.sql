/*
  Warnings:

  - You are about to drop the column `deployedByUUID` on the `inventoryitems` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventoryitems` DROP FOREIGN KEY `inventoryItems_deployedByUUID_fkey`;

-- DropIndex
DROP INDEX `inventoryItems_deployedByUUID_fkey` ON `inventoryitems`;

-- AlterTable
ALTER TABLE `inventoryitems` DROP COLUMN `deployedByUUID`,
    ADD COLUMN `deployedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_deployedById_fkey` FOREIGN KEY (`deployedById`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
