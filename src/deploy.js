import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import archiver from 'archiver'

// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PROJECT_ROOT = path.join(__dirname, '..')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')
const BUILD_DIR = path.join(PROJECT_ROOT, 'build')
const BUILD_FILE = path.join(BUILD_DIR, 'release.zip')

async function zipDirectory(source, out) {
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

async function build() {
    console.log('-'.repeat(10))
    console.log('STARTING')
    console.log('-'.repeat(10))

    await zipDirectory(DIST_DIR, BUILD_FILE)

    console.log('-'.repeat(10))
    console.log('FINISHED')
    console.log('-'.repeat(10))
}

build()
