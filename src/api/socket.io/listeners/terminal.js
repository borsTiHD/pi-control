import Terminal from '../models/terminal.js'

export default (io, socket) => {
    // Create user for every socket
    function init() {
        // Create a Terminal User on database on connection
        Terminal.CreateUser(socket.id)
    }
    init()

    // Updating existing terminals for frontend
    function sendAllTerminals() {
        // Sending all terminals, but only the id's
        const user = Terminal.GetUser(socket.id)
        socket.emit('getAllTerminals', { _status: 'ok', terminals: user.terminals.map((x) => { return { id: x.id } }) }) // Map returns only the id property
    }

    // Event: 'new-terminal' - Create a new Terminal instance
    socket.on('new-terminal', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to start a new terminal`)

            // TODO
            // need to spawn child process

            // Adding terminal to database
            Terminal.AddTerminal(socket.id, 'insert cool terminal object here')

            // Updating all terminals for frontend
            sendAllTerminals()
        }
    })

    // Event: 'get-all-terminals' - Get all open terminal ID's
    socket.on('get-all-terminals', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to get all terminals`)

            // Updating all terminals for frontend
            sendAllTerminals()
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

            // Updating all terminals for frontend
            sendAllTerminals()
        }
    })

    // Event: 'close-all-terminals' - User wants to close all terminals
    socket.on('close-all-terminals', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to close all terminals`)

            // TODO
            // need to kill all child processes

            // Deleting all terminals
            Terminal.DeleteAllTerminals(socket.id)

            // Updating all terminals for frontend
            sendAllTerminals()
        }
    })

    // Event: 'send-to-terminal'
    socket.on('send-to-terminal', (message) => {
        // Message: { id: terminalID, data: '...' }
        const terminalId = message.id
        const data = message.data

        // Getting user data
        const terminal = Terminal.GetTerminal(socket.id, terminalId)

        // Debugging
        console.log('SENDING DATA TO TERMINAL:', terminal, data)

        // Simulating sending data to frontend
        socket.emit('terminal', { _status: 'ok', id: terminalId, data })
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
