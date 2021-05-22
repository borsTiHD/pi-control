// Express
const express = require('express')
const router = express.Router()

// Route: '/help' -> just for testing purpose right now
router.all('/', (req, res, next) => {
    console.log('[API] -> PLEASE HELP ME!')
    res.json({
        _status: 'ok',
        info: 'You are searching for help?'
    })
})

module.exports = router
