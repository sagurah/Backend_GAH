/*
  Warnings:

  - You are about to alter the column `CREATED_AT` on the `customer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `customer` ADD COLUMN `CREATED_AT_MONTH` VARCHAR(191) NULL,
    ADD COLUMN `CREATED_AT_YEAR` VARCHAR(191) NULL,
    MODIFY `CREATED_AT` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `reservasi` ALTER COLUMN `TGL_RESERVASI` DROP DEFAULT;
