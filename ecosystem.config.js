const pkg = require('./package.json')
module.exports = {
    apps: [
        {
            name: pkg.name,
            exec_mode: 'cluster',
            instances: 1, // 'max' Or a number of instances
            script: './src/api/app.js', // './node_modules/nuxt/bin/nuxt.js',
            args: 'start'
        }
    ]
}
