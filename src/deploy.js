import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import archiver from 'archiver'
import webpack from 'webpack'
import NuxtApp from 'nuxt'
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
const BUILD_FILE = path.join(BUILD_DIR, 'release.zip')

// Changing Nuxt Config
// nuxtConfig.srcDir = NUXT_DIR
nuxtConfig.rootDir = NUXT_DIR
nuxtConfig.generate.dir = path.join(DIST_DIR, 'client')

// Nuxt App
const { Nuxt, Builder, Generator } = NuxtApp
const nuxt = new Nuxt(nuxtConfig)

// Starting
init()

// Controlls our process
async function init() {
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    console.log(`${colors.FgCyan}%s${colors.Reset}`, 'ℹ - BUILDING CLIENT')
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    await buildNuxt()

    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    console.log(`${colors.FgCyan}%s${colors.Reset}`, 'ℹ - BUILDING BACKEND')
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    await buildWebpack()

    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    console.log(`${colors.FgCyan}%s${colors.Reset}`, 'ℹ - ARCHIVING APP')
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    await zipDirectory(DIST_DIR, BUILD_FILE)

    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    console.log(`${colors.FgCyan}%s${colors.Reset}`, 'ℹ - FINISHED BUILDING APP')
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
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
}

// Building Backend with Webpack
async function buildWebpack() {
    /*
    const compiler = webpack(webpackConfig)
    compiler.run((err, stats) => { // [Stats Object](#stats-object)
        // ...

        compiler.close((closeErr) => {
            // ...
        })
    })
    */

    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => { // [Stats Object](#stats-object)
            if (err || stats.hasErrors()) {
                // [Handle errors here](#error-handling)
                reject(new Error('Webpack Build went wrong!'))
            }
            // Done processing
            resolve()
        })
    })
}

// Archives our files
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
