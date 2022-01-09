/**
 * @swagger
 *  components:
 *      responses:
 *          OkObject:
 *              description: Object with "_status", "info" and "request".
 *          ErrorObject:
 *              description: Object with "_status", "info" and "error".
 *      schemas:
 *          PackageList:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Installed packages from host system determined
 *                  data:
 *                      type: object
 *                      properties:
 *                          packages:
 *                              type: array
 *                              description: Array contains parsed objects with 'name', 'version', and 'installed' properties.
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                          description: Name of the package.
 *                                      version:
 *                                          type: string
 *                                          description: Version of the package.
 *                                      installed:
 *                                          type: string
 *                                          description: Status of the package.
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
 *          PackageListUpdate:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                      example: ok
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                      example: Update package list successfully
 *                  data:
 *                      type: string
 *                      description: Raw output from 'apt-get update' command.
 *                  TEST_DATA:
 *                      type: boolean
 *                      description: Only exists, if the host system is using test data.
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
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/PackageList'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/list', Controller.getList)

/**
 * @swagger
 *  /package/updatelist:
 *      get:
 *          tags:
 *              - Package
 *          summary: Update package list from host system
 *          description: Returns an object with a list of installed packages from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with info if it was successful or not.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/PackageListUpdate'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/updatelist', Controller.updateList)

export default router
