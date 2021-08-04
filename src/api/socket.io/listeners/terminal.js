import Terminal from '../models/terminal.js'
import shellSession from '../controllers/shellSession.js'

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

            // Adding an empty terminal to database
            // Return value is the id for the terminal object
            const id = Terminal.NewTerminal(socket.id)
            if (!id) {
                // TODO
                // We need a message for the frontend

                // No session could be established, because user does not exists
                throw new Error('Could not create a terminal because the user does not exist')
            }

            // Creating new terminal session
            // Callback function will emit data output
            const session = shellSession((data) => {
                // data = { _status: 'ok', type: 'data', data: 'buffer.toString()' }
                socket.emit('terminal', { id, ...data })
            })

            // TODO
            // If no session could be established, we need a message for the frontend
            // Generally better error handling here is needed... :D

            // Saving session instance in database
            Terminal.NewTerminal(socket.id, id, session)

            // Sending updated terminals to frontend
            sendAllTerminals()
        }
    })

    // Event: 'get-all-terminals' - Get all open terminal ID's
    socket.on('get-all-terminals', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to get all terminals`)

            // Sending updated terminals to frontend
            sendAllTerminals()
        }
    })

    // Event: 'close-terminal' - User wants to close terminal with id
    socket.on('close-terminal', (terminalID) => {
        if (terminalID) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to close terminal ID '${terminalID}'`)

            // Getting terminal and kill process
            const terminal = Terminal.GetTerminal(socket.id, terminalID)
            terminal.kill()

            // Deleting terminal from database
            Terminal.DeleteTerminal(socket.id, terminalID)

            // Sending updated terminals to frontend
            sendAllTerminals()
        }
    })

    // Event: 'close-all-terminals' - User wants to close all terminals
    socket.on('close-all-terminals', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to close all terminals`)

            // Killing all existing terminals for this user
            const user = Terminal.GetUser(socket.id)
            user.terminals.forEach((terminal) => {
                terminal.kill()
            })

            // Deleting all terminals
            Terminal.DeleteAllTerminals(socket.id)

            // Sending updated terminals to frontend
            sendAllTerminals()
        }
    })

    // Event: 'send-to-terminal'
    socket.on('send-to-terminal', (message) => {
        // Message: { id: terminalID, data: '...' }
        const terminalId = message.id
        const data = message.data

        // Getting terminal
        const terminal = Terminal.GetTerminal(socket.id, terminalId)
        terminal.send(data)

        // TODO
        // Error handling is needed here... with a additional message to the frontend :P
    })

    // Event: 'disconnect' - Fires when a client disconnects
    socket.on('disconnect', () => {
        console.log(`[Socket.io] -> Terminal: Client '${socket.id}' disconnects - closing all terminals and deleting user from database`)

        // Killing all existing terminals for this user
        const user = Terminal.GetUser(socket.id)
        user.terminals.forEach((terminal) => {
            terminal.kill()
        })

        // Deleting all user Data
        Terminal.DeleteUser(socket.id)
    })
}
