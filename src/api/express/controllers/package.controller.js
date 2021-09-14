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
        const packages = await PackageList()

        // Return results
        res.json({
            _status: 'ok',
            info: 'Installed packages from host system determined',
            data: { packages }
        })
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
