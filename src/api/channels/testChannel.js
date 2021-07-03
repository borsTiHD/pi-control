export default (io) => {
    setInterval(() => {
        const roomName = 'testChannel'

        // Clients
        const clients = io.sockets.adapter.rooms.get(roomName) // Get all clients in specific room
        const numClients = clients ? clients.size : 0 // Get number of clients in this room

        if (numClients > 0) {
            console.log(`[Socket.io] -> ${numClients} online users in room '${roomName}'`)
            // to just emit the same event to all members of a room

            const randomNumber = Math.floor(Math.random() * 100) + 1
            io.to(roomName).emit('intervalTest', randomNumber)
        }
    }, 2000)
}
