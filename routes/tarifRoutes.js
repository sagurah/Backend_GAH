const { Router } = require('express')
const { runValidation } = require('../utils/validators')

const router = Router()

const tarifController = require('../controllers/tarifController')
const { tarifValidation } = require('../utils/validators/tarifValidator')

router.post('/tarif/addTarif', tarifValidation, runValidation, tarifController.addTarif)
router.get('/tarif/getAllTarif', tarifController.getAllTarif)
router.get('/tarif/getTarifByRangeHarga/:minHarga/:maxHarga', tarifController.getTarifByRangeHarga)
router.put('/tarif/updateTarif/:id', tarifValidation, runValidation, tarifController.updateTarif)
router.delete('/tarif/deleteTarif/:id', tarifController.deleteTarif)

module.exports = router