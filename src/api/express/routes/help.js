// Express
import express from 'express'
const router = express.Router()

/**
 * @swagger
 *  /help:
 *      get:
 *          description: Not implemented right now. Could return a documentation in the future...
 *          responses:
 *              200:
 *                  description: Returns a string.
 */
router.all('/', (req, res, next) => {
    res.json({
        _status: 'ok',
        info: 'You are searching for help?'
    })
})

export default router
