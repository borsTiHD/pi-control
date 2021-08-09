// import colors from 'vuetify/es5/util/colors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import dotenv from 'dotenv'
import DEFAULT from '../config.js'

// Loading '.env'
dotenv.config()

// Development
const isDev = process.env.NODE_ENV !== 'production'

// Dev config
const DEV_PORT_FRONTEND = process.env.DEV_PORT_FRONTEND || DEFAULT.DEV_PORT_FRONTEND // Default Port: 3000
const DEV_PORT_BACKEND = process.env.DEV_PORT_BACKEND || DEFAULT.DEV_PORT_BACKEND // Default Port: 3001
const TEST_DATA = !!process.env.TEST_DATA

// Application config
const HOST_IP = process.env.DEV_HOST_IP || DEFAULT.DEV_HOST_IP
const PORT_PRODUCTION = process.env.PORT_PRODUCTION || DEFAULT.PORT_PRODUCTION
const PORT_FRONTEND = isDev ? DEV_PORT_FRONTEND : PORT_PRODUCTION // dev or production
const PORT_BACKEND = isDev ? DEV_PORT_BACKEND : PORT_PRODUCTION // dev or production

// Path CONST
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..', '..')
const SRC_DIR = path.join(PROJECT_ROOT, 'src')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')
const PKG_FILE = path.join(PROJECT_ROOT, 'package.json')

// Package.json
const pkg = JSON.parse(fs.readFileSync(PKG_FILE)) // import pkg from '../../package.json'

// Webpage title, also used in global "titleMixin"
const headTitle = isDev ? `${pkg.productName.replace(' 🐱‍👤', '')} - DEV` : pkg.productName.replace(' 🐱‍👤', '')

// Alias
const alias = {
    alias: {
        projRoot: PROJECT_ROOT,
        srcDir: SRC_DIR
    }
}

// Server Settings
const server = {
    server: {
        host: '0.0.0.0', // os-ip-adress
        port: PORT_FRONTEND,
        timing: false
    }
}

// Enviroment variables
const env = {
    env: {
        dev: isDev
    },
    publicRuntimeConfig: {
        dev: isDev,
        PORT_BACKEND,
        PORT_FRONTEND,
        HOST_IP,
        TEST_DATA
    },
    privateRuntimeConfig: {
        dev: isDev,
        PORT_BACKEND,
        PORT_FRONTEND,
        HOST_IP,
        TEST_DATA
    }
}

export default {
    // Adding server settings
    ...server,

    // Adding env variables
    ...env,

    // Adding path alias
    ...alias,

    // Nuxt target -> Client Side Rendering (SPA)
    target: 'static',
    ssr: false,

    // Root folder
    srcDir: '',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s',
        title: headTitle,
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '@/plugins/vuex-orm.js' },
        { mode: 'client', src: '@/plugins/vuetify-font.js' },
        { mode: 'client', src: '@/plugins/vuetify-icons.js' },
        { mode: 'client', src: '@/plugins/persistedState.client.js' },
        { mode: 'client', src: '@/plugins/run-script.js' },
        { mode: 'client', src: '@/plugins/change-theme.js' },
        { mode: 'client', src: '@/plugins/pwa.client.js' },
        { mode: 'client', src: '@/plugins/pwa-update.client.js' },
        { mode: 'client', src: '@/plugins/chart.js' }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // Nuxt faster Buildtime: https://github.com/harlan-zw/nuxt-build-optimisations
        'nuxt-build-optimisations',

        // https://composition-api.nuxtjs.org/
        '@nuxtjs/composition-api/module',
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
        // https://pwa.nuxtjs.org/
        '@nuxtjs/pwa'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        // https://auth.nuxtjs.org/
        // '@nuxtjs/auth',
        '@nuxtjs/auth-next',
        // https://github.com/Maronato/vue-toastification
        ['vue-toastification/nuxt', {
            position: 'bottom-right',
            timeout: 3000,
            draggable: false,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            showCloseButtonOnHover: false,
            closeButton: 'button',
            icon: true
        }]
    ],

    // Global Middleware
    router: {
        middleware: ['auth'] // Pages accessible after login. If one page should be accessible without login, set 'auth: false' in page
    },

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: isDev ? `http://${HOST_IP}:${PORT_BACKEND}/api/v1` : '/api/v1'
    },

    // Nuxt authentication modul: https://auth.nuxtjs.org/
    auth: {
        localStorage: true,
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/auth/login',
                        method: 'post',
                        propertyName: 'token'
                    },
                    logout: false,
                    user: {
                        url: '/auth/user',
                        method: 'get',
                        propertyName: false
                    }
                }
            }
        },
        redirect: {
            login: '/user/login',
            logout: '/',
            callback: '/user/login',
            home: '/'
        },
        plugins: ['@/plugins/socket.client.js']
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        defaultAssets: false,
        icons: {
            iconfont: 'mdiSvg'
        },
        theme: {
            themes: {
                light: {},
                dark: {}
            },
            options: { customProperties: true }
        }
    },

    // PWA config - https://pwa.nuxtjs.org/setup
    pwa: {
        icon: {
            /* icon options */
        },
        meta: {
            /* meta options */
        },
        manifest: {
            /* manifest options */
        },
        workbox: {
            /* workbox options */
        }
    },

    // Generate Configuration: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-generate
    generate: {
        dir: path.join(DIST_DIR, 'client')
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        /*
        // Nuxt: Experimental features for speed up build time
        parallel: true, // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#parallel
        hardSource: true, // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#hardsource
        cache: true // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#cache
        */
    },

    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-telemetry
    telemetry: false
}
