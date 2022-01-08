// Middleware
import asyncHandler from '../middleware/asyncHandler.js' // Middleware for handling errors on promise calls

// Controller
import PackageList from '../../controllers/getPackageList.js'

/**
 * Route get installed packages from host
 * @name getList
 * @function
 * @memberof module:routers/device
 */
const getList = asyncHandler(async(req, res, next) => {
    try {
        // Config with 'dev' and 'TEST_DATA' check
        const config = {
            DEV: process.env.NODE_ENV === 'development',
            TEST_DATA: process.env.TEST_DATA
        }

        const packages = await PackageList(config)
        const result = {
            _status: 'ok',
            info: 'Installed packages from host system determined',
            data: { packages }
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
            info: 'Installed packages could not be determined',
            error: error.message
        })
    }
})

export default {
    getList
}
