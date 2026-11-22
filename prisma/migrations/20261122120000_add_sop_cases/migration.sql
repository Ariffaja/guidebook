CREATE TABLE `SopCase` (
    `id` VARCHAR(64) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `category` VARCHAR(16) NOT NULL,
    `caseType` VARCHAR(32) NULL,
    `ref` VARCHAR(64) NULL,
    `title` VARCHAR(255) NOT NULL,
    `classification` VARCHAR(8) NULL,
    `description` TEXT NULL,
    `template` LONGTEXT NULL,
    `keywords` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SopCase_category_idx`(`category`),
    INDEX `SopCase_classification_idx`(`classification`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SopDataMigration` (
    `key` VARCHAR(100) NOT NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
