const { check } = require('express-validator')

const kamarValidation = [
  check('NO_KAMAR').not().isEmpty().withMessage('Nomor Kamar tidak boleh kosong'),
  check('JENIS_KAMAR').not().isEmpty().withMessage('Jenis Kamar tidak boleh kosong'),
  check('JENIS_BED').not().isEmpty().withMessage('Jenis Bed tidak boleh kosong'),
  check('KAPASITAS').not().isEmpty().withMessage('Kapasitas tidak boleh kosong'),
  check('LUAS_KAMAR').not().isEmpty().withMessage('Luas Kamar tidak boleh kosong'),
  check('FASILITAS').not().isEmpty().withMessage('Fasilitas tidak boleh kosong'),
]

module.exports = { kamarValidation }