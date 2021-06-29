// Imports
import passport from 'passport'
import { Server } from 'socket.io'
import channel from './sockets/channel.js'

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

    // On client connection
    io.on('connection', (socket) => {
        console.log('[Socket.io] -> Client connected...')

        // Event: 'join-room' - Let a user join a specific room
        socket.on('join-room', (room) => {
            console.log('[Socket.io] -> Client joining room:', room)
            socket.join(room) // Join channel
        })

        // Event: 'leave-room' - Let a user join a specific room
        socket.on('leave-room', (room) => {
            console.log('[Socket.io] -> Client leaving room:', room)
            socket.leave(room) // Leave channel
        })

        // Event: 'disconnect' - Fires when a client disconnects
        socket.on('disconnect', function() {
            console.log('[Socket.io] -> Client disconnected...')
        })

        // Dev: 'dev-message' - Receives a message and sends it back
        socket.on('dev-message', (message) => {
            console.log(`[Socket.io] -> Dev: Got a 'message' from client: ${message}`)
            socket.emit('devMessage', message)
        })
    })

    // Registering Channel
    channel(io)
}
