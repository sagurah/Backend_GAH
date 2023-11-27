const { Router } = require('express')
const Auth = require('../middleware/auth')

const router = Router()

const laporanController = require('../controllers/laporanController')

router.get('/laporan/laporanCustomerBaru', Auth, laporanController.getLaporanCustomerBaru)
router.get('/laporan/laporanPendapatan', Auth, laporanController.getLaporanPendapatanPerJenisTamuPerBulan)
router.get('/laporan/laporanTamu', Auth, laporanController.getLaporanJumlahTamuPerBulan)
router.get('/laporan/laporanTop5', Auth, laporanController.getTop5Customers)

module.exports = router