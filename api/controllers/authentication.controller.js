const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authUserSecret = process.env.AUTH_USER_SECRET // an arbitrary long string, you can ommit env of course

// Setting up passport for email/password authentication
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    }, async function(email, password, done) {
        await User.getUser(email)
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
        return User.getUser(jwtPayload.email)
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
 * Creating User and save data in db
 * @name createUser
 * @function
 * @memberof module:routers/auth
 */
exports.createUser = async(email, password) => {
    return await User.createUser({ email, password })
        .then((data) => {
            return data
        }).catch((error) => {
            throw error
        })
}

/**
 * Getting User from db with email
 * @name getUser
 * @function
 * @memberof module:routers/auth
 */
exports.getUser = async(email) => {
    return await User.findOne({ email })
        .then((data) => {
            return data
        }).catch((error) => {
            throw error
        })
}

/**
 * Take a string and return a generated hash
 * @name generatePasswordHash
 * @function
 * @memberof module:routers/auth
 */
exports.generatePasswordHash = async(plainPassword) => {
    return await bcrypt.hash(plainPassword, 12)
}

/**
 * xxx
 * @name signUserToken
 * @function
 * @memberof module:routers/auth
 */
exports.signUserToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, authUserSecret)
}

// Compares password from plaintext and hashed one
async function comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}
