// Imports
import { createServer } from 'http'
import initExpress from './express/express.js'
import initSocketIo from './socket.io/socket.js'

// Config
const PORT = process.env.PORT || 8800 // Default Port: 8800
const isDev = process.env.NODE_ENV === 'development'
if (isDev) console.log('[Server] -> Development:', isDev)

// HTTP Server + Socket.IO Server
const app = initExpress(isDev) // Express Server
const httpServer = createServer(app) // HTTP Server serving Express + Socket.IO
initSocketIo(httpServer, isDev) // Socket.IO Server

// Server listening on port
httpServer.listen(PORT, () => {
    console.log(`[Server] -> App is running on ${PORT}`)
})
