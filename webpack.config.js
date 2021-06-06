import path from 'path'
import { fileURLToPath } from 'url'
// import nodeExternals from 'webpack-node-externals'

// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { NODE_ENV = 'production' } = process.env

export default {
    entry: './src/api/app.js',
    mode: NODE_ENV,
    target: 'node',
    node: {
        global: false,
        __filename: false,
        __dirname: false
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'server'),
        filename: 'app.cjs'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
    // externalsPresets: { node: true } // in order to ignore built-in modules like path, fs, etc.
    // externals: [nodeExternals({ allowlist: ['lowdb'] })] // in order to ignore all modules in node_modules folder, except 'lowdb' (lowdb can only be used as esm)
}
