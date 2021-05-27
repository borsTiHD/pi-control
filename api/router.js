// Authentication Import
// const passport = require('passport')

// Importing Routes
const indexRouter = require('./routes/index')
const helpRouter = require('./routes/help')
// const authRouter = require('./routes/authentication')
const scriptsRouter = require('./routes/scripts')

// Exporting Base Routes
module.exports = function(app, baseUrl) {
    app.use(baseUrl + '/', indexRouter) // Index
    app.use(baseUrl + '/help', helpRouter) // Help
    // app.use(baseUrl + '/auth', authRouter) // Authentication
    // app.use(baseUrl + '/scripts', passport.authenticate('jwt', { session: false }), scriptsRouter) // Scripts
    app.use(baseUrl + '/scripts', scriptsRouter) // Scripts
}
