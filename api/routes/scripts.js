// Express
import express from 'express'

// Controller
import Controller from '../controllers/scripts.controller.js'

// Router
const router = express.Router()

// Router: '/scripts/..'
router.all('/', Controller.index) /* ALL index. */
router.get('/list', Controller.list) /* GET list of scripts. */
router.post('/execute', Controller.execute) /* POST: executes a script/file. */
router.get('/read', Controller.read) /* GET a file and returns data. */
router.get('/download', Controller.download) /* GET: downloading a file/folder. */
router.post('/add/file', Controller.addFile) /* POST: adding a file to host. */
router.post('/add/folder', Controller.addFolder) /* POST: adding a folder to host. */
router.post('/delete', Controller.deleteFileOrFolder) /* POST: deleting a given file/folder. */
router.post('/edit/file', Controller.editFile) /* POST: editing a file. */
router.post('/edit/folder', Controller.editFolder) /* POST: editing a folder. */

export default router
