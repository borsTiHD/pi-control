<template>
    <v-app
        v-resize="onResize"
        :style="{ background: $vuetify.theme.themes[theme].background }"
    >
        <app-header />
        <app-sidebar />

        <v-main>
            <v-container id="container" fluid :style="`height: ${containerHeight}px;`">
                <app-alerts />
                <nuxt keep-alive />
            </v-container>
        </v-main>

        <app-footer id="footer" />
    </v-app>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Device from '@/models/Device'

import AppHeader from '~/components/layout/Header.vue'
import AppSidebar from '~/components/layout/Sidebar.vue'
import AppFooter from '~/components/layout/Footer.vue'
import AppAlerts from '~/components/alerts/Alerts'

// Import global mixin's
import titleMixin from '~/mixins/titleMixin.js'
import socketListening from '~/mixins/socketListening.js'
Vue.mixin(titleMixin)
Vue.mixin(socketListening)

export default {
    name: 'DefaultLayout',
    components: {
        AppHeader,
        AppSidebar,
        AppFooter,
        AppAlerts
    },
    data() {
        return {
            containerHeight: 0
        }
    },
    async fetch() {
        // TODO: Getting real device name from host system
        // For now, we'll invent a name, since only one device is currently in use anyway.
        const deviceName = 'raspberry-pi' // eg. await getHostName()
        const device = await Device.create({ data: { name: deviceName } })
        const deviceId = device.devices[0].id
        this.setCurrentDeviceId(deviceId)

        // console.log('deviceId:', deviceId)
        // console.log(this.getCurrentDeviceId)
    },
    computed: {
        ...mapGetters({
            getActiveSkin: 'settings/getActiveSkin',
            getDarkMode: 'settings/getDarkMode',
            getCurrentDeviceId: 'device/getCurrentDeviceId'
        }),
        theme() {
            return (this.$vuetify.theme.dark) ? 'dark' : 'light'
        }
    },
    async created() {
        // Clientside Init
        if (process.client) {
            // Getting 'darkmode' setting from persisted vuex-store
            this.$vuetify.theme.dark = this.getDarkMode // Set vuetify mode

            // Setting container height
            setImmediate(() => {
                this.$design.changeTheme(this.getActiveSkin) // Changing theme with plugin
                this.onResize()
            })
        }
    },
    methods: {
        ...mapActions({
            setCurrentDeviceId: 'device/setCurrentDeviceId'
        }),
        onResize() {
            // Setting container height for footer
            const container = document.getElementById('container')
            const footer = document.getElementById('footer')
            this.containerHeight = window.innerHeight - this.getOffset(container).top - this.getOffset(footer).height
        },
        getOffset(el) {
            /**
             * getOffset() - Ermittelt die X/Y Position eines HTML Elements
             *             -> // https://stackoverflow.com/a/28222246
             * @param   {string}    el  -> HTML Element
             * @returns {object}        -> Returns X/Y Koordinaten in 'px'
             */
            const rect = el.getBoundingClientRect()
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                height: rect.height,
                width: rect.width
            }
        }
    }
}
</script>

<style>
/*****************************************************\
No Scollbar on Page
\*****************************************************/
html {
    overflow-y: hidden !important;
}
#container {
    height: 100vh;
    overflow-y: auto;
}

/*****************************************************\
Scrollbar
\*****************************************************/
::-webkit-scrollbar {
    width: 12px;
}
::-webkit-scrollbar-corner {
    background-color: transparent;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.3);
}

/*****************************************************\
Unselectable Elements
\*****************************************************/
.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.selectable {
    -webkit-touch-callout: text !important;
    -webkit-user-select: text !important;
    -khtml-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}

/*****************************************************\
Backgrounds: Settings Colors from theme
\*****************************************************/
.v-app-bar {
    background-color: var(--v-systemBarBackground-base) !important;
}
.v-footer {
    background-color: var(--v-footerBackground-base) !important;
}
.v-navigation-drawer__content, .v-navigation-drawer__content .v-list {
    background-color: var(--v-sidebarBackground-base) !important;
}
.v-card, .v-list, .v-tabs-bar {
    background-color: var(--v-cardBackground-base) !important;
}
.v-data-table, .v-data-table .v-row-group__header {
    background-color: var(--v-cardBackground-base) !important;
}
</style>
