import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

// Path CONST
// we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..')
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json')

// Package.json
const pkg = JSON.parse(fs.readFileSync(PKG_FILE)) // import pkg from '~root/package.json'

// Exporting Swagger Config
export default function(config) {
    const swaggerDoc = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: `${pkg.productName} - Express API with Swagger`,
                version: pkg.version,
                description: 'This is a simple CRUD API application made with Express and documented with Swagger',
                license: {
                    name: pkg.license
                },
                contact: {
                    name: pkg.name,
                    url: pkg.repository.url
                }
            },
            servers: [
                {
                    url: 'http://{host}:{port}/{basePath}',
                    variables: {
                        host: {
                            enum: [
                                'localhost',
                                config.DEV_HOST_IP
                            ],
                            default: config.DEV_HOST_IP || 'localhost'
                        },
                        port: {
                            default: config.PORT
                        },
                        basePath: {
                            default: 'api/v1'
                        }
                    }
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: {
                bearerAuth: []
            }
        },
        apis: [
            './routes/index.js',
            './routes/help.js',
            './routes/authentication.js',
            './routes/scripts.js'
        ]
    }
    return swaggerDoc
}
