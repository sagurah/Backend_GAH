const { Router } = require('express')
const { runValidation } = require('../utils/validators')
const Auth = require('../middleware/auth')

const router = Router()

const seasonController = require('../controllers/seasonController')
const { seasonValidation } = require('../utils/validators/seasonValidator')

router.post('/season/addSeason', Auth, seasonValidation, runValidation, seasonController.addSeason)
router.get('/season/getAllSeason', Auth, seasonController.getAllSeason)
router.get('/season/getSeasonByRangeDate/:startDate/:endDate', Auth, seasonController.getSeasonByRangeDate)
router.put('/season/updateSeason/:id', Auth, seasonValidation, runValidation, seasonController.updateSeason)
router.delete('/season/deleteSeason/:id', Auth, seasonController.deleteSeason)

module.exports = router