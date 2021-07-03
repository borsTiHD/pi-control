// Imports
import passport from 'passport'
import { Server } from 'socket.io'

// Listeners / Rooms
import initConnection from './listeners/connection.js'
import initProcessesRoom from './rooms/processesRoom.js'
import initTestRoom from './rooms/testRoom.js'

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

    // Registering Listeners
    initConnection(io) // Event: 'connection'

    // Registering Rooms
    initProcessesRoom(io, 'processesRoom', 2000)
    initTestRoom(io, 'testRoom', 2000)
}
