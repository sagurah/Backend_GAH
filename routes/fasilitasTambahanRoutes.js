const { Router } = require('express')
const { runValidation } = require('../utils/validators')

const router = Router()

const fasilitasTambahanController = require('../controllers/fasilitasTambahanController')
const { fasilitasTambahanValidation } = require('../utils/validators/fasilitasTambahanValidator')

router.post('/fasilitasTambahan/addFasilitasTambahan', fasilitasTambahanValidation, runValidation, fasilitasTambahanController.addFasilitasTambahan)
router.get('/fasilitasTambahan/getAllFasilitasTambahan', fasilitasTambahanController.getAllFasilitasTambahan)
router.get('/fasilitasTambahan/getFasilitasTambahanByNama/:nama', fasilitasTambahanController.getFasilitasTambahanByNama)
router.put('/fasilitasTambahan/updateFasilitasTambahan/:id', fasilitasTambahanValidation, runValidation, fasilitasTambahanController.updateFasilitasTambahan)
router.delete('/fasilitasTambahan/deleteFasilitasTambahan/:id', fasilitasTambahanController.deleteFasilitasTambahan)

module.exports = router