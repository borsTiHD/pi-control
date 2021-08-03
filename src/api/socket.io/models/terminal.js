// Use Memory for storage
const db = {
    users: []
}

// Initialize DB
async function init() {
    // Could be used in the future to set up a new database
    // ...
}
init()

// New User to database
function CreateUser(userId) {
    const user = GetUser(userId)
    if (!user) {
        // Create new user
        return db.users.push({
            id: userId, // User ID: 'socket.id'
            createdTerminals: 0, // Sets how many terminals created for the user... in addition, it is used as a continuous terminal id
            terminals: [] // Terminals / Child processes
        })
    }

    // User already exists
    return false
}

// Delete User from database
function DeleteUser(userId) {
    // Get user index and check if user exists
    const userIndex = db.users.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
        // Delete user by index
        db.users.splice(userIndex, 1)
    }
}

// Getting user from database by id
function GetUser(id) {
    // Read data from database
    const user = db.users.find((user) => user.id === id)
    return user
}

// Storing new terminal instance to user
function AddTerminal(userId, terminal) {
    // Get user index and check if user exists
    const userIndex = db.users.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
        // Get User data
        const user = db.users[userIndex]

        // Increases 'createdTerminals' by one
        user.createdTerminals += 1
        user.terminals.push({
            id: user.createdTerminals, // Use new increased number as terminal id
            terminal
        })
    }
}

// Getting terminal from database by id
function GetTerminal(userId, terminalId) {
    // Get user index and check if user exists
    const userIndex = db.users.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
        // Get User data
        const user = db.users[userIndex]

        // Get terminal index by id
        const terminalIndex = user.terminals.findIndex((terminal) => terminal.id === parseInt(terminalId))
        if (terminalIndex !== -1) {
            // Return terminal object
            return user.terminals[terminalIndex]
        }
    }
}

// Delete existing terminal from database
function DeleteTerminal(userId, terminalId) {
    // Get user index and check if user exists
    const userIndex = db.users.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
        // Get User data
        const user = db.users[userIndex]

        // Get terminal index by id
        const terminalIndex = user.terminals.findIndex((terminal) => terminal.id === parseInt(terminalId))
        if (terminalIndex !== -1) {
            // Delete terminal object by index
            user.terminals.splice(terminalIndex, 1)
        }
    }
}

// Delete all terminals from database
function DeleteAllTerminals(userId) {
    // Get user index and check if user exists
    const userIndex = db.users.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
        // Get User data
        const user = db.users[userIndex]

        // Delete all terminals
        user.terminals = []
    }
}

export default {
    CreateUser,
    DeleteUser,
    GetUser,
    AddTerminal,
    GetTerminal,
    DeleteTerminal,
    DeleteAllTerminals
}
