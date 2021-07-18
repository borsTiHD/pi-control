import { join } from 'path'
import crypto from 'crypto'
import fs from 'fs-extra'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import JwtStrategy from 'passport-jwt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.js'

// Loading '.env' + AUTH_USER_SECRET
dotenv.config()
setAuthUserSecret()

// Dev Config
const isDev = process.env.NODE_ENV === 'development'
const DEV_USER = process.env.DEV_USER === 'true'
const DEV_USER_DATA = { email: 'dev@user.de', password: '' }

// Loading secret from 'env' if its exists, or generating a new one
async function setAuthUserSecret() {
    // Getting Env if available
    const secret = process.env.AUTH_USER_SECRET || false

    // If Env variable is not existing, we will generate one
    if (!secret) {
        const generatedKey = crypto.randomBytes(256).toString('hex')
        process.env.AUTH_USER_SECRET = generatedKey

        // Saving key in '.env' file
        const filePath = join('.', '.env')
        const content = `AUTH_USER_SECRET=${generatedKey}`
        await fs.outputFile(filePath, content).catch((error) => {
            console.error(error)
            throw error
        })
        return generatedKey
    }
    return secret
}

// Setting up passport for email/password authentication
passport.use(new LocalStrategy.Strategy({ usernameField: 'email', passwordField: 'password' }, async function(email, password, done) {
    // Default User for developing
    if (isDev && DEV_USER) {
        console.log('[Server] -> DEV_USER: Login with default user "dev@user.de".')
        return done(null, DEV_USER_DATA)
    } else {
        await User.GetUser(email)
            .then((user) => {
                return user
            }).then(async(user) => {
                if (!user) {
                    return done(null, false, { message: 'Authentication failed' })
                }
                const validation = await comparePasswords(password, user.password)
                if (validation) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Authentication failed' })
                }
            }).catch((err) => {
                return done(err)
            })
    }
}))

// Extracting JWT Token out of cookies
const tokenExtractor = function(req) {
    let token = null
    let reqCookie = null
    let reqHeader = null

    // Extracting 'jwt' token from two different places
    try {
        if (req && req.cookies && req.cookies['auth._token.local']) {
            reqCookie = req.cookies['auth._token.local']
        } else if (req.req && req.req.cookies && req.req.cookies['auth._token.local']) {
            reqCookie = req.req.cookies['auth._token.local']
        } else if (req.headers && req.headers && req.headers.authorization) {
            reqHeader = req.headers.authorization
        } else if (req.req.headers && req.req.headers && req.req.headers.authorization) {
            reqHeader = req.req.headers.authorization
        }
    } catch (error) {
        // console.error(error)
        return null
    }

    if (reqCookie) {
        const rawToken = reqCookie.toString()
        token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
    } else if (reqHeader) {
        token = reqHeader.slice(reqHeader.indexOf(' ') + 1, reqHeader.length)
    }
    return token
}

/*
const options = {
    // tokenExtractor
    // JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
    // JwtStrategy.ExtractJwt.fromExtractors([tokenExtractor, JwtStrategy.ExtractJwt.fromHeader('authorization'), JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()])
    jwtFromRequest: tokenExtractor,
    secretOrKey: process.env.AUTH_USER_SECRET // authUserSecret
}
*/

// Setting up passport for JWT Token authentication
passport.use(new JwtStrategy.Strategy({ jwtFromRequest: tokenExtractor, secretOrKey: process.env.AUTH_USER_SECRET }, async function(jwtPayload, done) {
    // Default User for developing
    if (isDev && DEV_USER) {
        console.log('[Server] -> DEV_USER: JWT authentication with default user "dev@user.de".')
        return done(null, {
            email: DEV_USER_DATA.email
        })
    } else {
        await User.GetUser(jwtPayload.email) // Or 'GetUser' - without 'User.'
            .then((user) => {
                if (user) {
                    return done(null, {
                        email: user.email
                    })
                } else {
                    return done(null, false, 'Failed')
                }
            })
            .catch((err) => {
                console.error(err)
                return done(err)
            })
    }
}))

/**
 * Take a string and return a generated hash
 * @name generatePasswordHash
 * @function
 * @memberof module:routers/auth
 */
async function generatePasswordHash(plainPassword) {
    return await bcrypt.hash(plainPassword, 12)
}

// Compares password from plaintext and hashed one
async function comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

/**
 * Returns generated token for authentication
 * @name signUserToken
 * @function
 * @memberof module:routers/auth
 */
function signUserToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.AUTH_USER_SECRET) // authUserSecret
}

/**
 * Proxy for CreateUser model function - creates a user in database
 * @name CreateUser
 * @function
 * @memberof module:routers/auth
 */
async function CreateUser(user) {
    return await User.CreateUser(user)
}

/**
 * Proxy for CountUsers model function - counts how many users registered, or returns false
 * @name CountUsers
 * @function
 * @memberof module:routers/auth
 */
async function CountUsers() {
    return await User.CountUsers()
}

export default {
    CreateUser,
    CountUsers,
    generatePasswordHash,
    signUserToken
}
