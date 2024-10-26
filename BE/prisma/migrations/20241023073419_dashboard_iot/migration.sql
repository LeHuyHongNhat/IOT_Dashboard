-- AlterTable
ALTER TABLE `action_history` MODIFY `device` ENUM('LED', 'FAN', 'AIR_CONDITIONER', 'GAS_WARNING') NOT NULL;

-- AlterTable
ALTER TABLE `sensor_data` ADD COLUMN `gas` INTEGER NOT NULL DEFAULT 0;
