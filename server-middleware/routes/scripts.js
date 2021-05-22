// Express
const express = require('express')
const router = express.Router()

// Require controller modules
const controller = require('../controllers/scriptsController')

// Router
router.all('/', controller.index) /* GET users listing. */
router.get('/list', controller.list) /* GET users listing. */
router.post('/execute', controller.execute) /* GET users listing. */
router.get('/read', controller.read) /* GET users listing. */
router.get('/download', controller.download) /* GET users listing. */
router.post('/add/file', controller.addFile) /* GET users listing. */
router.post('/add/folder', controller.addFolder) /* GET users listing. */
router.post('/delete', controller.delete) /* GET users listing. */
router.post('/edit/file', controller.editFile) /* GET users listing. */
router.post('/edit/folder', controller.editFolder) /* GET users listing. */

module.exports = router
