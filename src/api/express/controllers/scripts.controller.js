// Imports
import path from 'path'
import fs from 'fs-extra'

// Middleware
import asyncHandler from '../middleware/asyncHandler.js' // Middleware for handling errors on promise calls
import isCustomScript from '../middleware/isCustomScript.js' // Testing if given 'path' is a 'custom path'
import zipDirectory from '../middleware/zipDirectory.js' // Zipping file/folder middleware

// ChildProcess Spawn Import
import ChildProcessClass from '../classes/ChildProcessClass.js'
const childProcessSpawn = new ChildProcessClass()

// Script Directory
const scriptPath = path.join('.', 'scripts')

/**
 * Route serving index
 * @name index
 * @function
 * @memberof module:routers/scripts
 */
const index = (req, res) => {
    res.json({
        _status: 'ok',
        info: 'Endpoint is set up.'
    })
}

/**
 * Route serving list of files from host
 * @name list
 * @function
 * @memberof module:routers/scripts
 */
const list = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route executes scripts from host
 * @name execute
 * @function
 * @memberof module:routers/scripts
 * @param {string} script - Query for script path. Exp.: ?script=scripts%5Ccustom%5Ctest.bat
 * @param {array} args - Query for arguments. Exp.: ?args=['a', 'b', 'c']
 */
const execute = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route read a file from host
 * @name read
 * @function
 * @memberof module:routers/scripts
 * @param {string} path - Query for file path. Exp.: ?path=scripts%5Ccustom%5Ctest.bat
 * @param {string} id - Query for file id (just required for response). Exp.: ?id=77
 * @param {string} name - Query for file name (just required for response). Exp.: ?name=test.bat
 * @param {string} type - Query for file type (just required for response). Exp.: ?type=file
 */
const read = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route downloading a file from host
 * @name download
 * @function
 * @memberof module:routers/scripts
 * @param {string} path - Query for file path. Exp.: ?path=scripts%5Ccustom%5Ctest.bat
 * @param {string} name - Query for file name. Exp.: ?name=test.bat
 */
const download = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route adding a file on host
 * @name addFile
 * @function
 * @memberof module:routers/scripts
 * @param {object} data - Object -> form data. Delivers script data: '{ path: "scripts/custom/...", script: { name: "test", ext: "bat", text: "echo test" }}'
 */
const addFile = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route adding a folder on host
 * @name addFolder
 * @function
 * @memberof module:routers/scripts
 * @param {object} data - Object -> form data. Delivers folder data: '{ path: "scripts\custom", name: "test" }'
 */
const addFolder = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route deleting a file/folder from host
 * @name delete
 * @function
 * @memberof module:routers/scripts
 * @param {string} path - Query for file/folder path. Exp.: ?path=scripts\custom\test
 */
const deleteFileOrFolder = asyncHandler(async(req, res, next) => {
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
        await fs.rm(filePath, { recursive: true }).catch((error) => {
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
})

/**
 * Route edits or renames a file from host
 * @name editFile
 * @function
 * @memberof module:routers/scripts
 * @param {string} oldFile - Query for old file data. Exp.: ?oldFile: {"path":"scripts\\custom\\test.bat","name":"test.bat","id":71,"type":"file"}
 * @param {string} newFile - Query for new file data. Exp.: ?newFile: {"name":"new.bat","content":"echo test"}
 */
const editFile = asyncHandler(async(req, res, next) => {
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
})

/**
 * Route edits or renames a folder from host
 * @name editFolder
 * @function
 * @memberof module:routers/scripts
 * @param {string} oldFolder - Query for old file data. Exp.: ?oldFolder: {"path":"scripts\\custom\\test","name":"test"}
 * @param {string} newFolder - Query for new file data. Exp.: ?newFolder: {"name":"new"}
 */
const editFolder = asyncHandler(async(req, res, next) => {
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
})

export default {
    index,
    list,
    execute,
    read,
    download,
    addFile,
    addFolder,
    deleteFileOrFolder,
    editFile,
    editFolder
}
