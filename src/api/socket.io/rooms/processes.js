// Imports
import { spawn } from 'child_process'
import initListener from '../controllers/roomEventListener.js'

const isWin = process.platform === 'win32'
const eventName = 'processes'

export default (io, roomName) => {
    // Interval
    let intervalId = null

    // Room event listener with callbacks for starting/stopping tasks
    initListener(io, roomName, () => {
        // Create Room Event: Initialize room tasks
        const duration = 2 * 1000 // Interval duration in milliseconds
        intervalId = initialize(duration)
    }, () => {
        // Delete Room Event: Clearing interval
        clearInterval(intervalId)
        intervalId = null
    })

    // Parsing raw output
    /*
    async function parseProcessData(raw) {
        const outputArr = raw.split('\n')
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
            return { info, columns, processes }
        } else {
            console.error('[Socket.io] -> Error on parsing script output:', raw)
            throw new Error('Error on parsing script output.')
        }
    }
    */

    // Collecting processes with 'ps'
    function unix() {
        // Collecting chunk data
        let chunk = ''

        // Spawn command
        const command = 'ps'
        const args = ['axo', 'pid,ppid,user,tty,stat,pcpu,pmem,etime,time,comm,args']
        const child = spawn(command, args)

        // Data output (adding data to chunk)
        child.stdout.setEncoding('utf8')
        child.stdout.on('data', (data) => {
            // Adds output to chunkdata
            const convertedData = data.toString()
            chunk += convertedData
        })

        // Error output
        child.stderr.setEncoding('utf8')
        child.stderr.on('data', (data) => {
            const convertedData = data.toString()
            io.to(roomName).emit(eventName, { _status: 'error', error: convertedData, info: 'Error output from child process' })
        })

        // Child closed with error
        child.on('error', (error) => {
            io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Child process closed with error' })
        })

        // Child closed
        child.on('close', (code) => {
            // io.to(roomName).emit(eventName, { _status: 'closed', exitcode: code })
            io.to(roomName).emit(eventName, { _status: 'ok', data: chunk })

            // Parsing output and send to socket room
            /*
            parseProcessData(chunk).then((result) => {
                io.to(roomName).emit(eventName, { _status: 'ok', data: result })
            }).catch((err) => {
                io.to(roomName).emit(eventName, { _status: 'error', error: err.message, info: 'Error on parsing output' })
            })
            */
        })
    }

    // Collecting processes on windows
    function isWindows() {
        io.to(roomName).emit(eventName, { _status: 'error', error: 'Operating system is currently not supported', info: 'Error on starting tasks' })
    }

    // Room logic
    function initialize(duration) {
        console.log(`[Socket.io] -> Room '${roomName}' starts performing its tasks`)
        try {
            const id = setInterval(() => {
                // Determines data depending on operating system
                if (isWin) {
                    isWindows()
                } else {
                    unix()
                }
            }, duration)

            return id
        } catch (error) {
            io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Something went wrong' })
        }
    }
}
