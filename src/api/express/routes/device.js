/**
 * @swagger
 *  components:
 *      responses:
 *          OkObject:
 *              description: Object with "_status", "info" and "request".
 *          ErrorObject:
 *              description: Object with "_status", "info" and "error".
 *      schemas:
 *          UptimeObject:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                  data:
 *                      type: object
 *                      properties:
 *                          uptime:
 *                              type: string
 *                              description: Shows the uptime of the host system.
 *          SystemData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                  data:
 *                      type: object
 */

/**
 * @swagger
 *  tags:
 *      name: Device
 *      description: Manages States from host system
 */

// Express
import express from 'express'

// Controller
import Controller from '../controllers/device.controller.js'

// Router: '/device/..'
const router = express.Router()

/**
 * @swagger
 *  /device/uptime:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get uptime from host system
 *          description: Returns an object with the uptime from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with the uptime of the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/UptimeObject'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/uptime', Controller.getUptime)

/**
 * @swagger
 *  /device/system:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get system information from host system
 *          description: Returns an object with the system informations from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with the uptime of the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/SystemData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/system', Controller.getSystem)

export default router
