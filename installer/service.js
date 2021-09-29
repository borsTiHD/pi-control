const path = require('path')
// const Service = require('node-linux').Service
// const pkg = require('./package.json')

// Getting Argvs
const argv = process.argv.slice(2)

// Paths
const PROJECT_ROOT = process.cwd()
const APP_DIR = path.join(PROJECT_ROOT, 'dist', 'server')
const APP_FILE = path.join(APP_DIR, 'app.cjs')

// Installing, or deinstalling service
if (argv[0] === '--install') {
    console.log('INSTALLING')
    console.log('APP_FILE:', APP_FILE)

    /*
    // Create a new service object
    const svc = new Service({
        name: pkg.name,
        description: pkg.description,
        script: APP_FILE
    })

    // Listen for the "install" event, which indicates the
    // process is available as a service.
    svc.on('install', function() {
        svc.start()
    })

    svc.install()
    */
} else if (argv[0] === '--deinstall') {
    console.log('DEINSTALL')
}
