-- AlterTable
ALTER TABLE `action_history` MODIFY `device` ENUM('LED', 'FAN', 'AIR_CONDITIONER', 'LAMP') NOT NULL;
