const { Router } = require('express')
const Auth = require('../middleware/auth')
const { runValidation } = require('../utils/validators/index')

const router = Router()

const { userValidation } = require('../utils/validators/userValidator')
const userController = require('../controllers/userController')

router.get('/profile', Auth, userController.getProfile)
router.put('/profile/editAkun', Auth, userController.editAkun)
router.put('/profile/editProfile', Auth, userValidation, runValidation, userController.editProfile)

router.get('/riwayatReservasi', Auth, userController.getRiwayatReservasi)
router.get('/riwayatReservasi/:id', Auth, userController.getDetailRiwayatReservasi)

module.exports = router