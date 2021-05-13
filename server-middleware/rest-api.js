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
app.use(express.urlencoded({ extended: true })) // for form data

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
    const scriptRaw = query.script
    const args = query.args || []

    // Removes 'scripts' folders from path
    const script = scriptRaw.replace('scripts\\', '')

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
        return next(error)
    })

    // REST return
    res.json({
        _status: 'ok',
        info: 'Script executed',
        response
    })
}))

app.get('/scripts/list', asyncHandler(async(req, res, next) => {
    // Generates unique random IDs for every folder/file
    const uniqueIds = []
    let maxIds = 100
    function generateId(max) {
        let r = Math.floor(Math.random() * max) + 1
        if (!uniqueIds.includes(r)) {
            uniqueIds.push(r)
        } else {
            r = generateId(max)
        }
        return r
    }

    // Reads all scripts in 'root/scripts/' with subfolders
    // Returns array with all existing files
    async function getFiles(dir) {
        maxIds += 1 // Increase unique IDs limit
        const stats = await fs.stat(dir)
        const fileList = {
            path: dir,
            name: path.basename(dir),
            id: generateId(maxIds)
        }

        if (stats.isDirectory()) {
            fileList.type = 'folder'
            const files = await fs.readdir(path.join(dir))
            maxIds += files.length // Increase unique IDs limit
            fileList.children = await Promise.all(files.map(async(child) => {
                const res = getFiles(path.join(dir, child))
                return res
            }))
        } else {
            // Assuming it's a file. In real life it could be a symlink or something else!
            fileList.type = 'file'
        }

        return fileList
    }

    // Scanning folder
    const scripts = await getFiles(scriptPath)

    // Return results
    res.json({
        _status: 'ok',
        info: 'Files scannt',
        scripts
    })
}))

app.get('/scripts/read', asyncHandler(async(req, res, next) => {
    // Query Data
    const query = req.query
    const { id, name, type, path } = query

    // Scans stats
    const stats = await fs.stat(path)

    // Not a folder?
    if (!stats.isDirectory()) {
        // Reading file and return result
        const content = await fs.readFile(path, 'utf-8')
        res.json({
            _status: 'ok',
            info: 'File scannt',
            script: { id, name, type, path, stats, content }
        })
        return
    }

    // REST return
    res.json({
        _status: 'info',
        info: 'File was a folder',
        folder: {
            stats
        }
    })
}))

app.post('/scripts/add', asyncHandler(async(req, res, next) => {
    const data = req.body
    const file = `${data.name}.${data.ext}`
    const filePath = path.join(scriptPath, 'custom', file)
    const content = data.text
    await fs.outputFile(filePath, content).then(async() => {
        console.log('Changed executable permissions.')
        fs.chmod(filePath, '755')
    }).catch((error) => {
        console.error(error)
        // Return results
        res.status(500).json({
            _status: 'error',
            info: 'Couldn\'t write data, please try again',
            error
        })
        return next()
    })

    // Return results
    res.json({
        _status: 'ok',
        info: 'File added',
        request: req.body
    })
}))

module.exports = app
