/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - email
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                      description: User email address for login.
 *                  password:
 *                      type: string
 *                      description: User password for login.
 *              example:
 *                  email: admin@admin.de
 *                  password: mySecretPassword
 *          Token:
 *              type: object
 *              required:
 *                  - token
 *              properties:
 *                  token:
 *                      type: string
 *                      description: Jwt token
 *              example:
 *                  token: eyJhWDdDWjfsdaAFAWDasfdawdrawd5cCI6IkpXVCJ9.eyJlbWFpbCIWQDhawjidhUIIUWDihuqwdgJHG213IwODE0fQ.FjHQt5WOsdD2234Fws
 */

// Imports
import express from 'express'
import passport from 'passport'

// Controller
import Controller from '../controllers/authentication.controller.js'

// Routes
const router = express.Router()

/*
 *  Router: Baseurl -> '/auth/..'
*/

/**
 * @swagger
 *  /auth/login:
 *      post:
 *          description: Login a user with email and password.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200:
 *                  description: Returns an object with a jwt token after successful login.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Token'
 *              500:
 *                  description: Error in the authentication process.
 *              403:
 *                  description: Login failed, wrong user data, or user does not exists.
 */
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
            const token = Controller.signUserToken(user)
            return res.json({ token })
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

    /* TODO: IF AT LEAST ONE USER IS ALREADY REGISTERED, ONLY A LOGGED IN USER (ADMIN) SHOULD REGISTER ADDITIONAL USER!!! */

    // Checks if a user is already registered
    const users = await Controller.CountUsers()
    if (users && users > 0) {
        return res.status(403).json({
            _status: 'forbidden',
            info: 'There is already one user registered!',
            message: 'Only one user is allowed right now!'
        })
    }

    // Hashing password and creating user data
    const hashedPassword = await Controller.generatePasswordHash(password)
    await Controller.CreateUser({ email, password: hashedPassword })
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

/**
 * @swagger
 *  /auth/registered-users:
 *      get:
 *          description: Looks if at least one user is already registered.
 *          responses:
 *              200:
 *                  description: Returns an object with a jwt token after successful login.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  _status:
 *                                      type: string
 *                                      description: ok - if request was successful.
 *                                  info:
 *                                      type: string
 *                                      description: Info if at least one user is registered or none.
 *                                  message:
 *                                      type: string
 *                                      description: Message if registrations are possible.
 *                                  registration:
 *                                      type: boolean
 *                                      description: Boolean if registrations are possible or not.
 *                              example:
 *                                  _status: ok
 *                                  info: There is at least one user registered!
 *                                  message: Registration not available
 *                                  registration: false
 */
router.get('/registered-users', async(req, res) => {
    // Checks if a user is already registered
    const users = await Controller.CountUsers()
    if (users && users > 0) {
        return res.json({
            _status: 'ok',
            info: 'There is at least one user registered!',
            message: 'Registration not available',
            registration: false
        })
    }
    return res.json({
        _status: 'ok',
        info: 'No user is registered right now',
        message: 'Registration available',
        registration: true
    })
})

export default router
