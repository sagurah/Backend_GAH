-- AlterTable
ALTER TABLE `customer` MODIFY `CREATED_AT` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reservasi` ALTER COLUMN `TGL_RESERVASI` DROP DEFAULT;