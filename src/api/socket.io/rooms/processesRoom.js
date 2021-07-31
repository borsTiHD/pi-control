// Imports
import path from 'path'

// Controller
import clientNumInRoom from '../controllers/clientNumInRoom.js'

// ChildProcess Spawn Import
import ChildProcessClass from '../../classes/ChildProcessClass.js'
const childProcessSpawn = new ChildProcessClass()

export default (io, roomName, interval) => {
    // Promise for spawning
    const spawn = (script, args) => {
        return new Promise((resolve, reject) => {
            // Spawn Script
            childProcessSpawn.execShell(script, args, (pid, output) => { }, (pid, output, exitCode) => {
                resolve({ output, exitCode, pid })
            }, (error) => {
                reject(error)
            })
        })
    }

    setInterval(async() => {
        // Clients - Sends events only when clients are in the room
        const clients = clientNumInRoom(io, roomName)
        if (clients > 0) {
            try {
                console.log(`[Socket.io] -> ${clients} online users in room '${roomName}'`)

                // Script options
                const script = path.join('.', 'scripts', 'server', 'misc', 'top.sh')
                const args = null

                // Spawning script
                const raw = await spawn(script, args).catch((error) => {
                    throw error
                })

                // Parsing Output
                const outputArr = raw.output.split('\n')

                if (Array.isArray(outputArr) && outputArr.length > 6) {
                    const info = outputArr.slice(0, 5)
                    const columns = outputArr.slice(6, 7)[0].trim().split(/\s+/) // Get only columns, trims leading and trailing whitespaces, also splits at every +whitespace
                    const processes = outputArr.slice(7).map((rawItem) => {
                        const item = rawItem.trim().split(/\s+/) // Trim leading and trailing whitespaces, also splits at every +whitespace
                        // Exeption if an item is longer than 12 values
                        if (Array.isArray(item) && item.length > 12) {
                            // Problem: If our process item is longer than 12 columns, the last column is a command with separation
                            //          The solution is to cut out all items with index larger than 11 and turn them into one item
                            //          e.g.:
                            //              - oldItem: ["72", "root", "0", "-20", "0", "0", "0", "I", "0,0", "0,0", "0:00.00", "DWC", "Notif+"]
                            //              - newItem: ["72", "root", "0", "-20", "0", "0", "0", "I", "0,0", "0,0", "0:00.00", "DWC Notif+"]
                            // Combines every additional index after 11
                            const combined = item.slice(11).join(' ')

                            // Creating a new array with combined item on index 11
                            const newItem = []
                            item.some((value, index) => {
                                if (index <= 10) {
                                    // Adding every value with index smaller or equal 10 (includes up to index 10)
                                    newItem.push(value)
                                } else if (index === 11) {
                                    // Index 11 is completely replaced by the 'combined value'
                                    newItem.push(combined)
                                }
                                // Stopping loop if index equal or greater 12 - no need to looping more, its already added with the 'combined value'
                                return index >= 12
                            })
                            return newItem
                        }
                        return item
                    })

                    io.to(roomName).emit('processes', { _status: 'ok', data: { info, columns, processes } })
                } else {
                    console.error('[Socket.io] -> Error on parsing script output:', raw)
                    throw new Error('Error on parsing script output.')
                }
            } catch (error) {
                io.to(roomName).emit('processes', { _status: 'error', error: error.message, info: 'Something went wrong' })
            }
        }
    }, interval)
}
