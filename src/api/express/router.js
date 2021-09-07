// Authentication Import
import passport from 'passport'

// Importing Routes
import indexRouter from './routes/index.js'
import helpRouter from './routes/help.js'
import authRouter from './routes/authentication.js'
import scriptsRouter from './routes/scripts.js'
import deviceRouter from './routes/device.js'

/**
 * middleware for checking authorization with jwt
 */
function authorized(request, response, next) {
    try {
        passport.authenticate('jwt', { session: false })(request, response, next)
    } catch (error) {
        next(error)
    }
}

// Exporting Base Routes
export default function(app, baseUrl) {
    app.use(baseUrl + '/', indexRouter) // Index
    app.use(baseUrl + '/help', helpRouter) // Help
    app.use(baseUrl + '/auth', authRouter) // Authentication
    app.use(baseUrl + '/scripts', authorized, scriptsRouter) // Scripts
    app.use(baseUrl + '/device', authorized, deviceRouter) // Device
}
