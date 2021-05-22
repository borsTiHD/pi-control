// Express
const express = require('express')
const router = express.Router()

/* GET users listing. */
router.all('/', (req, res, next) => {
    console.log('[API] -> PLEASE HELP ME!')
    res.json({
        _status: 'ok',
        info: 'You are searching for help?'
    })
})

module.exports = router
