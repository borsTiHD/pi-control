<template>
    <v-row justify="center">
        <v-col class="d-flex flex-column">
            <v-card id="terminal-card" v-resize="onResize" :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
                <v-card-title class="headline">
                    <v-icon
                        large
                        color="primary"
                        class="mr-2"
                    >
                        mdi-console
                    </v-icon>
                    Terminal
                </v-card-title>

                <v-card-text :style="`height: ${termHeight}px;`">
                    <vue-term ref="terminal" @typing="onTyping" />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import VueTerm from '@/components/terminal/VueTerm.vue'

import { mapGetters } from 'vuex'

export default {
    name: 'Terminal',
    components: {
        VueTerm
    },
    data() {
        return {
            interval: null,
            termHeight: 200,
            windowHeight: null,
            socketRoom: 'terminal'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
    },
    activated() {
        // Creates Interval for resizing
        this.interval = setInterval(() => {
            if (!this.windowHeight) { this.windowHeight = window.innerHeight } // If there is no saved window size yet, it will be set
            // If the saved window size is not equal to the current one -> resize
            if (this.windowHeight !== window.innerHeight) {
                // Resize Terminal
                this.onResize()
                setImmediate(() => {
                    this.$refs.terminal.fit()
                })
                // Saving current height for next check
                this.windowHeight = window.innerHeight
            }
        }, 10)
    },
    deactivated() {
        // Clears interval
        clearInterval(this.interval)
        this.interval = null
    },
    methods: {
        onResize() {
            // Resized div box from the terminal (container)
            // Calculates the height based on the window height minus the height of the remaining boxes (or the start position of the terminal on the y axis) and additional pixels subtracted for the footer
            const el = document.getElementById('terminal-card')
            this.termHeight = window.innerHeight - this.getOffset(el).top - 120
        },
        getOffset(el) {
            /**
             * getOffset() - Determines the X/Y position of an HTML element
             *             -> // https://stackoverflow.com/a/28222246
             * @param   {string}    el  -> HTML Element
             * @returns {object}        -> Returns X/Y Coordinates in 'px'
             */
            const rect = el.getBoundingClientRect()
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                height: rect.height,
                width: rect.width
            }
        },
        onTyping(data) {
            // Sends data from terminal to the stream
            // this.$ssh.stream.write(data)
            // TODO
        }
    }
}
</script>
