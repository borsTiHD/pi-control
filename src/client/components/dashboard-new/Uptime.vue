<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column mt-2">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiClockOutline }}
            </v-icon>
            Uptime
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading && !data">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else-if="data">
                <v-col cols="12">
                    {{ data }}
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-alert
                        text
                        prominent
                        type="error"
                        :icon="$icons.mdiCloudAlert"
                    >
                        {{ textNoData }}
                    </v-alert>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Uptime',
    data() {
        return {
            loading: false,
            socketRoom: 'uptime',
            textNoData: 'No data could be determined.'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getAutoRefresh: 'settings/getAutoRefresh'
        }),
        data() {
            if (this.getUptimeData) return this.getUptimeData
            return false
        }
    },
    created() {
        // Set loading
        this.loading = true
    },
    activated() {
        // Socket.IO: Joining room - only if autoRefresh is on
        if (this.getAutoRefresh) { this.socketListening(true) }
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.socketListening(false)
    },
    sockets: {
        uptime(message) {
            if (message._status === 'error') {
                console.error('[Socket.io] -> Message from server \'uptime\':', message)
                // Set loading to 'false' after we get an error
                this.loading = false
                return false
            } else if (message._status === 'ok') {
                console.log('[Socket.io] -> Message from server \'uptime\':', message)
            } else {
                console.log('[Socket.io] -> Message from server \'uptime\', without usable data:', message)
            }

            // Set loading to 'false' after we get data
            this.loading = false
        }
    },
    methods: {
        socketListening(state) {
            if (state) {
                // Socket.IO: Joining room
                this.loading = true // Set loading to true after the app joins the room
                this.$socket.emit('room:join', this.socketRoom)
            } else {
                // Socket.IO: Leaving room
                this.$socket.emit('room:leave', this.socketRoom)
            }
        }
    }
}
</script>
