/*
  Warnings:

  - A unique constraint covering the columns `[USERNAME]` on the table `Akun` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `JENIS_CUSTOMER` VARCHAR(191) NULL DEFAULT 'Personal',
    MODIFY `NAMA_CUSTOMER` VARCHAR(191) NULL DEFAULT '-',
    MODIFY `NAMA_INSTITUSI` VARCHAR(191) NULL DEFAULT '-',
    MODIFY `NO_TELP` VARCHAR(191) NULL DEFAULT '-',
    MODIFY `EMAIL` VARCHAR(191) NULL DEFAULT '-',
    MODIFY `ALAMAT` VARCHAR(191) NULL DEFAULT '-';

-- CreateIndex
CREATE UNIQUE INDEX `Akun_USERNAME_key` ON `Akun`(`USERNAME`);
