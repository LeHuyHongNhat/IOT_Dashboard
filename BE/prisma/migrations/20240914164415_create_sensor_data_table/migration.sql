-- CreateTable
CREATE TABLE `sensor_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temperature` INTEGER NOT NULL,
    `humidity` INTEGER NOT NULL,
    `light` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
