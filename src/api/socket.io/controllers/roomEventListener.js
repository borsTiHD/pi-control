export default (io, roomName, cbCreated = () => {}, cbDeleted = () => {}, cbJoined = () => {}, cbLeft = () => {}) => {
    // Create Room Event
    io.of('/').adapter.on('create-room', (room) => {
        if (room === roomName) {
            console.log(`[Socket.io] -> Room '${room}' was created - starting room tasks`)
            typeof cbCreated === 'function' && cbCreated()
        }
    })

    // Delete Room Event
    io.of('/').adapter.on('delete-room', (room) => {
        if (room === roomName) {
            console.log(`[Socket.io] -> Room '${room}' was deleted - stopping room tasks`)
            typeof cbDeleted === 'function' && cbDeleted()
        }
    })

    // Joining Room Event
    io.of('/').adapter.on('join-room', (room, id) => {
        if (room === roomName) {
            console.log(`[Socket.io] -> Socket '${id}' has joined room ${room}`)
            typeof cbJoined === 'function' && cbJoined()
        }
    })

    // Leaving Room Event
    io.of('/').adapter.on('leave-room', (room, id) => {
        if (room === roomName) {
            console.log(`[Socket.io] -> Socket '${id}' has left room ${room}`)
            typeof cbLeft === 'function' && cbLeft()
        }
    })
}
