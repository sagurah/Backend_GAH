const { Router } = require('express')
const Auth = require('../middleware/auth')

const router = Router()

const checkInController = require('../controllers/checkInController')

router.post('/fo/checkin', Auth, checkInController.checkIn)
router.post('/fo/checkinGroup', Auth, checkInController.checkInGroup)
router.put('/fo/addFasilitas/:id', Auth, checkInController.addFasilitasToReservasi)
router.put('/fo/checkout/:id', Auth, checkInController.checkOut)
router.put('/fo/checkoutGroup/:id', Auth, checkInController.checkOutGroup)

module.exports = router