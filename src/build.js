import path from 'path'
import fs from 'fs-extra'
import archiver from 'archiver'
import webpack from 'webpack'
import NuxtApp from 'nuxt'
import dotenv from 'dotenv'
import release from 'release-it'
import minimist from 'minimist'
import prompts from 'prompts'
import webpackConfig from '../webpack.config.js'
import releaseItConfig from '../.release-it-config.js'
import nuxtConfig from './client/nuxt.config.js'
import colors from './colors.js'

// Loading '.env' for 'GITHUB_TOKEN'
dotenv.config()

// Path CONST
const PROJECT_ROOT = process.cwd()
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')
const NUXT_DIR = path.join(PROJECT_ROOT, 'src', 'client')
const BUILD_DIR = path.join(PROJECT_ROOT, 'build')
const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts', 'server')
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json')

// Package.json
const pkg = JSON.parse(fs.readFileSync(PKG_FILE)) // import pkg from '../../package.json'

// Arguments
const argv = minimist(process.argv.slice(2))
const RELEASE_IT = argv.release === 'true' // Argument: 'release' set 'true'
const BUNDLE_ONLY = argv['only-bundle'] === 'true' // Argument: 'only-bundle' set 'true'

// Changing Nuxt Config
// nuxtConfig.srcDir = NUXT_DIR
nuxtConfig.rootDir = NUXT_DIR
nuxtConfig.generate.dir = path.join(DIST_DIR, 'client')

// Nuxt App
const { Nuxt, Builder, Generator } = NuxtApp
const nuxt = new Nuxt(nuxtConfig)

// Starting
if (BUNDLE_ONLY) {
    onlyBundle()
} else {
    init()
}

// Controlls building
async function init() {
    let loader = createLoader()
    try {
        // If we want to release our build,
        // ask the user if the changelog got edited,
        // if not, we script will stop and remind to do that
        if (RELEASE_IT) {
            clearInterval(loader)
            logState('(ℹ) YOU WANT TO RELEASE THE APP')
            const response = await prompts({
                type: 'text',
                name: 'answer',
                message: 'Did you remember to adjust the changelog? (y/n)'
                // validate: (value) => value < 18 ? 'Nightclub is 18+ only' : true
            })

            // If the answer wasn't 'y' or 'yes' the script will stop
            if (!/(yes|y)/gmi.test(response.answer)) {
                throw new Error('Question was not answered correclty. The user forgot to adjust the changelog.')
            }
            loader = createLoader()
        }

        logState('(ℹ) DELETING OLD FILES')
        await deleteOldFiles()

        clearInterval(loader)
        logState('(ℹ) BUILDING CLIENT')
        await buildNuxt()
        loader = createLoader()

        logState('(ℹ) BUILDING BACKEND')
        await buildWebpack()

        // If we want to release our build,
        // we dont want to archive in this step,
        // we want to bundle our app, after we bump our version with 'release-it'!
        if (!RELEASE_IT) {
            logState('(ℹ) ARCHIVING APP')
            await archiveProject()
        }

        clearInterval(loader)
        logState('(ℹ) RELEASE HELPER')
        await releaseHelper()

        clearInterval(loader)
        logState('(ℹ) FINISHED BUILDING APP - READY FOR RELEASING')
        return true
    } catch (error) {
        clearInterval(loader)
        console.error(`${colors.FgRed}%s${colors.Reset}`, `(❌) ${error.message}`)
        console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) ERROR IN BUILD PROCESS')
        console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) STOP EXECUTION OF CODE')
        return false
    }
}

// Only bundling 'DIST' folder
async function onlyBundle() {
    const loader = createLoader()
    try {
        logState('(ℹ) DELETING OLD FILES')
        await deleteOldFiles('BUILD')

        logState('(ℹ) ARCHIVING APP')
        await archiveProject()

        clearInterval(loader)
        logState('(ℹ) FINISHED BUNDLING APP')
        return true
    } catch (error) {
        clearInterval(loader)
        console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) ERROR IN BUILD PROCESS')
        console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) STOP EXECUTION OF CODE')
        return false
    }
}

