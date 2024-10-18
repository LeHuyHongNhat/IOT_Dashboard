-- CreateTable
CREATE TABLE `sensor_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temperature` INTEGER NOT NULL,
    `humidity` INTEGER NOT NULL,
    `light` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `wind` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `action_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device` ENUM('LED', 'FAN', 'AIR_CONDITIONER') NOT NULL,
    `action` ENUM('ON', 'OFF') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
