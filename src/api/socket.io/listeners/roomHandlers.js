export default (io, socket) => {
    // Event: 'room:join' - Let a user join a specific room
    socket.on('room:join', (room) => {
        console.log('[Socket.io] -> Client joining room:', room)
        socket.join(room) // Join channel
    })

    // Event: 'room:leave' - Let a user join a specific room
    socket.on('room:leave', (room) => {
        console.log('[Socket.io] -> Client leaving room:', room)
        socket.leave(room) // Leave channel
    })
}
