const { Router } = require('express')
const Auth = require('../middleware/auth')
const { runValidation } = require('../utils/validators/index')

const router = Router()

const { userValidation } = require('../utils/validators/userValidator')
const userController = require('../controllers/userController')

router.get('/profile', Auth, userController.getProfile)
router.get('/profile/:id', Auth, userController.getProfileById);

router.put('/profile/editAkun', Auth, userController.editAkun)
router.put('/profile/editAkunMobile', Auth, userController.editAkunMobile)

router.put('/profile/editProfile', Auth, userValidation, runValidation, userController.editProfile)
router.put('/profile/editProfileMobile', Auth, userValidation, runValidation, userController.editProfileMobile)

router.get('/riwayatReservasi', Auth, userController.getAllRiwayatReservasi)
router.get('/riwayatReservasi/:id', Auth, userController.getRiwayatReservasi)
router.get('/detailReservasi/:id', Auth, userController.getDetailRiwayatReservasi)

module.exports = router