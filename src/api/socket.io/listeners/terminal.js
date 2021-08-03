import Terminal from '../models/terminal.js'

export default (io, socket) => {
    // Create a Terminal User on database on connection
    Terminal.CreateUser(socket.id)

    // Event: 'new-terminal' - Create a new Terminal instance
    socket.on('new-terminal', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to start a new terminal`)

            // TODO
            // need to spawn child process

            // Adding terminal to database
            Terminal.AddTerminal(socket.id, 'insert cool terminal object here')
        }
    })

    // Event: 'close-terminal' - User wants to close terminal with id
    socket.on('close-terminal', (terminalID) => {
        if (terminalID) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to close terminal ID '${terminalID}'`)

            // TODO
            // need to kill child process

            // Deleting terminal from database
            Terminal.DeleteTerminal(socket.id, terminalID)
        }
    })

    // Event: 'close-all-terminals' - User wants to close all terminals
    socket.on('close-all-terminals', (terminalID) => {
        if (terminalID) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to close all terminals`)

            // TODO
            // need to kill all child processes

            // Deleting all terminals
            Terminal.DeleteAllTerminals(socket.id)
        }
    })

    // Event: 'terminal'
    socket.on('terminal', (message) => {
        // Method: 'get-all' - returning all terminal ID's
        if (message === 'get-all') {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to get all terminals`)

            // Getting user data
            const user = Terminal.GetUser(socket.id)

            // Returning terminals, but only the id's
            socket.emit('terminal', { _status: 'ok', data: user.terminals.map((x) => { return { id: x.id } }) }) // Map returns only the id property
        }
    })

    // Event: 'disconnect' - Fires when a client disconnects
    socket.on('disconnect', () => {
        console.log(`[Socket.io] -> Terminal: Client '${socket.id}' disconnects - closing all terminals and deleting user from database`)

        // TODO
        // need to kill all child processes before deleting all data from database

        // Deleting all user Data
        Terminal.DeleteUser(socket.id)
    })
}
