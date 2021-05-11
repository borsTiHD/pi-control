import colors from 'vuetify/es5/util/colors'
import pkg from './package.json'

const isDev = process.env.NODE_ENV !== 'production'

// Server Settings
const server = {
    host: isDev ? 'localhost' : '0.0.0.0', // dev: localhost, production: os-ip-adress
    port: isDev ? 3000 : 8800, // dev: 3000, production: 8800
    timing: false
}

export default {
    // Adding server settings
    server: {
        ...server
    },

    // Nuxt target
    target: 'server',

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
        { mode: 'client', src: '@/plugins/indexeddb.js' }
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
        '@nuxtjs/axios'
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        browserBaseURL: '/api/v1'
    },

    /*
    publicRuntimeConfig: {
        axios: {
            browserBaseURL: process.env.BROWSER_BASE_URL
        }
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: process.env.BASE_URL
        }
    },
    */

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: true,
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
        }
    },

    // Serverside Middleware -> REST Api
    serverMiddleware: [
        { path: '/api/v1', handler: '~/server-middleware/rest-api.js' }
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {}
}
