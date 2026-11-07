-- CreateTable
CREATE TABLE `sidebarLinks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accountsUuid` VARCHAR(191) NULL,

    UNIQUE INDEX `sidebarLinks_name_key`(`name`),
    UNIQUE INDEX `sidebarLinks_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sidebarLinkRoles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sidebarLinkId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sidebarLinkRoles_sidebarLinkId_roleId_key`(`sidebarLinkId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `allowGradingSystem` BOOLEAN NULL DEFAULT false,
    `allowInventorySystemAccess` BOOLEAN NULL DEFAULT false,
    `allowInventorySystemAdd` BOOLEAN NULL DEFAULT false,
    `allowInventorySystemEdit` BOOLEAN NULL DEFAULT false,
    `allowInventorySystemDelete` BOOLEAN NULL DEFAULT false,
    `allowInventorySystemVoid` BOOLEAN NULL DEFAULT false,
    `allowInventorySystemViewAuditTrail` BOOLEAN NULL DEFAULT false,
    `allowRequestForPurchaseAccess` BOOLEAN NULL DEFAULT false,
    `allowRequestForPurchaseAdd` BOOLEAN NULL DEFAULT false,
    `allowRequestForPurchaseEdit` BOOLEAN NULL DEFAULT false,
    `allowRequestForPurchaseCancel` BOOLEAN NULL DEFAULT false,
    `allowRequestForPurchasePost` BOOLEAN NULL DEFAULT false,
    `allowRequestForPurchaseSendEmail` BOOLEAN NULL DEFAULT false,
    `allowFixedAssetAccess` BOOLEAN NULL DEFAULT false,
    `allowFixedAssetAdd` BOOLEAN NULL DEFAULT false,
    `allowFixedAssetEdit` BOOLEAN NULL DEFAULT false,
    `allowFixedAssetCancel` BOOLEAN NULL DEFAULT false,
    `allowFixedAssetPost` BOOLEAN NULL DEFAULT false,
    `allowFixedAssetSendEmail` BOOLEAN NULL DEFAULT false,
    `allowUMAccess` BOOLEAN NULL DEFAULT false,
    `allowUMAdd` BOOLEAN NULL DEFAULT false,
    `allowUMEdit` BOOLEAN NULL DEFAULT false,
    `allowLibrariesAccess` BOOLEAN NULL DEFAULT false,
    `allowLibrariesAdd` BOOLEAN NULL DEFAULT false,
    `allowLibrariesEdit` BOOLEAN NULL DEFAULT false,
    `allowLibrariesDelete` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `roles_role_key`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `departments_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `departmentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `employeeId` INTEGER NOT NULL,

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `abbreviation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `assignedTo` INTEGER NULL,
    `officeId` INTEGER NOT NULL,
    `deployedById` INTEGER NULL,
    `invoiceNo` VARCHAR(191) NULL,
    `dateDeployed` DATETIME(3) NULL,
    `datePurchased` DATETIME(3) NULL,
    `assetCondition` VARCHAR(191) NULL,
    `isNew` BOOLEAN NOT NULL DEFAULT true,
    `remarks` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `supplierId` INTEGER NULL,

    UNIQUE INDEX `inventoryItems_oldAssetTag_key`(`oldAssetTag`),
    UNIQUE INDEX `inventoryItems_hostname_key`(`hostname`),
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

    UNIQUE INDEX `employees_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventoryLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity` TEXT NOT NULL,
    `inventoryId` INTEGER NULL,
    `involvedUserUUID` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity` TEXT NOT NULL,
    `updatedOfficeId` INTEGER NULL,
    `updatedCategoryId` INTEGER NULL,
    `updatedBrandId` INTEGER NULL,
    `updatedSupplierId` INTEGER NULL,
    `updatedLocationId` INTEGER NULL,
    `updatedSidebarLinkId` INTEGER NULL,
    `involvedUserUUID` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `employeesId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accountLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activity` TEXT NOT NULL,
    `updatedPositionId` INTEGER NULL,
    `updatedDepartmentId` INTEGER NULL,
    `updatedEmployeeId` INTEGER NULL,
    `updatedAccountUuid` VARCHAR(191) NULL,
    `updatedRoleId` INTEGER NULL,
    `involvedUserUUID` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sidebarLinks` ADD CONSTRAINT `sidebarLinks_accountsUuid_fkey` FOREIGN KEY (`accountsUuid`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidebarLinkRoles` ADD CONSTRAINT `sidebarLinkRoles_sidebarLinkId_fkey` FOREIGN KEY (`sidebarLinkId`) REFERENCES `sidebarLinks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sidebarLinkRoles` ADD CONSTRAINT `sidebarLinkRoles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_deployedById_fkey` FOREIGN KEY (`deployedById`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryItems` ADD CONSTRAINT `inventoryItems_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryLogs` ADD CONSTRAINT `inventoryLogs_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventoryItems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventoryLogs` ADD CONSTRAINT `inventoryLogs_involvedUserUUID_fkey` FOREIGN KEY (`involvedUserUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_updatedOfficeId_fkey` FOREIGN KEY (`updatedOfficeId`) REFERENCES `offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_updatedCategoryId_fkey` FOREIGN KEY (`updatedCategoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_updatedBrandId_fkey` FOREIGN KEY (`updatedBrandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_updatedSupplierId_fkey` FOREIGN KEY (`updatedSupplierId`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_updatedLocationId_fkey` FOREIGN KEY (`updatedLocationId`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_updatedSidebarLinkId_fkey` FOREIGN KEY (`updatedSidebarLinkId`) REFERENCES `sidebarLinks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_involvedUserUUID_fkey` FOREIGN KEY (`involvedUserUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adminLogs` ADD CONSTRAINT `adminLogs_employeesId_fkey` FOREIGN KEY (`employeesId`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountLogs` ADD CONSTRAINT `accountLogs_updatedPositionId_fkey` FOREIGN KEY (`updatedPositionId`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountLogs` ADD CONSTRAINT `accountLogs_updatedDepartmentId_fkey` FOREIGN KEY (`updatedDepartmentId`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountLogs` ADD CONSTRAINT `accountLogs_updatedEmployeeId_fkey` FOREIGN KEY (`updatedEmployeeId`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountLogs` ADD CONSTRAINT `accountLogs_updatedAccountUuid_fkey` FOREIGN KEY (`updatedAccountUuid`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountLogs` ADD CONSTRAINT `accountLogs_updatedRoleId_fkey` FOREIGN KEY (`updatedRoleId`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accountLogs` ADD CONSTRAINT `accountLogs_involvedUserUUID_fkey` FOREIGN KEY (`involvedUserUUID`) REFERENCES `accounts`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
