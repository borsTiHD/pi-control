/**
 * @swagger
 *      components:
 *          schemas:
 *              Book:
 *                  type: object
 *                  required:
 *                      - title
 *                      - author
 *                      - finished
 *                  properties:
 *                      id:
 *                          type: integer
 *                          description: The auto-generated id of the book.
 *                      title:
 *                          type: string
 *                          description: The title of your book.
 *                  example:
 *                      title: The Pragmatic Programmer
 */

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
