// Imports
import initListener from '../controllers/roomEventListener.js'
import getProcesses from '../controllers/data/getProcesses.js'

// Room Event name
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

    // Room logic
    function initialize(duration) {
        console.log(`[Socket.io] -> Room '${roomName}' starts performing its tasks`)
        try {
            const id = setInterval(async() => {
                try {
                    const isWin = process.platform === 'win32'
                    const psList = await getProcesses()
                    io.to(roomName).emit(eventName, { _status: 'ok', data: { processes: psList, isWin } })
                } catch (error) {
                    io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Error on starting tasks' })
                }
            }, duration)

            return id
        } catch (error) {
            io.to(roomName).emit(eventName, { _status: 'error', error: error.message, info: 'Something went wrong' })
        }
    }
}
