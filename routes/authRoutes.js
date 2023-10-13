const { Router } = require('express')
const { runValidation } = require('../utils/validators')

const router = Router();

const authController = require('../controllers/authController')
const { authValidation } = require('../utils/validators/authValidator')

router.post('/auth/register', authValidation, runValidation, authController.register)
router.post('/auth/login', authValidation, runValidation, authController.login)

module.exports = router