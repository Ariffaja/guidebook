CREATE TABLE `UserSopDivision` (
    `userId` INTEGER NOT NULL,
    `division` ENUM('DAFDUK', 'CAPIL') NOT NULL,

    INDEX `UserSopDivision_division_idx`(`division`),
    PRIMARY KEY (`userId`, `division`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `UserSopDivision`
    ADD CONSTRAINT `UserSopDivision_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO `UserSopDivision` (`userId`, `division`)
SELECT `User`.`id`, `SopDivision`.`division`
FROM `User`
INNER JOIN `Role` ON `Role`.`id` = `User`.`roleId`
CROSS JOIN (
    SELECT 'DAFDUK' AS `division`
    UNION ALL
    SELECT 'CAPIL' AS `division`
) AS `SopDivision`
WHERE `Role`.`name` = 'MENTOR';
