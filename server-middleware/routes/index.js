// Express
const express = require('express')
const router = express.Router()

// Route: '/' -> REST Api index endpoint
router.all('/', (req, res, next) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
})

module.exports = router
