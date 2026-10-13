/*
  Warnings:

  - A unique constraint covering the columns `[hostname]` on the table `inventoryItems` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `inventoryitems` DROP FOREIGN KEY `inventoryItems_assignedTo_fkey`;

-- DropIndex
DROP INDEX `inventoryItems_assignedTo_fkey` ON `inventoryitems`;

-- AlterTable
ALTER TABLE `inventoryitems` MODIFY `assignedTo` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `inventoryItems_hostname_key` ON `inventoryItems`(`hostname`);

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
