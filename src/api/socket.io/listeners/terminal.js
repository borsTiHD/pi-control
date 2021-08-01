export default (io, socket) => {
    // Event: 'terminal'
    socket.on('terminal', (message) => {
        switch (message) {
            case 'connect':
                console.log('Client wants to connect... Client ID:', socket.id)
                break

            default:
                break
        }
    })

    // Event: 'disconnect' - Fires when a client disconnects
    socket.on('disconnect', () => {
        // Killing 'child_process'
        console.log('Client disconnects - Client ID:', socket.id)
    })
}
