-- CreateTable
CREATE TABLE `Kamar` (
    `ID_KAMAR` INTEGER NOT NULL AUTO_INCREMENT,
    `NO_KAMAR` INTEGER NULL,
    `JENIS_KAMAR` VARCHAR(191) NULL,
    `JENIS_BED` VARCHAR(191) NULL,
    `KAPASITAS` INTEGER NULL,
    `LUAS_KAMAR` INTEGER NULL,
    `FASILITAS` VARCHAR(191) NULL,

    PRIMARY KEY (`ID_KAMAR`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
