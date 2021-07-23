/**
 * @swagger
 *  components:
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
 *          summary: Entry point.
 *          description: Welcome to the apps scripts express api!
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
 *          summary: Get list of Scripts.
 *          description: Returns an object with a list of available scripts from the host system.
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
 *          summary: Get list of Scripts.
 *          description: Returns an object with a list of available scripts from the host system.
 */
router.post('/execute', Controller.execute) /* POST: executes a script/file. */

router.get('/read', Controller.read) /* GET a file and returns data. */

router.get('/download', Controller.download) /* GET: downloading a file/folder. */

router.post('/add/file', Controller.addFile) /* POST: adding a file to host. */

router.post('/add/folder', Controller.addFolder) /* POST: adding a folder to host. */

router.post('/delete', Controller.deleteFileOrFolder) /* POST: deleting a given file/folder. */

router.post('/edit/file', Controller.editFile) /* POST: editing a file. */

router.post('/edit/folder', Controller.editFolder) /* POST: editing a folder. */

export default router
