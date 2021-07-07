// Imports
import { createServer } from 'http'
import dotenv from 'dotenv'
import initExpress from './express/express.js'
import initSocketIo from './socket.io/socket.js'

// Loading '.env'
dotenv.config()

// Config
const isDev = process.env.NODE_ENV === 'development'
const DEV_HOST_IP = process.env.DEV_HOST_IP || 'localhost'
const DEV_PORT_FRONTEND = process.env.DEV_PORT_FRONTEND || 8800 // Default Port: 8800
const DEV_PORT_BACKEND = process.env.DEV_PORT_BACKEND || 3001 // Default Port: 3001
const PORT = isDev ? DEV_PORT_BACKEND : process.env.PORT_PRODUCTION // On dev we use BACKEND port, on production we use PORT_PRODUCTION -> on production we serve front- and backend over the same express server with the same port
if (isDev) console.log('[Server] -> Development:', isDev)

// HTTP Server + Socket.IO Server
const app = initExpress(isDev) // Express Server
const httpServer = createServer(app) // HTTP Server serving Express + Socket.IO
initSocketIo(httpServer, isDev, DEV_HOST_IP, DEV_PORT_FRONTEND) // Socket.IO Server

// Server listening on port
httpServer.listen(PORT, () => {
    console.log(`[Server] -> App is running on ${PORT}`)
})
