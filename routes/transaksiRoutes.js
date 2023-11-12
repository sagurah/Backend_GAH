const { Router } = require('express')
const Auth = require('../middleware/auth')

const router = Router()

const transaksiController = require('../controllers/transaksiController')

router.get('/transaksi/getKamarReady', Auth, transaksiController.getKamarReady)
router.post('/transaksi/addTransaksiCustomer', Auth, transaksiController.addTransaksiCustomer)
router.post('/transaksi/addTransaksiSM', Auth, transaksiController.addTransaksiSM)
router.put('/transaksi/finishTransaksi', Auth, transaksiController.finishTransaksi)

module.exports = router