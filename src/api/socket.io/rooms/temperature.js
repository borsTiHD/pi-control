// Imports
import initListener from '../controllers/roomEventListener.js'
import getTemperature from '../controllers/data/getTemperature.js'

// Room Event name
const eventName = 'temperature'

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
                const temperature = await getTemperature({ DEV: config.DEV, TEST_DATA: config.TEST_DATA })
                const result = { temperature, isWin }
                if (config.DEV && config.TEST_DATA) { result.TEST_DATA = true }
                io.to(roomName).emit(eventName, { _status: 'ok', data: result })
            } catch (error) {
                io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Error on getting temperature' })
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
