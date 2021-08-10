// Middleware
import asyncHandler from '../middleware/asyncHandler.js' // Middleware for handling errors on promise calls
import Uptime from '../../controllers/getUptime.js'

/**
 * Route serving list of files from host
 * @name getUptime
 * @function
 * @memberof module:routers/device
 */
const getUptime = asyncHandler(async(req, res, next) => {
    try {
        const uptime = await Uptime()

        // Return results
        res.json({
            _status: 'ok',
            info: 'Runtime from host system determined',
            data: { uptime }
        })
    } catch (error) {
        console.error(error)
        // REST return
        res.status(500).json({
            _status: 'error',
            info: 'Runtime could not be determined',
            error: error.message
        })
    }
})

export default {
    getUptime
}
