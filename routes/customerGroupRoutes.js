const { Router } = require('express')
const Auth = require('../middleware/auth')
const { runValidation } = require('../utils/validators')

const router = Router()

const customerGroupController = require('../controllers/customerGroupController')
const { customerGroupValidation } = require('../utils/validators/customerGroupValidator')

router.get('/customerGroup/:id', Auth, customerGroupController.getAllCustomerGroup)
router.post('/customerGroup/addCustomerGroup', Auth, customerGroupValidation, runValidation, customerGroupController.addCustomerGroup)

module.exports = router