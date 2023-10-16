const { check } = require('express-validator')

const userValidation = [
  check('NAMA_CUSTOMER').not().isEmpty().withMessage('Nama customer tidak boleh kosong'),
  check('NAMA_INSTITUSI').not().isEmpty().withMessage('Nama institusi tidak boleh kosong'),

  check('NO_TELP').not().isEmpty().withMessage('No telp tidak boleh kosong'),
  check('NO_TELP').isNumeric().withMessage('No telp harus berupa angka'),

  check('EMAIL').not().isEmpty().withMessage('Email tidak boleh kosong'),
  check('EMAIL').isEmail().withMessage('Email tidak valid'),

  check('ALAMAT').not().isEmpty().withMessage('Alamat tidak boleh kosong')
]

module.exports = { userValidation }