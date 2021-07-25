/**
 * @swagger
 *  components:
 *      responses:
 *          ErrorObject:
 *              description: Object with "_status", "info" and "error".
 *      schemas:
 *          ListOfScripts:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                  scripts:
 *                      type: object
 *                      properties:
 *                          path:
 *                              type: string
 *                              description: Path from the file/folder.
 *                          name:
 *                              type: string
 *                              description: Name from the file/folder.
 *                          id:
 *                              type: integer
 *                              description: Random ID given from the host system. Not a fixed number.
 *                          type:
 *                              type: string
 *                              description: Declares if its a file or folder.
 *                          children:
 *                              type: array
 *                              description: Value exists only if it is a directory and contains an array of objects each with additional directories or files.
 *                              items:
 *                                  type: object
 *                                  description: Object with data for another file or folder.
 *          ScriptExecuted:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                  response:
 *                      type: object
 *                      description: Response of the executed script.
 *          ScriptRead:
 *              type: object
 *              properties:
 *                  _status:
 *                      type: string
 *                      description: Status of the request
 *                  info:
 *                      type: string
 *                      description: Readable info what was done.
 *                  response:
 *                      type: object
 *                      description: Response of the executed script.
 */

/**
 * @swagger
 *  tags:
 *      name: Scripts
 *      description: Manages scripts of the host system
 */

// Express
import express from 'express'

// Controller
import Controller from '../controllers/scripts.controller.js'

// Router: '/scripts/..'
const router = express.Router()

/**
 * @swagger
 *  /scripts:
 *      get:
 *          tags:
 *              - Scripts
 *          summary: Entry point
 *          description: Welcome to the apps scripts express api!
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with an mysterious string.
 */
router.all('/', Controller.index)

/**
 * @swagger
 *  /scripts/list:
 *      get:
 *          tags:
 *              - Scripts
 *          summary: Get list of Scripts
 *          description: Returns an object with a list of available scripts from the host system.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with the list of scripts.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ListOfScripts'
 */
router.get('/list', Controller.list) /* GET list of scripts. */

/**
 * @swagger
 *  /scripts/execute:
 *      post:
 *          tags:
 *              - Scripts
 *          summary: Spawn a script
 *          description: Set a path to an existing script and it will be executed from the host system.
 *          parameters:
 *              - in: query
 *                name: script
 *                schema:
 *                  type: string
 *                required: true
 *                description: Path of the script to be executed.
 *              - in: query
 *                name: args
 *                schema:
 *                  type: array
 *                explode: true
 *                style: pipeDelimited
 *                description: (Optional) arguments to be passed to the script.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with the response of the scripts.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/ScriptExecuted'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.post('/execute', Controller.execute) /* POST: executes a script/file. */

/**
 * @swagger
 *  /scripts/read:
 *      get:
 *          tags:
 *              - Scripts
 *          summary: Reads a file/folder and returns data
 *          description: Reads a file or folder from the host system and returns the source of the file, or stats from the folder.
 *          parameters:
 *              - in: query
 *                name: path
 *                schema:
 *                  type: string
 *                required: true
 *                description: Path of the script.
 *              - in: query
 *                name: name
 *                schema:
 *                  type: string
 *                description: (just required for response) - Name of the script.
 *              - in: query
 *                name: id
 *                schema:
 *                  type: number
 *                description: (just required for response) - ID of the script.
 *              - in: query
 *                name: type
 *                schema:
 *                  type: string
 *                description: (just required for response) - Type of the script.
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Returns an object with the response of the scripts.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  _status:
 *                                      type: string
 *                                      description: Status of the request
 *                                  info:
 *                                      type: string
 *                                      description: Readable info what was done (read script or folder).
 *                                  script:
 *                                      type: object
 *                                      description: If it was a file. Content of the file.'
 *                                  folder:
 *                                      type: object
 *                                      description: If it was a folder. Content of the folder.'
 *              500:
 *                  $ref: '#/components/responses/ErrorObject'
 */
router.get('/read', Controller.read)

router.get('/download', Controller.download) /* GET: downloading a file/folder. */

router.post('/add/file', Controller.addFile) /* POST: adding a file to host. */

router.post('/add/folder', Controller.addFolder) /* POST: adding a folder to host. */

router.post('/delete', Controller.deleteFileOrFolder) /* POST: deleting a given file/folder. */

router.post('/edit/file', Controller.editFile) /* POST: editing a file. */

router.post('/edit/folder', Controller.editFolder) /* POST: editing a folder. */

export default router
