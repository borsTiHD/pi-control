// Imports
import initListener from '../controllers/roomEventListener.js'
import getTemperature from '../controllers/data/getTemperature.js'

// Room Event name
const eventName = 'temperature'

export default (io, roomName, duration = 5 * 1000) => {
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
                const temperature = await getTemperature()
                io.to(roomName).emit(eventName, { _status: 'ok', data: { temperature, isWin } })
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
