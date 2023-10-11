const { check } = require('express-validator')

const tarifValidation = [
  check('TOTAL_TARIF').not().isEmpty().withMessage('Total tarif tidak boleh kosong'),
  check('TOTAL_TARIF').isNumeric().withMessage('Total tarif harus berupa angka'),

  check('ID_KAMAR').not().isEmpty().withMessage('ID kamar tidak boleh kosong'),
  check('ID_SEASON').not().isEmpty().withMessage('ID season tidak boleh kosong')
]

module.exports = { tarifValidation}