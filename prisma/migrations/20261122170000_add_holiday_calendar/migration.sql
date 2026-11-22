CREATE TABLE `HolidayCalendar` (
    `year` INTEGER NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `isComplete` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`year`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `NationalHoliday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `year` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `NationalHoliday_date_key` (`date`),
    INDEX `NationalHoliday_year_idx` (`year`),
    CONSTRAINT `NationalHoliday_year_fkey` FOREIGN KEY (`year`) REFERENCES `HolidayCalendar` (`year`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `HolidayCalendar` (`year`, `source`, `isComplete`, `updatedAt`) VALUES
    (2026, 'SKB 3 Menteri hari libur nasional 2026', true, CURRENT_TIMESTAMP(3)),
    (2027, 'SKB 3 Menteri Nomor 1205/2026, 3/2026, 2/2026', true, CURRENT_TIMESTAMP(3));

INSERT INTO `NationalHoliday` (`date`, `name`, `year`) VALUES
    ('2026-01-01', 'Tahun Baru Masehi', 2026), ('2026-01-16', 'Isra Mikraj Nabi Muhammad SAW', 2026),
    ('2026-02-17', 'Tahun Baru Imlek', 2026), ('2026-03-19', 'Hari Suci Nyepi', 2026),
    ('2026-03-21', 'Idulfitri', 2026), ('2026-03-22', 'Idulfitri', 2026),
    ('2026-04-03', 'Wafat Yesus Kristus', 2026), ('2026-04-05', 'Kebangkitan Yesus Kristus', 2026),
    ('2026-05-01', 'Hari Buruh Internasional', 2026), ('2026-05-14', 'Kenaikan Yesus Kristus', 2026),
    ('2026-05-27', 'Iduladha', 2026), ('2026-05-31', 'Hari Raya Waisak', 2026),
    ('2026-06-01', 'Hari Lahir Pancasila', 2026), ('2026-06-16', 'Tahun Baru Islam', 2026),
    ('2026-08-17', 'Hari Kemerdekaan Republik Indonesia', 2026), ('2026-08-25', 'Maulid Nabi Muhammad SAW', 2026),
    ('2026-12-25', 'Kelahiran Yesus Kristus', 2026),
    ('2027-01-01', 'Tahun Baru Masehi', 2027), ('2027-01-05', 'Isra Mikraj Nabi Muhammad SAW', 2027),
    ('2027-02-06', 'Tahun Baru Imlek', 2027), ('2027-03-08', 'Hari Suci Nyepi', 2027),
    ('2027-03-10', 'Idulfitri', 2027), ('2027-03-11', 'Idulfitri', 2027),
    ('2027-03-26', 'Wafat Yesus Kristus', 2027), ('2027-03-28', 'Kebangkitan Yesus Kristus', 2027),
    ('2027-05-01', 'Hari Buruh Internasional', 2027), ('2027-05-06', 'Kenaikan Yesus Kristus', 2027),
    ('2027-05-17', 'Iduladha', 2027), ('2027-05-20', 'Hari Raya Waisak', 2027),
    ('2027-06-01', 'Hari Lahir Pancasila', 2027), ('2027-06-06', 'Tahun Baru Islam', 2027),
    ('2027-08-15', 'Maulid Nabi Muhammad SAW', 2027), ('2027-08-17', 'Hari Kemerdekaan Republik Indonesia', 2027),
    ('2027-12-25', 'Kelahiran Yesus Kristus', 2027), ('2027-12-26', 'Isra Mikraj Nabi Muhammad SAW', 2027);
