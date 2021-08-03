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

                    <app-button
                        name="New"
                        tooltip="Open new terminal"
                        btn-color="info"
                        btn-class="ml-6"
                        small
                        @click="createTerminal"
                    />

                    <app-button
                        name="Close All"
                        tooltip="Close all terminals"
                        btn-color="error"
                        btn-class="ml-3"
                        outlined
                        small
                        @click="closeAllTerminals"
                    />
                </v-card-title>

                <v-card-text v-if="tab.items.length <= 0">
                    <v-alert
                        text
                        dense
                        prominent
                        type="info"
                        icon="mdi-school"
                        class="mb-0"
                    >
                        Click 'New' to create a new terminal window.
                    </v-alert>
                </v-card-text>

                <div v-else>
                    <v-tabs
                        v-model="tab.current"
                        background-color="transparent"
                        color="basil"
                    >
                        <v-tab
                            v-for="item in tab.items"
                            :key="item.id"
                        >
                            Terminal: {{ item.id }}

                            <v-tooltip bottom>
                                <template #activator="{ on, attrs }">
                                    <v-btn
                                        class="ml-2"
                                        color="error"
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="closeTerminal(item.id)"
                                    >
                                        <v-icon>
                                            mdi-minus
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Close terminal</span>
                            </v-tooltip>
                        </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab.current">
                        <v-tab-item
                            v-for="item in tab.items"
                            :key="item.id"
                            :style="`height: ${termHeight}px; background-color: black;`"
                        >
                            <vue-term :ref="`terminal-${item.id}`" @typing="(data) => { onTyping(item.id, data) }" />
                        </v-tab-item>
                    </v-tabs-items>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import VueTerm from '@/components/terminal/VueTerm.vue'
import AppButton from '@/components/Button.vue'

import { mapGetters } from 'vuex'

export default {
    name: 'Terminal',
    components: {
        VueTerm,
        AppButton
    },
    data() {
        return {
            interval: null,
            resizeAllowed: false,
            termHeight: 200,
            windowHeight: null,
            tab: {
                current: null,
                items: []
            },
            socketRoom: 'terminal'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        getBuffer() {
            // TODO
            // this.$termClient.getBuffer()
            return ''
        },
        getCurrentTab() {
            // Gets current item from tabs
            return this.tab.items[this.tab.current]
        }
    },
    activated() {
        // Get open terminals
        this.getTerminals()

        // OnResize event is allowed
        this.resizeAllowed = true

        // Creates Interval for resizing
        this.interval = setInterval(() => {
            if (!this.windowHeight) { this.windowHeight = window.innerHeight } // If there is no saved window size yet, it will be set
            // If the saved window size is not equal to the current one -> resize
            if (this.windowHeight !== window.innerHeight) {
                // Resize Terminal
                this.onResize()
                setImmediate(() => {
                    const tab = this.getCurrentTab
                    const refId = `terminal-${tab.id}`
                    this.$refs[refId][0].fit()
                })
                // Saving current height for next check
                this.windowHeight = window.innerHeight
            }
        }, 10)

        // TODO
        // Checks if buffered data exists and writing them into the terminal
        /*
        if (this.getBuffer !== '') {
            const tab = this.getCurrentTab
            const refId = `terminal-${tab.id}`
            this.$refs[refId][0].write(this.getBuffer)
        }
        */
    },
    deactivated() {
        // OnResize event is not allowed anymore
        this.resizeAllowed = false

        // Clears interval
        clearInterval(this.interval)
        this.interval = null
    },
    sockets: {
        terminal(message) {
            // { _status: 'ok', id: terminalId, data }
            // Incoming data event from a terminal
            if (message._status === 'ok') {
                const data = message.data
                const terminalID = message.id
                const refId = `terminal-${terminalID}`
                this.$refs[refId][0].write(data)
            }
        },
        getAllTerminals(message) {
            // Saving terminal Id's
            if (message?.terminals) {
                this.tab.items = message.terminals
            }
        }
    },
    methods: {
        onResize() {
            if (this.resizeAllowed) {
                // Resized div box from the terminal (container)
                // Calculates the height based on the window height minus the height of the remaining boxes (or the start position of the terminal on the y axis) and additional pixels subtracted for the footer
                const el = document.getElementById('terminal-card')
                const footer = document.getElementById('footer')
                this.termHeight = window.innerHeight - this.getOffset(el).top - this.getOffset(footer).height - 130
            }
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
        onTyping(terminalID, data) {
            // Sending data to the host
            this.$socket.emit('send-to-terminal', { id: terminalID, data })
        },
        getTerminals() {
            // Get all open terminals
            // Send request to socket.io server
            this.$socket.emit('get-all-terminals', true)
        },
        createTerminal() {
            // Create new terminal
            // Send request to socket.io server
            this.$socket.emit('new-terminal', true)
        },
        closeTerminal(id) {
            // Close terminal with id
            // Send request to socket.io server
            this.$socket.emit('close-terminal', id)
        },
        closeAllTerminals() {
            // Close terminal with id
            // Send request to socket.io server
            this.$socket.emit('close-all-terminals', true)
        }
    }
}
</script>
