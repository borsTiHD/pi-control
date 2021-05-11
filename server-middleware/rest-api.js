// Imports
const path = require('path')
const express = require('express')

// Middleware for handling errors on promise calls
const asyncHandler = require('../server-middleware/asyncMiddleware')

// ChildProcess Spawn Import
const ChildProcessClass = require('../classes/ChildProcessClass')
const childProcessSpawn = new ChildProcessClass()

// ProjectRoot Directory
const root = path.join(__dirname, '..')

// Express Init
const app = express()
app.use(express.json())

app.all('/', (req, res) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
})

app.all('/help', (req, res) => {
    console.log('[API] -> PLEASE HELP ME!')
    res.json({
        _status: 'ok',
        info: 'You are searching for help?'
    })
})

app.all('/execute', asyncHandler(async(req, res, next) => {
    const { query } = req
    const script = query.script
    const args = query.args || []

    // Promise for spawning
    const spawn = () => {
        return new Promise((resolve, reject) => {
            // Spawn Script
            childProcessSpawn.execShell(`${root}/scripts/${script}`, args, (pid, output) => { }, (pid, output, exitCode) => {
                resolve({ output, exitCode, pid })
            }, (error) => {
                reject(error)
            })
        })
    }

    // Spawn script
    const response = await spawn().catch((error) => {
        // REST return
        res.json({
            _status: 'error',
            info: 'Script not successfully executed',
            error
        })
    })

    // REST return
    res.json({
        _status: 'ok',
        info: 'Script executed',
        response
    })
}))

module.exports = app
