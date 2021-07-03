// Imports
import path from 'path'
import createError from 'http-errors'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import baseRoutes from './router.js'

// Exporting Express Setup
export default function(isDev) {
    // Config
    const DIST_DIR = path.join('dist', 'client')

    // Express Init
    const app = express()
    if (isDev) app.use(cors()) // CORS policy only in dev
    app.use(express.static(DIST_DIR))
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
        console.error('[Express] -> Error with requested Url:', req.originalUrl)

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

    return app
}