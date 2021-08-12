// Middleware
import asyncHandler from '../middleware/asyncHandler.js' // Middleware for handling errors on promise calls

// Controller
import Uptime from '../../controllers/getUptime.js'
import System from '../../controllers/getSystem.js'
import Hardware from '../../controllers/getHardware.js'
import Temperature from '../../controllers/getTemperature.js'
import Processes from '../../controllers/getProcesses.js'

/**
 * Route serving uptime from host
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

/**
 * Route serving system informations from host
 * @name getSystem
 * @function
 * @memberof module:routers/device
 */
const getSystem = asyncHandler(async(req, res, next) => {
    try {
        // Config with 'dev' and 'TEST_DATA' check
        const config = {
            DEV: process.env.NODE_ENV === 'development',
            TEST_DATA: process.env.TEST_DATA
        }

        // Getting data from controller
        const data = await System(config)
        const result = {
            _status: 'ok',
            info: 'System informations from host system determined',
            data
        }

        // If we're using test data, we append the information on our result object
        if (config.DEV && config.TEST_DATA) { result.TEST_DATA = true }

        // Return results
        res.json(result)
    } catch (error) {
        console.error(error)
        // REST return
        res.status(500).json({
            _status: 'error',
            info: 'System informations could not be determined',
            error: error.message
        })
    }
})

/**
 * Route serving hardware informations from host
 * @name getHardware
 * @function
 * @memberof module:routers/device
 */
const getHardware = asyncHandler(async(req, res, next) => {
    try {
        // Config with 'dev' and 'TEST_DATA' check
        const config = {
            DEV: process.env.NODE_ENV === 'development',
            TEST_DATA: process.env.TEST_DATA
        }

        // Getting data from controller
        const { parsed, all } = await Hardware(config)
        const result = {
            _status: 'ok',
            info: 'Hardware informations from host system determined',
            data: parsed,
            all
        }

        // If we're using test data, we append the information on our result object
        if (config.DEV && config.TEST_DATA) { result.TEST_DATA = true }

        // Return results
        res.json(result)
    } catch (error) {
        console.error(error)
        // REST return
        res.status(500).json({
            _status: 'error',
            info: 'Hardware informations could not be determined',
            error: error.message
        })
    }
})

/**
 * Route serving temperature from host
 * @name getTemperature
 * @function
 * @memberof module:routers/device
 */
const getTemperature = asyncHandler(async(req, res, next) => {
    try {
        // Config with 'dev' and 'TEST_DATA' check
        const config = {
            DEV: process.env.NODE_ENV === 'development',
            TEST_DATA: process.env.TEST_DATA
        }

        // Getting data from controller
        const data = await Temperature(config)
        const result = {
            _status: 'ok',
            info: 'System temperature from host system determined',
            data
        }

        // If we're using test data, we append the information on our result object
        if (config.DEV && config.TEST_DATA) { result.TEST_DATA = true }

        // Return results
        res.json(result)
    } catch (error) {
        console.error(error)
        // REST return
        res.status(500).json({
            _status: 'error',
            info: 'System temperature could not be determined',
            error: error.message
        })
    }
})

/**
 * Route serving running processes from host
 * @name getTemperature
 * @function
 * @memberof module:routers/device
 */
const getProcesses = asyncHandler(async(req, res, next) => {
    try {
        // Getting data from controller
        const data = await Processes()
        res.json({
            _status: 'ok',
            info: 'Running processes from host system determined',
            data
        })
    } catch (error) {
        console.error(error)
        // REST return
        res.status(500).json({
            _status: 'error',
            info: 'Running processes could not be determined',
            error: error.message
        })
    }
})

export default {
    getUptime,
    getSystem,
    getHardware,
    getTemperature,
    getProcesses
}
