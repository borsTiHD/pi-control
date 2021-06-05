// Express
import express from 'express'
const router = express.Router()

// Route: '/' -> REST Api index endpoint
router.all('/', (req, res, next) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
})

export default router
