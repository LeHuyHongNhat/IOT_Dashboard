/*
  Warnings:

  - The values [GAS_WARNING] on the enum `action_history_device` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `gas` on the `sensor_data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `action_history` MODIFY `device` ENUM('LED', 'FAN', 'AIR_CONDITIONER') NOT NULL;

-- AlterTable
ALTER TABLE `sensor_data` DROP COLUMN `gas`;
