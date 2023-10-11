const { check } = require('express-validator')

const fasilitasTambahanValidation = [
  check('NAMA_FASILITAS').not().isEmpty().withMessage('Nama Fasilitas Tambahan tidak boleh kosong'),
  check('SATUAN').not().isEmpty().withMessage('Satuan Fasilitas Tambahan tidak boleh kosong'),

  check('HARGA').not().isEmpty().withMessage('Harga Fasilitas Tambahan tidak boleh kosong'),
  check('HARGA').isNumeric().withMessage('Harga Fasilitas Tambahan harus berupa angka'),
]

module.exports = { fasilitasTambahanValidation }