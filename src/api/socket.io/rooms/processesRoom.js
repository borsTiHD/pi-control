import clientNumInRoom from '../controllers/clientNumInRoom.js'

export default (io, roomName, interval) => {
    setInterval(() => {
        // Clients - Sends events only when clients are in the room
        const clients = clientNumInRoom(io, roomName)
        if (clients > 0) {
            console.log(`[Socket.io] -> ${clients} online users in room '${roomName}'`)
            const randomNumber = Math.floor(Math.random() * 100) + 1
            io.to(roomName).emit('processes', randomNumber)
        }
    }, interval)
}
