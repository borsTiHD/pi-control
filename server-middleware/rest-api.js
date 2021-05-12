// Imports
const path = require('path')
const fs = require('fs-extra')
const express = require('express')

// Middleware for handling errors on promise calls
const asyncHandler = require('../server-middleware/asyncMiddleware')

// ChildProcess Spawn Import
const ChildProcessClass = require('../classes/ChildProcessClass')
const childProcessSpawn = new ChildProcessClass()

// ProjectRoot Directory
const scriptPath = path.join('.', 'scripts')

// Express Init
const app = express()
app.use(express.json())

app.all('/', (req, res) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
})

app.get('/help', (req, res) => {
    console.log('[API] -> PLEASE HELP ME!')
    res.json({
        _status: 'ok',
        info: 'You are searching for help?'
    })
})

app.post('/execute', asyncHandler(async(req, res, next) => {
    const { query } = req
    const script = query.script
    const args = query.args || []

    // Promise for spawning
    const spawn = () => {
        return new Promise((resolve, reject) => {
            // Spawn Script
            childProcessSpawn.execShell(path.join(scriptPath, script), args, (pid, output) => { }, (pid, output, exitCode) => {
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

app.get('/scripts/list', asyncHandler(async(req, res, next) => {
    // Reads all scripts in 'root/scripts/' with subfolders
    // Returns array with all existing files
    async function getFiles(dir, fileList = []) {
        const files = await fs.readdir(path.join(dir))
        for (const file of files) {
            const stat = await fs.stat(path.join(dir, file))
            if (stat.isDirectory()) {
                fileList = await getFiles(path.join(dir, file), fileList)
            } else fileList.push(path.join(dir, file))
        }
        return fileList
    }

    const scripts = await getFiles(scriptPath)

    // Return
    res.json({
        _status: 'ok',
        info: 'Files scannt',
        scripts
    })
}))

module.exports = app
