// Imports
const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')
const express = require('express')

// Middleware for handling errors on promise calls
const asyncHandler = require('../server-middleware/asyncMiddleware')

// ChildProcess Spawn Import
const ChildProcessClass = require('../classes/ChildProcessClass')
const childProcessSpawn = new ChildProcessClass()

// Script Directory
const scriptPath = path.join('.', 'scripts')

// Windows/Linux checks
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'

// Tests if file is in 'custom' directory
// Only 'custom' scripts can be deleted
function isCustomScript(path) {
    // Validates folder structure
    // Returns true, if the custom path is in there
    return /^scripts\\custom\\/gm.test(path) /* win path */ || /^scripts\/custom\//gm.test(path) /* linux path */
}

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 * @url https://stackoverflow.com/a/51518100/7625095
 */
function zipDirectory(source, out) {
    // Checks OS for type
    let type = null
    if (isLinux || isWin) {
        type = 'zip'
    }

    const archive = archiver(type, { zlib: { level: 9 } })
    const stream = fs.createWriteStream(out)

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', (err) => reject(err))
            .pipe(stream)

        stream.on('close', () => resolve())
        archive.finalize()
    })
}

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

app.post('/scripts/execute', asyncHandler(async(req, res, next) => {
    const { query } = req
    const scriptRaw = query.script
    const args = query.args || []

    // Building 'script' path
    const script = path.join(scriptPath, scriptRaw.replace('scripts\\', '').replace('scripts/', ''))

    // Promise for spawning
    const spawn = () => {
        return new Promise((resolve, reject) => {
            // Spawn Script
            childProcessSpawn.execShell(script, args, (pid, output) => { }, (pid, output, exitCode) => {
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
        info: 'Script successfully executed',
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
    } else {
        res.json({
            _status: 'ok',
            info: 'Folder scannt',
            folder: { id, name, type, path, stats }
        })
    }
}))

app.get('/scripts/download', asyncHandler(async(req, res, next) => {
    // Query Data
    const query = req.query
    const name = query.name
    const filePath = query.path

    // Scans stats
    const stats = await fs.stat(filePath)

    // Not a folder?
    if (stats.isFile()) {
        // Reading file and return result
        res.download(filePath, name)
    } else {
        const fileName = 'backup.zip'
        const archiv = path.join(scriptPath, fileName)
        await zipDirectory(filePath, archiv)
        await res.download(archiv, fileName)

        // Scans stats
        const statsBackupFile = await fs.stat(archiv)
        if (statsBackupFile.isFile()) {
            await fs.unlink(archiv).catch((error) => {
                console.error(error)
                return next()
            })
        } else {
            console.log('[Download] -> tried to delete backup.zip, but nothing happened.')
        }
    }
}))

app.post('/scripts/add/file', asyncHandler(async(req, res, next) => {
    const data = req.body
    const script = data.script
    const file = `${script.name}.${script.ext}`
    const filePath = path.join(data.path, file)
    if (isCustomScript(filePath)) {
        await fs.outputFile(filePath, script.text).then(async() => {
            console.log('[Add Script] -> Changed executable permissions.')
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
    } else {
        console.error('[Add Script] -> Only in custom folder allowed.')
        // Return results
        res.status(500).json({
            _status: 'error',
            info: 'Couldn\'t write data, please try again',
            error: 'Only in custom folder allowed'
        })
    }
}))

app.post('/scripts/add/folder', asyncHandler(async(req, res, next) => {
    const data = req.body
    const folderName = data.name
    const folderPath = data.path
    const completePath = path.join(folderPath, folderName)
    if (isCustomScript(completePath)) {
        await fs.mkdir(completePath, { recursive: true }).catch((error) => {
            console.error(error)
            // Return results
            res.status(500).json({
                _status: 'error',
                info: 'Couldn\'t write folder, please try again',
                error
            })
            return next()
        })

        // Return results
        res.json({
            _status: 'ok',
            info: 'Folder added',
            request: req.body
        })
    } else {
        console.error('[Add Folder] -> Only in custom folder allowed.')
        // Return results
        res.status(500).json({
            _status: 'error',
            info: 'Couldn\'t write folder, please try again',
            error: 'Only in custom folder allowed'
        })
    }
}))

app.post('/scripts/delete', asyncHandler(async(req, res, next) => {
    // Query Data
    const query = req.query
    const filePath = query.path

    // Scans stats and delete only if it is a file
    const stats = await fs.stat(filePath)

    if (stats.isFile() && isCustomScript(filePath)) {
        await fs.unlink(filePath).catch((error) => {
            console.error(error)
            // Return results
            res.status(500).json({
                _status: 'error',
                info: 'Couldn\'t delete file, please try again',
                error
            })
            return next()
        })

        // Return results
        res.json({
            _status: 'ok',
            info: 'File deleted',
            request: query
        })
    } else if (stats.isDirectory() && (isCustomScript(filePath) || filePath === path.join(scriptPath, 'custom'))) {
        await fs.rmdir(filePath, { recursive: true }).catch((error) => {
            console.error(error)
            // Return results
            res.status(500).json({
                _status: 'error',
                info: 'Couldn\'t delete folder, please try again',
                error
            })
            return next()
        })

        // Return results
        res.json({
            _status: 'ok',
            info: 'Folder deleted',
            request: query
        })
    } else {
        // Return results
        const error = new Error('Couldn\'t delete. Request wasn\'t a file, or wasn\t a custom script.')
        res.status(500).json({
            _status: 'error',
            info: 'Something went wrong',
            error: error.message
        })
    }
}))

app.post('/scripts/edit/file', asyncHandler(async(req, res, next) => {
    // Query Data
    const query = req.query
    const oldFile = JSON.parse(query.oldFile)
    const newFile = JSON.parse(query.newFile)

    // Scans stats and edits only if it is a file
    const stats = await fs.stat(oldFile.path)
    if (stats.isFile() && isCustomScript(oldFile.path)) {
        const oldFileNameRegexp = new RegExp(`${oldFile.name}$`, 'gm') // Matches old filename (only the end of the path)
        const newPath = oldFile.path.replace(oldFileNameRegexp, newFile.name)

        // Renames file, if old and new names are different
        if (oldFile.name !== newFile.name) {
            await fs.rename(oldFile.path, newPath).catch((error) => {
                console.error(error)
                // Return results
                res.status(500).json({
                    _status: 'error',
                    info: 'Couldn\'t rename file, please try again',
                    error
                })
                return next()
            })
        }

        // Overwrite file with new content
        await fs.outputFile(newPath, newFile.content).then(async() => {
            console.log('[Edit Script] -> Changed executable permissions.')
            fs.chmod(newPath, '755')
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
            info: 'File edited successfully',
            request: query
        })
    } else {
        // Return results
        const error = new Error('Couldn\'t edit script. Request wasn\'t a file, or wasn\t an custom script.')
        res.status(500).json({
            _status: 'error',
            info: 'Something went wrong',
            error: error.message
        })
        return next()
    }
}))

app.post('/scripts/edit/folder', asyncHandler(async(req, res, next) => {
    // Query Data
    const query = req.query
    const oldFolder = JSON.parse(query.oldFolder)
    const newFolder = JSON.parse(query.newFolder)

    // Scans stats and edits only if it is a folder
    const stats = await fs.stat(oldFolder.path)
    if (stats.isDirectory() && isCustomScript(oldFolder.path)) {
        const oldFolderNameRegexp = new RegExp(`${oldFolder.name}$`, 'gm') // Matches old filename (only the end of the path)
        const newPath = oldFolder.path.replace(oldFolderNameRegexp, newFolder.name)

        // Renames folder, if old and new names are different
        if (oldFolder.name !== newFolder.name) {
            await fs.rename(oldFolder.path, newPath).catch((error) => {
                console.error(error)
                // Return results
                res.status(500).json({
                    _status: 'error',
                    info: 'Couldn\'t rename folder, please try again',
                    error
                })
                return next()
            })
        }

        // Return results
        res.json({
            _status: 'ok',
            info: 'Folder edited successfully',
            request: query
        })
    } else {
        // Return results
        const error = new Error('Couldn\'t edit folder. Request wasn\'t a folder, or wasn\t in custom script path.')
        res.status(500).json({
            _status: 'error',
            info: 'Something went wrong',
            error: error.message
        })
    }
}))

module.exports = app
