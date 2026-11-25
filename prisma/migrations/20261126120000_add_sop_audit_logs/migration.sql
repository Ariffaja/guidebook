CREATE TABLE `SopAuditLog` (
    `id` VARCHAR(64) NOT NULL,
    `sopCaseId` VARCHAR(64) NOT NULL,
    `sopTitle` VARCHAR(255) NOT NULL,
    `category` VARCHAR(16) NOT NULL,
    `action` ENUM('CREATE', 'UPDATE', 'ARCHIVE', 'RESTORE', 'DELETE') NOT NULL,
    `actorUserId` INTEGER NULL,
    `actorName` VARCHAR(100) NOT NULL,
    `actorEmail` VARCHAR(191) NOT NULL,
    `details` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SopAuditLog_sopCaseId_createdAt_idx`(`sopCaseId`, `createdAt`),
    INDEX `SopAuditLog_category_createdAt_idx`(`category`, `createdAt`),
    INDEX `SopAuditLog_actorUserId_idx`(`actorUserId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `SopAuditLog_actorUserId_fkey`
      FOREIGN KEY (`actorUserId`) REFERENCES `User`(`id`)
      ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
