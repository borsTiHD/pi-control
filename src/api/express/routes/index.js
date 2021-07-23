// Express
import express from 'express'
import pkg from '../../package-json.js'
const router = express.Router()

/**
 * @swagger
 *  /:
 *      get:
 *          description: Welcome to express api!
 *          responses:
 *              200:
 *                  description: Returns a mysterious string.
 */
router.all('/', (req, res, next) => {
    res.json({
        _status: 'ok',
        info: `Endpoint is set up. Welcome to express api backend for ${pkg.productName}`
    })
})

export default router
