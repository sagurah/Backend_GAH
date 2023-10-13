const { Router } = require('express')
const { runValidation } = require('../utils/validators')
const Auth = require('../middleware/auth')

const router = Router()

const kamarController = require('../controllers/kamarController')
const { kamarValidation } = require('../utils/validators/kamarValidator')

router.post('/kamar/addKamar', Auth, kamarValidation, runValidation, kamarController.addKamar)
router.get('/kamar/getAllKamar', Auth, kamarController.getAllKamar)
router.get('/kamar/getKamarByJenis/:jenis', Auth, kamarController.getKamarByJenis)
router.put('/kamar/updateKamar/:id', Auth, kamarValidation, runValidation, kamarController.updateKamar)
router.delete('/kamar/deleteKamar/:id', Auth, kamarController.deleteKamar)

module.exports = router