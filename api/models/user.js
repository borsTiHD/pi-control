import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

// Use JSON file for storage
const file = join('.', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Initialize DB and set users data
async function init() {
// Read data from JSON file, this will set db.data content
    await db.read()

    // If file.json doesn't exist, db.data will be null
    // Set default data
    db.data ||= { users: [] }
}
init()

// LowDb: Writing User to database (db.json)
async function CreateUser(userData) {
    // Create items + write db.data content to db.json
    const user = db.data.users.push(userData)
    await db.write()
    return user
}

// LowDb: Getting user from database
async function GetUser(email) {
    // Read data from JSON file
    const user = db.data.users.find((user) => user.email === email)
    return user
}

// LowDb: Counting existing users in database or returns false
async function CountUsers() {
    // Read data from JSON file
    const users = db.data.users
    if (users && Array.isArray(users)) {
        return db.data.users.length
    }
    return false
}

export default {
    CreateUser,
    GetUser,
    CountUsers
}
