// Express
const express = require('express')
const router = express.Router()

// Controller
const controller = require('../controllers/scriptsController')

// Router: '/scripts/..'
router.all('/', controller.index) /* ALL index. */
router.get('/list', controller.list) /* GET list of scripts. */
router.post('/execute', controller.execute) /* POST: executes a script/file. */
router.get('/read', controller.read) /* GET a file and returns data. */
router.get('/download', controller.download) /* GET: downloading a file/folder. */
router.post('/add/file', controller.addFile) /* POST: adding a file to host. */
router.post('/add/folder', controller.addFolder) /* POST: adding a folder to host. */
router.post('/delete', controller.delete) /* POST: deleting a given file/folder. */
router.post('/edit/file', controller.editFile) /* POST: editing a file. */
router.post('/edit/folder', controller.editFolder) /* POST: editing a folder. */

module.exports = router
