import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import archiver from 'archiver'
import webpack from 'webpack'
import NuxtApp from 'nuxt'
import minimist from 'minimist'
import webpackConfig from './../webpack.config.js'
import nuxtConfig from './client/nuxt.config.js'
import colors from './color.js'

// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Path CONST
const PROJECT_ROOT = path.join(__dirname, '..')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')
const NUXT_DIR = path.join(PROJECT_ROOT, 'src', 'client')
const BUILD_DIR = path.join(PROJECT_ROOT, 'build')
const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts', 'server')
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json')

// Package.json
const pkg = JSON.parse(fs.readFileSync(PKG_FILE)) // import pkg from '../../package.json'

// Arguments
const argv = minimist(process.argv.slice(2))

// Changing Nuxt Config
// nuxtConfig.srcDir = NUXT_DIR
nuxtConfig.rootDir = NUXT_DIR
nuxtConfig.generate.dir = path.join(DIST_DIR, 'client')

// Nuxt App
const { Nuxt, Builder, Generator } = NuxtApp
const nuxt = new Nuxt(nuxtConfig)

// Starting
init()

// Controlls building
async function init() {
    logState('(ℹ) BUILDING CLIENT')
    await buildNuxt()

    logState('(ℹ) BUILDING BACKEND')
    await buildWebpack()

    logState('(ℹ) ARCHIVING APP')
    await archiveProject()

    logState('(ℹ) UPLOAD HELPER')
    await uploadHelper()

    logState('(ℹ) FINISHED BUILDING APP')
    return true
}

// Building Client Nuxt App
async function buildNuxt() {
    // Getting Nuxt ready
    await nuxt.ready()

    // https://github.com/nuxt/nuxt.js/blob/dev/packages/builder/src/builder.js
    const builder = new Builder(nuxt)

    // https://github.com/nuxt/nuxt.js/blob/dev/packages/generator/src/generator.js
    const generator = new Generator(nuxt, builder)

    // Generating Nuxt App
    await generator.generate({ build: true, init: true }).then(({ errors }) => {
        if (errors.length === 0) return true
        else throw new Error('Error occurred while generating pages')
    }).catch((err) => {
        console.error(err)
        return Error(err.message)
    })
    console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) CLIENT FINISHED')
}

// Building Backend with Webpack
async function buildWebpack() {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig)
        compiler.run((err, stats) => { // [Stats Object](#stats-object)
            if (err) { console.error(err) }

            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true // Shows colors in the console
            }))

            compiler.close((closeErr) => {
                if (closeErr) {
                    console.error(closeErr)
                    reject(closeErr)
                }
                console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) BACKEND FINISHED')
                resolve()
            })
        })
    })
}

// Archives our files
async function archiveProject() {
    // Creates directory, if not exists
    await fs.mkdir(BUILD_DIR, { recursive: true })

    const type = 'tar' // Type for packaged file
    const archive = archiver(type, { gzip: true })
    const file = path.join(BUILD_DIR, `${pkg.name}-v${pkg.version}.tar.gz`)
    const stream = fs.createWriteStream(file)

    return new Promise((resolve, reject) => {
        // Adding files & folders
        archive
            .directory(DIST_DIR, 'dist') // Compiled app
            .directory(SCRIPTS_DIR, path.join('scripts', 'server')) // Server scripts
            .append(fs.createReadStream(PKG_FILE), { name: 'package.json' }) // Package.json
            .append(fs.createReadStream(path.join(PROJECT_ROOT, 'ecosystem.json')), { name: 'ecosystem.json' }) // pm2 script
            .append(fs.createReadStream(path.join(PROJECT_ROOT, 'README.md')), { name: 'README.md' }) // Readme

        // Archive events
        archive.on('error', (err) => reject(err))
        archive.pipe(stream)
        stream.on('close', () => {
            console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) FILES PACKED')
            resolve()
        })
        archive.finalize()
    })
}

// Uploading to GitHub
async function uploadHelper() {
    if ('upload' in argv && argv.upload === 'false') {
        // If no upload has been specified, don't attempt to upload
        console.log(`${colors.FgRed}%s${colors.Reset}`, '(⚠) UPLOADING WAS TURNED OFF')
        return true
    } else if ('upload' in argv && argv.upload === 'true') {
        // If no upload has been specified, don't attempt to upload
        console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) UPLOADING BUILD')
        return true
    }
}

// Logging current state to console
function logState(string) {
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    console.log(`${colors.FgCyan}%s${colors.Reset}`, string)
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
}
