// Imports
import { spawn } from 'child_process'
import initListener from '../controllers/roomEventListener.js'

export default (io, roomName) => {
    // Interval for room tasks
    let child = null

    // Room event listener with callbacks for starting/stopping tasks
    initListener(io, roomName, () => {
        // Create Room Event: Initialize room interval
        child = initialize()
    }, () => {
        // Delete Room Event: Cleaning interval
        child.kill()
        child = null
    })

    async function parseProcessData(raw) {
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
            return { info, columns, processes }
        } else {
            console.error('[Socket.io] -> Error on parsing script output:', raw)
            throw new Error('Error on parsing script output.')
        }
    }

    // Room logic
    function initialize() {
        console.log(`[Socket.io] -> Room '${roomName}' starts performing its tasks`)
        try {
            // Spawn command
            const command = 'top'
            const args = ['-b']
            const child = spawn(command, args)

            // Data output
            child.stdout.setEncoding('utf8')
            child.stdout.on('data', (data) => {
                const convertedData = data.toString()
                io.to(roomName).emit('processes', { _status: 'test', convertedData })
                parseProcessData(convertedData).then((result) => {
                    io.to(roomName).emit('processes', { _status: 'ok', data: result })
                }).catch((err) => {
                    io.to(roomName).emit('processes', { _status: 'error', error: err.message, info: 'Error on parsing output' })
                })
            })

            // Error output
            child.stderr.setEncoding('utf8')
            child.stderr.on('data', (data) => {
                const convertedData = data.toString()
                io.to(roomName).emit('processes', { _status: 'error', error: convertedData, info: 'Error output from child process' })
            })

            // Child closed with error
            child.on('error', (error) => {
                io.to(roomName).emit('processes', { _status: 'error', error: error.message, info: 'Child process closed with error' })
            })

            // Child closed
            child.on('close', (code) => {
                io.to(roomName).emit('processes', { _status: 'closed', exitcode: code })
            })

            return child
        } catch (error) {
            io.to(roomName).emit('processes', { _status: 'error', error: error.message, info: 'Something went wrong' })
        }
    }
}
