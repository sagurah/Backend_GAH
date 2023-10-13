const { Router } = require('express')
const { runValidation } = require('../utils/validators')
const Auth = require('../middleware/auth')

const router = Router()

const tarifController = require('../controllers/tarifController')
const { tarifValidation } = require('../utils/validators/tarifValidator')

router.post('/tarif/addTarif', Auth, tarifValidation, runValidation, tarifController.addTarif)
router.get('/tarif/getAllTarif', Auth, tarifController.getAllTarif)
router.get('/tarif/getTarifByRangeHarga/:minHarga/:maxHarga', Auth, tarifController.getTarifByRangeHarga)
router.put('/tarif/updateTarif/:id', Auth, tarifValidation, runValidation, tarifController.updateTarif)
router.delete('/tarif/deleteTarif/:id', Auth, tarifController.deleteTarif)

module.exports = router