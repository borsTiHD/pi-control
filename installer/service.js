// const Service = require('node-linux').Service

const argv = process.argv.slice(2)
console.log(argv)

/*
// Create a new service object
const svc = new Service({
    name: 'Hello World',
    description: 'The nodejs.org example web server.',
    script: '/path/to/helloworld.js'
})

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
    svc.start()
})

svc.install()
*/
