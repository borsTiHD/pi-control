import pkg from '../package-json.js'

// Exporting Swagger Config
export default function(config) {
    const apis = [
        './express/routes/index.js',
        './express/routes/help.js',
        './express/routes/authentication.js',
        './express/routes/scripts.js'
    ]
    const swaggerDefinition = {
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
        }
    }
    return {
        // Import swaggerDefinitions
        ...swaggerDefinition,
        // Path to the API docs
        // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
        apis
    }
}
