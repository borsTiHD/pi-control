// Imports
import path from 'path'
import { createServer } from 'http'
import createError from 'http-errors'
import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import baseRoutes from './router.js'

// Development
const isDev = process.env.NODE_ENV === 'development'
console.log('[Server] -> Development:', isDev)

// Config
const PORT = process.env.PORT || 8800 // Default Port: 8800
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

// Socket.io Options
// Activating cors on dev environment, so you can connect with different ports
// Empty config on production
const socketOptions = isDev
    ? {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    }
    : {}

// HTTP Server + Socket.IO Init
const httpServer = createServer(app)
const io = new Server(httpServer, socketOptions)

// Setting up Socket.io
io.on('connection', (socket) => {
    console.log('[Socket.io] - Client connected...')
    socket.on('message', (message) => {
        console.log(`[Socket.io] - Socket.IO event 'message' from client with payload: ${message}`)
        socket.emit('message', message)
    })

    socket.on('interval-test', (duration) => {
        console.log(`[Socket.io] - Socket.IO event 'interval-test' from client with payload: ${duration}`)

        setInterval(() => {
            const randomNumber = Math.floor(Math.random() * 100) + 1
            socket.emit('interval-test', randomNumber)
        }, duration)
    })
})

// Listening on port
httpServer.listen(PORT, () => {
    console.log(`[Server] -> App is running on ${PORT}`)
})
