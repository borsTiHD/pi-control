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
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Runtime from host system determined
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
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: System informations from host system determined
 *                  data:
 *                      type: array
 *                      description: Array contains objects with 'name' and 'state'.
 *                      items:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: Name of the system information.
 *                              state:
 *                                  type: string
 *                                  description: State of the system information.
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
 *          HardwareData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Hardware informations from host system determined
 *                  data:
 *                      type: array
 *                      description: Array contains parsed objects with 'name' and 'state'.
 *                      items:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: Name of the system information.
 *                              state:
 *                                  type: string
 *                                  description: State of the system information.
 *                  all:
 *                      type: array
 *                      description: Array contains all objects with 'name' and 'state'.
 *                      items:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: Name of the system information.
 *                              state:
 *                                  type: string
 *                                  description: State of the system information.
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
 *          TemperatureData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: System temperature from host system determined
 *                  data:
 *                      type: string
 *                      description: Shows the currently determined temperature.
 *                      example: 44'C
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
 *                      example: true
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
 *                  description: Object with system informations from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/SystemData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/system', Controller.getSystem)

/**
 * @swagger
 *  /device/hardware:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get hardware information from host system
 *          description: Returns an object with the hardware informations from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Object with hardware informations from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HardwareData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/hardware', Controller.getHardware)

/**
 * @swagger
 *  /device/temperature:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get temperature from host system
 *          description: Returns an object with the temperature from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Object with temperature from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/TemperatureData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/temperature', Controller.getTemperature)

export default router
