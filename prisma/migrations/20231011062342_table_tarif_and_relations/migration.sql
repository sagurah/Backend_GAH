-- CreateTable
CREATE TABLE `Tarif` (
    `ID_TARIF` INTEGER NOT NULL AUTO_INCREMENT,
    `TOTAL_TARIF` DOUBLE NULL,
    `ID_KAMAR` INTEGER NULL,
    `ID_SEASON` INTEGER NULL,

    PRIMARY KEY (`ID_TARIF`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tarif` ADD CONSTRAINT `Tarif_ID_KAMAR_fkey` FOREIGN KEY (`ID_KAMAR`) REFERENCES `Kamar`(`ID_KAMAR`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tarif` ADD CONSTRAINT `Tarif_ID_SEASON_fkey` FOREIGN KEY (`ID_SEASON`) REFERENCES `Season`(`ID_SEASON`) ON DELETE SET NULL ON UPDATE CASCADE;
