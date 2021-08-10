// Imports
import initListener from '../controllers/roomEventListener.js' // Controller from socket.io folder
import getProcesses from '../../controllers/getProcesses.js' // Root dir of API Folder

// Room Event name
const eventName = 'processes'

export default (io, roomName, duration = 2 * 1000) => {
    // Interval
    let intervalId = null

    // Room event listener with callbacks for starting/stopping tasks
    initListener(io, roomName, () => {
        // Create Room Event: Initialize room tasks
        intervalId = initialize(duration)
    }, () => {
        // Delete Room Event: Clearing interval
        clearInterval(intervalId)
        intervalId = null
    })

    // Room logic
    function initialize(duration) {
        console.log(`[Socket.io] -> Room '${roomName}' starts performing its tasks`)
        async function getData() {
            try {
                const isWin = process.platform === 'win32'
                const psList = await getProcesses()
                io.to(roomName).emit(eventName, { _status: 'ok', data: { processes: psList, isWin } })
            } catch (error) {
                io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Error on starting tasks' })
            }
        }

        try {
            getData() // Get firsttime, then with interval
            const id = setInterval(() => { getData() }, duration)
            return id
        } catch (error) {
            io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Something went wrong' })
        }
    }
}
