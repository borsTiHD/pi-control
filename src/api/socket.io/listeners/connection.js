import initRoomHandlers from './roomHandlers.js'

export default (io) => {
    // On client connection
    io.on('connection', (socket) => {
        console.log('[Socket.io] -> Client connected...')

        // Event: 'room:join' / 'room:leave'
        initRoomHandlers(io, socket)

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
}
