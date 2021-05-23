// Express
const express = require('express')
const router = express.Router()

// Auth Imports
const passport = require('passport')

// Controller
const controller = require('../controllers/authentication.controller')

/*
 *  Router: Baseurl -> '/auth/..'
*/

// User Login Route
router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, message) => {
        if (err) {
            // you should log it
            return res.status(500).json({
                _status: 'error',
                info: 'An error has occurred',
                err
            })
        } else if (!user) {
            // you should log it
            return res.status(403).json({
                _status: 'failed',
                info: 'Login failed',
                message: message.message
            })
        } else {
            const token = controller.signUserToken(user)
            return res.json({
                _status: 'ok',
                info: 'User login successful',
                message: 'Login successful',
                token
            })
        }
    })(req, res)
})

// Validates correctness of the token when a user visits restricted pages on the frontend
router.get('/user', async(req, res) => {
    // console.log(req.cookies['auth._token.local'])
    passport.authenticate('jwt', { session: false }, (err, user, message) => {
        if (err) {
            // you should log it
            return res.status(400).json({
                _status: 'error',
                info: 'An error has occurred',
                err
            })
        } else if (!user) {
            // you should log it
            return res.status(403).json({
                _status: 'failed',
                info: 'Login failed',
                message: message.message
            })
        } else {
            return res.json({
                _status: 'ok',
                info: 'User validation successful',
                message: 'Validation successful',
                user
            })
        }
    })(res, req)
})

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
