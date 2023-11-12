const { check } = require('express-validator')

const customerGroupValidation = [
  check('NAMA_CUSTOMER').not().isEmpty().withMessage('Nama customer tidak boleh kosong'),
  check('NAMA_INSTITUSI').not().isEmpty().withMessage('Nama institusi tidak boleh kosong'),
  check('NO_TELP').not().isEmpty().withMessage('Nomor telepon tidak boleh kosong'),
  check('EMAIL').not().isEmpty().withMessage('Email tidak boleh kosong'),
  check('ALAMAT').not().isEmpty().withMessage('Alamat tidak boleh kosong'),
  check('ID_AKUN').not().isEmpty().withMessage('ID akun tidak boleh kosong'),
]

module.exports = { customerGroupValidation }