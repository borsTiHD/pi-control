import { join } from 'path'
import { Low, JSONFile } from 'lowdb'

// Use JSON file for storage
const file = join('.', 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// LowDb: Writing User to database (db.json)
exports.createUser = async(userData) => {
    // Read data from JSON file, this will set db.data content
    await db.read()

    // If file.json doesn't exist, db.data will be null
    // Set default data
    db.data ||= { users: [] }

    // Create and query items
    db.data.users.push(userData)

    // Write db.data content to db.json
    return await db.write()
}
