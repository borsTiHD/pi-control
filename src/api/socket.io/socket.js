// Imports
import passport from 'passport'
import { Server } from 'socket.io'

// Listeners / Rooms
import initConnection from './listeners/connection.js'
import initProcessesRoom from './rooms/processes.js'
import initUptimeRoom from './rooms/uptime.js'
import initTemperatureRoom from './rooms/temperature.js'
import initMemoryRoom from './rooms/memory.js'
import initCpuRoom from './rooms/cpu.js'
import initTestRoom from './rooms/testRoom.js'

// Socket.io: Register passport as middleware for authentication with jwt
// url: https://philenius.github.io/web%20development/2021/03/31/use-passportjs-for-authentication-in-socket-io.html
// git: https://gist.github.com/philenius/641aebd1ba56769829e1fc7771326bf8
const wrapMiddlewareForSocketIo = (middleware) => (socket, next) => middleware(socket.request, {}, next)

// Exporting Socket.io
export default function(httpServer, config) {
    // Socket.io Options
    // Activating cors on dev environment, so you can connect with different ports
    // Empty config on production -> clients refuse on different origin
    const socketOptions = config.DEV
        ? {
            cors: {
                origin: [`http://${config.DEV_HOST_IP}:${config.DEV_PORT_FRONTEND}`, `http://localhost:${config.DEV_PORT_FRONTEND}`],
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
    initProcessesRoom(io, 'processes')
    initUptimeRoom(io, 'uptime')
    initTemperatureRoom(io, 'temperature', { duration: 5 * 1000, TEST_DATA: config.TEST_DATA, DEV: config.DEV })
    initMemoryRoom(io, 'memory', { duration: 5 * 1000, TEST_DATA: config.TEST_DATA, DEV: config.DEV })
    initCpuRoom(io, 'cpu', { duration: 5 * 1000, TEST_DATA: config.TEST_DATA, DEV: config.DEV })
    initTestRoom(io, 'testRoom', 2000) // io object, room-name, interval duration
}
