// Authentication Import
// import passport from 'passport'

// Importing Routes
import indexRouter from './routes/index.js'
import helpRouter from './routes/help.js'
import authRouter from './routes/authentication.js'
import scriptsRouter from './routes/scripts.js'

// Exporting Base Routes
export default function(app, baseUrl) {
    app.use(baseUrl + '/', indexRouter) // Index
    app.use(baseUrl + '/help', helpRouter) // Help
    app.use(baseUrl + '/auth', authRouter) // Authentication
    // app.use(baseUrl + '/scripts', passport.authenticate('jwt', { session: false }), scriptsRouter) // Scripts
    app.use(baseUrl + '/scripts', scriptsRouter) // Scripts
}
