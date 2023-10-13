const { Router } = require('express')
const { runValidation } = require('../utils/validators')
const Auth = require('../middleware/auth')

const router = Router()

const fasilitasTambahanController = require('../controllers/fasilitasTambahanController')
const { fasilitasTambahanValidation } = require('../utils/validators/fasilitasTambahanValidator')

router.post('/fasilitasTambahan/addFasilitasTambahan', Auth, fasilitasTambahanValidation, runValidation, fasilitasTambahanController.addFasilitasTambahan)
router.get('/fasilitasTambahan/getAllFasilitasTambahan', Auth, fasilitasTambahanController.getAllFasilitasTambahan)
router.get('/fasilitasTambahan/getFasilitasTambahanByNama/:nama', Auth, fasilitasTambahanController.getFasilitasTambahanByNama)
router.put('/fasilitasTambahan/updateFasilitasTambahan/:id', Auth, fasilitasTambahanValidation, runValidation, fasilitasTambahanController.updateFasilitasTambahan)
router.delete('/fasilitasTambahan/deleteFasilitasTambahan/:id', Auth, fasilitasTambahanController.deleteFasilitasTambahan)

module.exports = router