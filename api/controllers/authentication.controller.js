import bcrypt from 'bcrypt'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import JwtStrategy from 'passport-jwt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

// Getting Env
const authUserSecret = process.env.AUTH_USER_SECRET // an arbitrary long string, you can ommit env of course

// Setting up passport for email/password authentication
passport.use(new LocalStrategy.Strategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    }, async function(email, password, done) {
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
    })
)

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

    // console.log('reqCookie', reqCookie)
    // console.log('reqHeader', reqHeader)

    if (reqCookie) {
        const rawToken = reqCookie.toString()
        token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
    } else if (reqHeader) {
        token = reqHeader.slice(reqHeader.indexOf(' ') + 1, reqHeader.length)
    }
    return token
}

// Setting up passport for JWT Token authentication
const options = {
    // tokenExtractor
    // JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
    // JwtStrategy.ExtractJwt.fromExtractors([tokenExtractor, JwtStrategy.ExtractJwt.fromHeader('authorization'), JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()])
    jwtFromRequest: tokenExtractor,
    secretOrKey: authUserSecret
}
passport.use(new JwtStrategy.Strategy(options, async function(jwtPayload, done) {
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
    }, authUserSecret)
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
