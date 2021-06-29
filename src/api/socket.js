// Imports
import passport from 'passport'
import { Server } from 'socket.io'

// Socket.io: Register passport as middleware for authentication with jwt
// url: https://philenius.github.io/web%20development/2021/03/31/use-passportjs-for-authentication-in-socket-io.html
// git: https://gist.github.com/philenius/641aebd1ba56769829e1fc7771326bf8
const wrapMiddlewareForSocketIo = (middleware) => (socket, next) => middleware(socket.request, {}, next)

// Exporting Socket.io
export default function(httpServer, isDev) {
    // Socket.io Options
    // Activating cors on dev environment, so you can connect with different ports
    // Empty config on production -> clients refuse on different origin
    const socketOptions = isDev
        ? {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        }
        : {}

    // Creating Socket Server
    const io = new Server(httpServer, socketOptions)

    // Passport/JWT Middleware for authentication
    io.use(wrapMiddlewareForSocketIo(passport.initialize()))
    io.use(wrapMiddlewareForSocketIo(passport.authenticate('jwt', { session: false })))

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
}
