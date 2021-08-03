<template>
    <v-card :elevation="getElevation" :outlined="getOutlined">
        <v-card-title class="headline">Test - Terminal Functions</v-card-title>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn
                        @click="getTerminals"
                    >
                        Get Terminals
                    </v-btn>
                    <v-btn
                        @click="createTerminal"
                    >
                        Create Terminal
                    </v-btn>
                </v-col>
                <v-col class="d-flex">
                    <v-btn
                        @click="closeTerminal"
                    >
                        Close Terminal
                    </v-btn>
                    <v-text-field
                        v-model="inputId"
                        class="ml-4"
                        label="terminal id to close"
                        hide-details="auto"
                        outlined
                        dense
                    />
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'TestTerminal',
    data() {
        return {
            inputId: ''
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
    },
    sockets: {
        terminal(message) {
            console.log('[Socket.io] -> Event \'terminal\' - message from server:', message)
        }
    },
    methods: {
        getTerminals() {
            this.$socket.emit('terminal', 'get-all')
        },
        createTerminal() {
            this.$socket.emit('new-terminal', true)
        },
        closeTerminal() {
            const inputId = this.inputId
            this.$socket.emit('close-terminal', inputId)
        }
    }
}
</script>
