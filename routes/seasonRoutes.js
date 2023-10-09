const { Router } = require('express')
const { runValidation } = require('../utils/validators')

const router = Router()

const seasonController = require('../controllers/seasonController')
const { seasonValidation } = require('../utils/validators/seasonValidator')

router.post('/season/addSeason', seasonValidation, runValidation, seasonController.addSeason)
router.get('/season/getAllSeason', seasonController.getAllSeason)
router.get('/season/getSeasonByJenis/:jenis', seasonController.getSeasonByJenis)
router.put('/season/updateSeason/:id', seasonValidation, runValidation, seasonController.updateSeason)
router.delete('/season/deleteSeason/:id', seasonController.deleteSeason)

module.exports = router