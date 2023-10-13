const { Router } = require('express')
const { runValidation } = require('../utils/validators')

const router = Router()

const userController = require('../controllers/userController')

router.post('/user/addUser', userController.addUser)
router.get('/user/getAllUserWithCredentials', userController.getAllUserWithCredentials),
router.get('/user/getUserByUsername/:username', userController.getUserDataByUsername)

module.exports = router