// Express
const express = require('express')
const router = express.Router()

/* GET users listing. */
router.all('/', (req, res, next) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
})

module.exports = router
