// Imports
import express from 'express'
import passport from 'passport'

// Controller
import Controller from '../controllers/authentication.controller'

// Routes
const router = express.Router()

/*
 *  Router: Baseurl -> '/auth/..'
*/

// User Login Route
router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, message) => {
        console.log('DELETE ME!!! "/login" User:', user)
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
            const token = Controller.signUserToken(user)
            return res.json({ token })
        }
    })(req, res)
})

// Validates correctness of the token when a user visits restricted pages on the frontend
router.get('/user', async(req, res) => {
    // console.log(req.cookies['auth._token.local'])
    passport.authenticate('jwt', { session: false }, (err, user, message) => {
        console.log('DELETE ME!!! "/user" User:', user)
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
                info: 'Validation failed',
                message: message.message
            })
        } else {
            return res.json({ user })
        }
    })(res, req)
})

// Register a User and write user data into database
router.post('/register', async(req, res) => {
    const password = req.body.password
    const email = req.body.email

    /* TODO: NEED A CHECK IF THE USER IS ALREADY TAKEN */
    /* TODO: IF AT LEAST ONE USER IS ALREADY REGISTERED, ONLY A LOGGED IN USER (ADMIN) SHOULD REGISTER ADDITIONAL USER!!! */

    const hashedPassword = await Controller.generatePasswordHash(password)

    await Controller.CreateUser(email, hashedPassword)
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
