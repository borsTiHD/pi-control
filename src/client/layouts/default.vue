<template>
    <v-app v-resize="onResize" dark>
        <app-header />
        <app-sidebar />
        <app-settingsbar />

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
import { mapGetters } from 'vuex'

import AppHeader from '~/components/layout/Header.vue'
import AppSidebar from '~/components/layout/Sidebar.vue'
import AppSettingsbar from '~/components/layout/Settingsbar.vue'
import AppFooter from '~/components/layout/Footer.vue'
import AppAlerts from '~/components/alerts/Alerts'

export default {
    components: {
        AppHeader,
        AppSidebar,
        AppSettingsbar,
        AppFooter,
        AppAlerts
    },
    data() {
        return {
            containerHeight: 0
        }
    },
    computed: {
        ...mapGetters({
            getActiveSkin: 'settings/getActiveSkin',
            getDarkMode: 'settings/getDarkMode'
        })
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
</style>
