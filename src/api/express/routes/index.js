// Express
import express from 'express'
import pkg from '../../package-json.js'
const router = express.Router()

/**
 * @swagger
 *  /:
 *      get:
 *          summary: Entry point.
 *          description: Welcome to the apps express api!
 *          responses:
 *              200:
 *                  description: Returns an object with an mysterious string.
 */
router.all('/', (req, res, next) => {
    res.json({
        _status: 'ok',
        info: `Endpoint is set up. Welcome to express api backend for ${pkg.productName}`
    })
})

export default router
