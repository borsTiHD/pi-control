// Imports
import initListener from '../controllers/roomEventListener.js' // Controller from socket.io folder
import getUptime from '../../controllers/getUptime.js' // Root dir of API Folder

// Room Event name
const eventName = 'uptime'

export default (io, roomName, duration = 60 * 1000) => {
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
                const uptime = await getUptime()
                io.to(roomName).emit(eventName, { _status: 'ok', data: { uptime, isWin } })
            } catch (error) {
                io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Error on getting uptime' })
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
