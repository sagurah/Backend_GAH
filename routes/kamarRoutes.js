const { Router } = require('express')
const { runValidation } = require('../utils/validators')

const router = Router()

const kamarController = require('../controllers/kamarController')
const { kamarValidation } = require('../utils/validators/kamarValidator')

router.post('/kamar/addKamar', kamarValidation, runValidation, kamarController.addKamar)
router.get('/kamar/getAllKamar', kamarController.getAllKamar)
router.get('/kamar/getKamarByJenis/:jenis', kamarController.getKamarByJenis)
router.put('/kamar/updateKamar/:id', kamarValidation, runValidation, kamarController.updateKamar)
router.delete('/kamar/deleteKamar/:id', kamarController.deleteKamar)

module.exports = router