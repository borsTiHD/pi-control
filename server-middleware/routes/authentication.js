// Express
const express = require('express')
const router = express.Router()

// Controller
const controller = require('../controllers/authentication.controller')

// Router: Base -> '/auth/..'
// router.post('/login', controller.login) /* xxx */
// router.get('/user', controller.user) /* xxx */

// Register a User and write user data into database
router.post('/register', async(req, res) => {
    const password = req.body.password
    const email = req.body.email

    /* TODO: NEED A CHECK IF THE USER IS ALREADY TAKEN */
    /* TODO: IF AT LEAST ONE USER IS ALREADY REGISTERED, ONLY A LOGGED IN USER (ADMIN) SHOULD REGISTER ADDITIONAL USER!!! */

    const hashedPassword = await controller.generatePasswordHash(password)

    await controller.createUser(email, hashedPassword)
        .then(() => {
            res.json({
                _status: 'ok',
                info: 'User created.',
                message: 'An account has been created!'
            })
        }).catch((err) => {
            throw err
        })
})

module.exports = router
