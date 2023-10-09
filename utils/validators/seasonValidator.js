const { check } = require('express-validator')

const seasonValidation = [
  check('JENIS_SEASON').not().isEmpty().withMessage('Jenis season tidak boleh kosong'),

  check('TGL_MULAI').not().isEmpty().withMessage('Tanggal mulai tidak boleh kosong'),
  check('TGL_MULAI').isISO8601().toDate().withMessage('Tanggal mulai harus berupa DateTime'),

  check('TGL_AKHIR').not().isEmpty().withMessage('Tanggal akhir tidak boleh kosong'),
  check('TGL_AKHIR').isISO8601().toDate().withMessage('Tanggal akhir harus berupa DateTime'),

  check('HARGA').not().isEmpty().withMessage('Harga tidak boleh kosong'),
  check('HARGA').isNumeric().withMessage('Harga harus berupa angka'),
]

module.exports = { seasonValidation }