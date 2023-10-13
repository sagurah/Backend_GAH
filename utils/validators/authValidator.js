const { check } = require('express-validator')

const authValidation = [
  check('username').not().isEmpty().withMessage('Username tidak boleh kosong'),
  check('username').isLength({ min: 8}).withMessage('Username minimal berisi 8 karakter alphanumeric'),

  check('password').not().isEmpty().withMessage('Password tidak boleh kosong'),
  check('password').isLength({ min: 8 }).withMessage('Password minimal berisi 8 karakter alphanumeric')
]

module.exports = { authValidation }