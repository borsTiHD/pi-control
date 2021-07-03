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
                    const columns = outputArr.slice(6, 7)
                    const processes = outputArr.slice(7)
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