// Deleting old files
async function deleteOldFiles(mode) {
    // Deletes old dist
    async function deleteDist() {
        return await fs.rm(DIST_DIR, { recursive: true }).catch((err) => {
            console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) COULDNT DELETE OLD DIST FOLDER')
            console.error(err)
        })
    }

    // Deletes old builds
    async function deleteBuilds() {
        return await fs.rm(BUILD_DIR, { recursive: true }).catch((err) => {
            console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) COULDNT DELETE OLD BUILD FOLDER')
            console.error(err)
        })
    }

    // Multiple delete modi
    switch (mode) {
        case 'DIST':
            console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) DELETING DIST FOLDER')
            await deleteDist()
            break

        case 'BUILD':
            console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) DELETING BUILD FOLDER')
            await deleteBuilds()
            break

        default:
            console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) DELETING BOTH FOLDERS')
            await deleteDist()
            await deleteBuilds()
            break
    }

    console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) OLD FILES DELETED')
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
        throw new Error(err.message)
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
    // Creates 'build' directory
    await fs.mkdir(BUILD_DIR, { recursive: true }).catch((err) => {
        console.error(`${colors.FgRed}%s${colors.Reset}`, '(❌) COULDNT CREATE BUILD FOLDER')
        console.error(err)
        throw new Error('Couldnt create build folder')
    })

    const type = 'tar' // Type for packaged file
    const archive = archiver(type, { gzip: true })
    const file = path.join(BUILD_DIR, `${pkg.name}-v${pkg.version}.tar.gz`)
    const stream = fs.createWriteStream(file)

    // Creating new package.json object for production
    const newPkg = JSON.parse(JSON.stringify(pkg))
    delete newPkg.scripts
    delete newPkg.dependencies
    delete newPkg.devDependencies
    newPkg.scripts = {
        start: 'node ./dist/server/app.cjs'
    }
    newPkg.dependencies = {
        'node-pty': pkg.dependencies['node-pty']
    }

    return new Promise((resolve, reject) => {
        // Adding files & folders
        archive
            // .directory(DIST_DIR, path.join(pkg.name, 'dist')) // Adding 'pkg.name,' on every file, will result in an subfolder with 'app-name' in the tar archive
            .directory(DIST_DIR, path.join('dist')) // Compiled app
            .directory(SCRIPTS_DIR, path.join('scripts', 'server')) // Server scripts
            // .append(fs.createReadStream(PKG_FILE), { name: path.join(pkg.name, 'package.json') }) // Original Package.json
            .append(JSON.stringify(newPkg), { name: path.join('package.json') }) // Modified Package.json
            .append(fs.createReadStream(path.join(PROJECT_ROOT, 'ecosystem.json')), { name: path.join('ecosystem.json') }) // pm2 script
            .append(fs.createReadStream(path.join(PROJECT_ROOT, 'README.md')), { name: path.join('README.md') }) // Readme
            .append(fs.createReadStream(path.join(PROJECT_ROOT, 'CHANGELOG.md')), { name: path.join('CHANGELOG.md') }) // Changelog

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

// Releasing to GitHub
async function releaseHelper() {
    if (RELEASE_IT) {
        // Releasing build
        console.log(`${colors.FgGreen}%s${colors.Reset}`, '(✔) RELEASING NEW VERSION')
        const options = releaseItConfig
        return release(options).then((output) => {
            console.log(output) // { version, latestVersion, name, changelog }
        })
        // console.log(`${colors.FgYellow}%s${colors.Reset}`, '(⚠) RELEASING NOT SUPPORTED RIGHT NOW - USE "yarn release" INSTEAD')
    }

    // If no release has been specified, don't attempt to upload
    console.log(`${colors.FgYellow}%s${colors.Reset}`, '(⚠) WITHOUT RELEASING')
    return true
}

// Creating loading animation
// https://stackoverflow.com/a/62111632/7625095
function createLoader() {
    const P = ['\\', '|', '/', '-']
    let x = 0
    return setInterval(() => {
        process.stdout.write(`\r${P[x++]}`)
        x %= P.length
    }, 100)
}

// Logging current state to console
function logState(string) {
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
    console.log(`${colors.FgCyan}%s${colors.Reset}`, string)
    console.log(`${colors.FgCyan}%s${colors.Reset}`, '-'.repeat(30))
}
