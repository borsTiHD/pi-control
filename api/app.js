// Imports
import createError from 'http-errors'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Authentication Import
import passport from 'passport'

// Importing Routes
import baseRoutes from './router.js'

// Development
const isDev = process.env.NODE_ENV === 'development'
console.log('DEV:', isDev)

// Config
const PORT = process.env.PORT || 8800 // Default Port: 8800

// Express Init
const app = express()
if (isDev) app.use(cors()) // CORS policy only in dev
app.use(express.static('dist'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for form data
app.use(cookieParser()) // Cookies
app.use(passport.initialize()) // Authentication

// Router/Endpoints
const baseUrl = '/api/v1'
baseRoutes(app, baseUrl)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Request Url:', req.originalUrl)

    // Set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // Render the error page
    res.status(err.status || 500)
    res.json({
        _status: 'error',
        err
    })
})

// Listening on port
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
})
