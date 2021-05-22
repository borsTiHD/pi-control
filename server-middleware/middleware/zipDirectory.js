const fs = require('fs-extra')
const archiver = require('archiver')

/**
 * Middleware: Zipping a given file/folder
 * @param {String} source - file/folder path
 * @param {String} out - output file path
 * @returns {Promise}
 * @url https://stackoverflow.com/a/51518100/7625095
 */
const zipDirectory = (source, out) => {
    const type = 'zip' // Type for packaged file
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

module.exports = zipDirectory
