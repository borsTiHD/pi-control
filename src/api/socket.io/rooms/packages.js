// Imports
import initListener from '../controllers/roomEventListener.js' // Controller from socket.io folder
import getPackageList from '../../controllers/getPackageList.js' // Root dir of API Folder

// Room Event name
const eventName = 'packages'

export default (io, roomName, config = {}) => {
    // Setting duration from config, or default
    const duration = config.duration || 5 * 1000 // Default 5 seconds

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
                const packages = await getPackageList()
                const result = { packages, isWin }
                if (config.DEV && config.TEST_DATA) { result.TEST_DATA = true }
                io.to(roomName).emit(eventName, { _status: 'ok', data: result })
            } catch (error) {
                io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Error on getting packages' })
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
