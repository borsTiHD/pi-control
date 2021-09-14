/**
 * @swagger
 *  components:
 *      responses:
 *          OkObject:
 *              description: Object with "_status", "info" and "request".
 *          ErrorObject:
 *              description: Object with "_status", "info" and "error".
 *      schemas:
 */

/**
 * @swagger
 *  tags:
 *      name: Package
 *      description: Package Manager from host system
 */

// Express
import express from 'express'

// Controller
import Controller from '../controllers/package.controller.js'

// Router: '/package/..'
const router = express.Router()

/**
 * @swagger
 *  /package/list:
 *      get:
 *          tags:
 *              - Package
 *          summary: Get installed packages from host system
 *          description: Returns an object with a list of installed packages from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with a list of installed packages from the host system.
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/list', Controller.getList)

export default router
