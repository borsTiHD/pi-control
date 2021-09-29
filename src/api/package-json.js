import path from 'path'
import fs from 'fs-extra'

// Path CONST
const PROJECT_ROOT = process.cwd()
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json')

// Package.json
const pkg = JSON.parse(fs.readFileSync(PKG_FILE)) // import pkg from '~root/package.json'

export default pkg
