export default (io, roomName) => {
    const clients = io.sockets.adapter.rooms.get(roomName) // Get all clients in specific room
    const numClients = clients ? clients.size : 0 // Get number of clients in this room
    return numClients
}
