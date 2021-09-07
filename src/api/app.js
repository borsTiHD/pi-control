// Imports
import { createServer } from 'http'
import dotenv from 'dotenv'
import DEFAULT from '../config.js'
import initExpress from './express/express.js'
import initSocketIo from './socket.io/socket.js'

// Loading '.env'
dotenv.config()

// Config
const isDev = process.env.NODE_ENV === 'development'
const config = {
    DEV_HOST_IP: process.env.DEV_HOST_IP || 'localhost',
    DEV_PORT_FRONTEND: process.env.DEV_PORT_FRONTEND || DEFAULT.DEV_PORT_FRONTEND, // Default Port: 3000
    DEV_PORT_BACKEND: process.env.DEV_PORT_BACKEND || DEFAULT.DEV_PORT_BACKEND, // Default Port: 3001
    PORT_PRODUCTION: process.env.PORT_PRODUCTION || DEFAULT.PORT_PRODUCTION, // Default: 8800
    PORT: null,
    DEV: isDev,
    TEST_DATA: process.env.TEST_DATA || false
}

// On dev we use BACKEND port
// On production we use PORT_PRODUCTION
// -> on production we serve front- and backend over the same express server with the same port
config.PORT = isDev ? config.DEV_PORT_BACKEND : config.PORT_PRODUCTION
if (isDev) {
    console.log('[Server] -> Development:', isDev)
    console.log('[Server] -> Test Data:', config.TEST_DATA)
}

// HTTP Server + Socket.IO Server
const app = initExpress(config) // Express Server
const httpServer = createServer(app) // HTTP Server serving Express + Socket.IO
initSocketIo(httpServer, config) // Socket.IO Server

// Server listening on port
httpServer.listen(config.PORT, () => {
    console.log(`[Server] -> App is running on ${config.PORT}`)
})
