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
        clearTerminals() // Cleanup empty terminal data

        // Sending all terminals, but only the id's
        const user = Terminal.GetUser(socket.id)
        socket.emit('getAllTerminals', { _status: 'ok', terminals: user.terminals.map((x) => { return { id: x.id } }) }) // Map returns only the id property
    }

    // Deleting not working terminals from database
    function clearTerminals() {
        function deleteTerminalId(terminalId, terminalObj) {
            const errorInfo = `Terminal ID ${terminalId} not working. Deleting ID from database...`
            console.error(`[Socket.io] -> ${errorInfo}`, terminalObj)
            socket.emit('terminalMessage', { type: 'error', data: errorInfo })
            // Deleting terminal from database
            Terminal.DeleteTerminal(socket.id, terminalId)
        }

        // Getting user data
        const user = Terminal.GetUser(socket.id)
        user.terminals.forEach((obj) => {
            // Trying to detect defectice terminals
            try {
                // Check if terminal object exists
                if (!obj.terminal) {
                    console.error(`[Socket.io] -> Terminal ID "${obj.id}": Object not existing`)
                    deleteTerminalId(obj.id, obj.terminal)
                }

                // Check if pid can be determined
                const pid = obj.terminal.getPid()
                if (!pid) {
                    console.error(`[Socket.io] -> Terminal ID "${obj.id}": Pid could not be determined`)
                    deleteTerminalId(obj.id, obj.terminal)
                }
            } catch (error) {
                console.error(`[Socket.io] -> Terminal ID "${obj.id}": Undefined error occurred`)
                deleteTerminalId(obj.id, obj.terminal)
            }
        })
    }

    // Event: 'new-terminal' - Create a new Terminal instance
    socket.on('new-terminal', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to start a new terminal`)
            try {
                // Adding an empty terminal to database
                // Return value is the id for the terminal object
                const id = Terminal.NewTerminal(socket.id)
                if (!id) {
                    // No session could be established, because user does not exists
                    throw new Error('Could not create a terminal because the user does not exist')
                }

                // Creating new terminal session
                // Callback function will emit data output
                const session = shellSession((data) => {
                    // data = { _status: 'ok', type: 'data', data: 'buffer.toString()' }
                    socket.emit('terminal', { id, ...data })
                })

                // Saving session instance in database
                Terminal.AddTerminal(socket.id, id, session)

                // Sending updated terminals to frontend
                sendAllTerminals()
            } catch (error) {
                console.error('[Socket.io] -> Cant create a new terminal session:', error)
                socket.emit('terminalMessage', { type: 'error', data: error.message })
                clearTerminals() // Cleanup empty terminal data
            }
        }
    })

    // Event: 'get-all-terminals' - Get all open terminal ID's
    socket.on('get-all-terminals', (message) => {
        if (message) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to get all terminals`)
            sendAllTerminals() // Sending updated terminals to frontend
        }
    })

    // Event: 'resize-terminal' - Resize terminal
    socket.on('resize-terminal', (message) => {
        // Message = { id: terminalId, cols: number, rows: number }
        if (message) {
            try {
                const terminal = Terminal.GetTerminal(socket.id, message.id)
                if (terminal) {
                    terminal.resize(message.cols, message.rows)
                } else {
                    throw new Error('Terminal does not exist')
                }
            } catch (error) {
                // console.error(`[Socket.io] -> Terminal: Client '${socket.id}' - Error on resizing terminal session:`, error)
                // socket.emit('terminalMessage', { type: 'error', data: `Error on resizing terminal session: ${error.message}` })
            }
        }
    })

    // Event: 'close-terminal' - User wants to close terminal with id
    socket.on('close-terminal', (terminalID) => {
        if (terminalID) {
            console.log(`[Socket.io] -> Terminal: Client '${socket.id}' wants to close terminal ID '${terminalID}'`)

            // Getting terminal and kill process
            const terminal = Terminal.GetTerminal(socket.id, terminalID)
            if (terminal) {
                terminal.kill()
            } else {
                throw new Error('Terminal does not exist')
            }

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
            user.terminals.forEach((obj) => {
                obj.terminal.kill()
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
        try {
            // Getting terminal and sending data
            const terminal = Terminal.GetTerminal(socket.id, terminalId)
            if (terminal) {
                terminal.send(data)
            } else {
                throw new Error('Terminal does not exist')
            }
        } catch (error) {
            console.error(`[Socket.io] -> Terminal: Client '${socket.id}' - Error on sending data to terminal session:`, error)
            socket.emit('terminalMessage', { type: 'error', data: `Error on sending data to terminal session: ${error.message}` })
        }
    })

    // Event: 'disconnect' - Fires when a client disconnects
    socket.on('disconnect', () => {
        console.log(`[Socket.io] -> Terminal: Client '${socket.id}' disconnects - closing all terminals and deleting user from database`)

        // Killing all existing terminals for this user
        const user = Terminal.GetUser(socket.id)
        user.terminals.forEach((obj) => {
            if (obj.terminal) {
                try {
                    obj.terminal.kill()
                } catch (error) {
                    // Terminal session not existing...
                }
            }
        })

        // Deleting all user Data
        Terminal.DeleteUser(socket.id)
    })
}
