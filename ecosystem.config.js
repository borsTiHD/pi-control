import pkg from './package.json'
export default {
    apps: [
        {
            name: pkg.name,
            exec_mode: 'cluster',
            instances: 1, // 'max' Or a number of instances
            script: './src/api/app.cjs', // './node_modules/nuxt/bin/nuxt.js',
            args: 'start'
        }
    ]
}
