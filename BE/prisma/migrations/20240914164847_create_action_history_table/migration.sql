/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `sensor_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sensor_data` DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `action_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device` ENUM('LED', 'FAN', 'AIR_CONDITIONER') NOT NULL,
    `action` ENUM('ON', 'OFF') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
