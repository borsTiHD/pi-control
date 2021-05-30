import User from '../models/user.js'

const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken')

const authUserSecret = process.env.AUTH_USER_SECRET // an arbitrary long string, you can ommit env of course

// Setting up passport for email/password authentication
passport.use(new LocalStrategy(
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
    if (req.req && req.req.cookies && req.req.cookies['auth._token.local']) {
        const rawToken = req.req.cookies['auth._token.local'].toString()
        token = rawToken.slice(rawToken.indexOf(' ') + 1, rawToken.length)
    }
    return token
}

// Setting up passport for JWT Token authentication
passport.use(new JwtStrategy(
    {
        jwtFromRequest: tokenExtractor,
        secretOrKey: authUserSecret
    }, function(jwtPayload, done) {
        return User.GetUser(jwtPayload.email) // Or 'GetUser' - without 'User.'
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
                return done(err)
            })
    }
))

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
 * xxx
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

export default {
    CreateUser: User.CreateUser,
    GetUser: User.GetUser,
    generatePasswordHash,
    signUserToken
}
