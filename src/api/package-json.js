import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

// Path CONST
// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..', '..')
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json')

// Package.json
const pkg = JSON.parse(fs.readFileSync(PKG_FILE)) // import pkg from '~root/package.json'

export default pkg
