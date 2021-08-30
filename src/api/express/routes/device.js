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
 *          ProcessesData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Running processes from host system determined
 *                  data:
 *                      type: array
 *                      description: Array contains objects with detail information about a running task. Object structure depends on the operating system used.
 *                      items:
 *                          type: object
 *          DiskspaceData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Diskspace from host system determined
 *                  data:
 *                      type: array
 *                      description: Array contains objects with diskspace data.
 *                      items:
 *                          type: object
 *                          properties:
 *                              filesystem:
 *                                  type: string
 *                                  description: Filesystem
 *                              type:
 *                                  type: string
 *                                  description: Type
 *                              total:
 *                                  type: number
 *                                  description: 1M-blocks
 *                              used:
 *                                  type: number
 *                                  description: Space used
 *                              available:
 *                                  type: number
 *                                  description: Space available
 *                              usedPercentage:
 *                                  type: number
 *                                  description: Usage in percent
 *                              mounted:
 *                                  type: string
 *                                  description: Mounted on
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
 *                      example: true
 *          MemoryData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Memory usage from host system determined
 *                  data:
 *                      type: object
 *                      properties:
 *                          memory:
 *                              type: object
 *                              description: Object contains memory usage.
 *                              properties:
 *                                  total:
 *                                      type: number
 *                                      description: Total existing memory
 *                                  used:
 *                                      type: number
 *                                      description: Used is a calculation of the total system ram minus allocated free, shared, buffer, and cache memory
 *                                  free:
 *                                      type: number
 *                                      description: Free is memory that is not being used for any purpose
 *                                  shared:
 *                                      type: number
 *                                      description: Shared, Buffer, and Cache fields identify memory being used for kernel/operating system needs. The buffer and cache are added together and the sum is listed under buff/cache
 *                                  cache:
 *                                      type: number
 *                                      description: Shared, Buffer, and Cache fields identify memory being used for kernel/operating system needs. The buffer and cache are added together and the sum is listed under buff/cache
 *                                  available:
 *                                      type: number
 *                                      description: Available memory show how many memory resources are still open for use
 *                          swap:
 *                              type: object
 *                              description: Object contains swap usage.
 *                              properties:
 *                                  total:
 *                                      type: number
 *                                      description: Total existing swap
 *                                  used:
 *                                      type: number
 *                                      description: Used swap
 *                                  free:
 *                                      type: number
 *                                      description: Free swap
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
 *                      example: true
 *          CpuData:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: CPU usage from host system determined
 *                  data:
 *                      type: object
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

/**
 * @swagger
 *  /device/processes:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get running processes from host system
 *          description: Returns an object with the running processes from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Object with running processes from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ProcessesData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/processes', Controller.getProcesses)

/**
 * @swagger
 *  /device/diskspace:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get diskspace from host system
 *          description: Returns an object with the diskspace from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Object with diskspace from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/DiskspaceData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/diskspace', Controller.getDiskspace)

/**
 * @swagger
 *  /device/memory:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get memory usage from host system
 *          description: Returns an object with the memory usage from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Object with memory usage from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/MemoryData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/memory', Controller.getMemory)

/**
 * @swagger
 *  /device/cpu:
 *      get:
 *          tags:
 *              - Device
 *          summary: Get cpu usage from host system
 *          description: Returns an object with the cpu usage from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Object with cpu usage from the host system.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/CpuData'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/cpu', Controller.getCpuLoad)

export default router
