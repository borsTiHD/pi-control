// Imports
import { createServer } from 'http'
import dotenv from 'dotenv'
import initExpress from './express/express.js'
import initSocketIo from './socket.io/socket.js'

// Loading '.env'
dotenv.config()

// Env variables with dev default
process.env.PORT_FRONTEND = process.env.PORT_FRONTEND || 8800 // Default Port: 8800
process.env.PORT_BACKEND = process.env.PORT_BACKEND || 3001 // Default Port: 3001

// Config
const isDev = process.env.NODE_ENV === 'development'
const PORT = isDev ? process.env.PORT_BACKEND : process.env.PORT_FRONTEND // On dev we use BACKEND port, on production we use FRONTEND port -> on production we serve front- and backend over the same express server with the same port
if (isDev) console.log('[Server] -> Development:', isDev)

// HTTP Server + Socket.IO Server
const app = initExpress(isDev) // Express Server
const httpServer = createServer(app) // HTTP Server serving Express + Socket.IO
initSocketIo(httpServer, isDev) // Socket.IO Server

// Server listening on port
httpServer.listen(PORT, () => {
    console.log(`[Server] -> App is running on ${PORT}`)
})
