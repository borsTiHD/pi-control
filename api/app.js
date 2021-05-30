// Imports
import createError from 'http-errors'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Authentication Import
import passport from 'passport'

// Importing Routes
import baseRoutes from './router.js'

// Config
const PORT = process.env.PORT || 8801

// Express Init
const app = express()
app.use(cors())
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
    res.render('error')
})

// Listening on port
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
})
