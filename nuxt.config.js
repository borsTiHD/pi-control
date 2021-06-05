// import colors from 'vuetify/es5/util/colors'
import pkg from './package.json'

// Development
const isDev = process.env.NODE_ENV !== 'production'

// Server Settings
const server = {
    server: {
        host: '0.0.0.0', // os-ip-adress
        port: isDev ? 3000 : 8800, // dev: 3000, production: 8800
        timing: false
    }
}

// Enviroment variables
const env = {
    env: {
        dev: process.env.NODE_ENV !== 'production'
    }
}

export default {
    // Adding server settings
    ...server,

    // Adding env variables
    ...env,

    // Nuxt target -> Client Side Rendering (SPA)
    target: 'static',
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s',
        title: pkg.productName,
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { mode: 'client', src: '@/plugins/indexeddb.js' },
        { mode: 'client', src: '@/plugins/run-script.js' }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
    // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
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
        baseURL: isDev ? 'http://localhost:8800/api/v1' : '/api/v1'
        // browserBaseURL: '/api/v1'
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
        }
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: true
            /*
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
            */
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {}
}
