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
const DEV_HOST_IP = process.env.DEV_HOST_IP || 'localhost'
const DEV_PORT_FRONTEND = process.env.DEV_PORT_FRONTEND || DEFAULT.DEV_PORT_FRONTEND // Default Port: 3000
const DEV_PORT_BACKEND = process.env.DEV_PORT_BACKEND || DEFAULT.DEV_PORT_BACKEND // Default Port: 3001
const PORT_PRODUCTION = process.env.PORT_PRODUCTION || DEFAULT.PORT_PRODUCTION // Default: 8800

// On dev we use BACKEND port
// On production we use PORT_PRODUCTION
// -> on production we serve front- and backend over the same express server with the same port
const PORT = isDev ? DEV_PORT_BACKEND : PORT_PRODUCTION
if (isDev) console.log('[Server] -> Development:', isDev)

// HTTP Server + Socket.IO Server
const app = initExpress(isDev) // Express Server
const httpServer = createServer(app) // HTTP Server serving Express + Socket.IO
initSocketIo(httpServer, isDev, DEV_HOST_IP, DEV_PORT_FRONTEND) // Socket.IO Server

// Server listening on port
httpServer.listen(PORT, () => {
    console.log(`[Server] -> App is running on ${PORT}`)
})
