-- CreateTable
CREATE TABLE `sidebarLinks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `sidebarLinks_name_key`(`name`),
    UNIQUE INDEX `sidebarLinks_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sidebarLinkRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sidebarLinkId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    UNIQUE INDEX `sidebarLinkRoles_sidebarLinkId_roleId_key`(`sidebarLinkId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_role_key`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    UNIQUE INDEX `departments_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    UNIQUE INDEX `positions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `uuid` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `roleId` INTEGER NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `employeeId` INTEGER NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_username_key`(`username`),
    UNIQUE INDEX `accounts_employeeId_key`(`employeeId`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NULL,
    `abbreviation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NULL,
    `contactNumber` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NULL,
    `accountsUuid` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `abbreviation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedByUUID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventoryItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `oldAssetTag` VARCHAR(191) NULL,
    `newAssetTag` VARCHAR(191) NULL,
    `serialNumber` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `hostname` VARCHAR(191) NULL,
    `status` ENUM('SPARE', 'DEPLOYED', 'DEFECTIVE', 'DONATED', 'DISPOSED') NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `locationId` INTEGER NOT NULL,
    `brandId` INTEGER NOT NULL,
    `assignedTo` INTEGER NOT NULL,
    `officeId` INTEGER NOT NULL,
    `updatedByUUID` VARCHAR(191) NOT NULL,
    `deployedByUUID` VARCHAR(191) NULL,
    `invoiceNumber` VARCHAR(191) NULL,
    `deploymentDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `remarks` TEXT NOT NULL,
    `supplierId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `suffix` VARCHAR(191) NULL,
    `officeId` INTEGER NULL,
    `departmentId` INTEGER NOT NULL,
    `positionId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity` TEXT NOT NULL,
    `uuid` VARCHAR(191) NOT NULL,
    `inventoryId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sidebarLinks` ADD CONSTRAINT `sidebarLinks_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidebarLinkRoles` ADD CONSTRAINT `sidebarLinkRoles_sidebarLinkId_fkey` FOREIGN KEY (`sidebarLinkId`) REFERENCES `sidebarLinks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidebarLinkRoles` ADD CONSTRAINT `sidebarLinkRoles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `brands_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suppliers` ADD CONSTRAINT `suppliers_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_accountsUuid_fkey` FOREIGN KEY (`accountsUuid`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offices` ADD CONSTRAINT `offices_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_updatedByUUID_fkey` FOREIGN KEY (`updatedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_deployedByUUID_fkey` FOREIGN KEY (`deployedByUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_uuid_fkey` FOREIGN KEY (`uuid`) REFERENCES `accounts`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventoryItems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
