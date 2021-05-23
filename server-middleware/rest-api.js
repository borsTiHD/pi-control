// Imports
const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')

// Authentication Import
const passport = require('passport')

// Importing Routes
const indexRouter = require('./routes/index')
const helpRouter = require('./routes/help')
const authRouter = require('./routes/authentication')
const scriptsRouter = require('./routes/scripts')

// Express Init
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for form data
app.use(cookieParser()) // Cookies
app.use(passport.initialize()) // Authentication

// Routes/Endpoints:
app.use('/', indexRouter) // Index
app.use('/help', helpRouter) // Help
app.use('/auth', authRouter) // Authentication
app.use('/scripts', passport.authenticate('jwt', { session: false }), scriptsRouter) // Scripts

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// Error handler
app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // Render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
