// Express
const express = require('express')
const router = express.Router()

// Controller
const controller = require('../controllers/scriptsController')

// Router: '/auth/..'
router.post('/login', controller.login) /* xxx */
router.get('/user', controller.user) /* xxx */
router.post('/register', controller.register) /* xxx */

module.exports = router
