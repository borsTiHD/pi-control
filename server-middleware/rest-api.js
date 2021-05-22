// Imports
const createError = require('http-errors')
const express = require('express')

// Importing Routes
const indexRouter = require('./routes/index')
const helpRouter = require('./routes/help')
const scriptsRouter = require('./routes/scripts')

// Express Init
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for form data

// Routes/Endpoints:
app.use('/', indexRouter) // Index
app.use('/help', helpRouter) // Help
app.use('/scripts', scriptsRouter) // Scripts

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
