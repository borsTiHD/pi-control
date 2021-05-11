// Imports
const path = require('path')
const bodyParser = require('body-parser')
const app = require('express')()

// Middleware for handling errors on promise calls
const asyncHandler = require('../server-middleware/asyncMiddleware')

// ChildProcess Spawn Import
const ChildProcessClass = require('../classes/ChildProcessClass')
const childProcessSpawn = new ChildProcessClass()

// ProjectRoot Directory
const root = path.join(__dirname, '..')

app.use(bodyParser.json())

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
                console.log('[API] -> Script finished. Output: ', output)
                resolve(output)
            })
        })
    }

    // Spawn script
    const output = await spawn()

    // REST return
    res.json({
        _status: 'ok',
        info: 'Script executed',
        output
    })
}))

module.exports = app
