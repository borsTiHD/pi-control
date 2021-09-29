import path from 'path'
// import nodeExternals from 'webpack-node-externals'

// Path CONST
const PROJECT_ROOT = process.cwd()

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
        path: path.resolve(PROJECT_ROOT, 'dist', 'server'),
        filename: 'app.cjs'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    externals: {
        'node-pty': 'commonjs2 node-pty'
    }
    // externalsPresets: { node: true } // in order to ignore built-in modules like path, fs, etc.
    // externals: [nodeExternals({ allowlist: ['lowdb'] })] // in order to ignore all modules in node_modules folder, except 'lowdb' (lowdb can only be used as esm)
}
