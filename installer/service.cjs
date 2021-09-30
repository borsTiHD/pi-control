const path = require('path')
const Service = require('node-linux').Service
const pkg = require('../package.json')

// Getting Argvs
const argv = process.argv.slice(2)

// Paths
const PROJECT_ROOT = process.cwd()
const APP_DIR = path.join(PROJECT_ROOT, 'dist', 'server')
const APP_FILE = path.join(APP_DIR, 'app.cjs')

// Create a new service object
const svc = new Service({
    name: pkg.name,
    description: pkg.description,
    script: APP_FILE
})

// Installing, deinstalling, or starting service
if (argv[0] === '--install') {
    // Installing service

    // Listen for the "install" event, which indicates the
    // process is available as a service
    svc.on('install', function() {
        console.log('This service is installed.')
        // svc.start()
    })

    // Just in case this file is run twice.
    svc.on('alreadyinstalled', function() {
        console.log('This service is already installed.')
    })

    // Installing service
    svc.install()
} else if (argv[0] === '--deinstall') {
    // Deinstalling service

    // Listen for the "uninstall" event so we know when it's done
    svc.on('uninstall', function() {
        console.log('Uninstall complete.')
        console.log('The service exists: ', svc.exists())
    })

    // Listen on error event
    svc.on('error', function(err) {
        console.log('ERROR:', err)
    })

    // Uninstall the service
    svc.uninstall()
} else if (argv[0] === '--start') {
    // Starting service

    // Listen for the "start" event and let us know when the
    // process has actually started working
    svc.on('start', function() {
        console.log(svc.name + ' service started!')
    })

    svc.start()
}
