<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiMemory }}
            </v-icon>
            Memory

            <v-badge
                v-if="testData"
                color="warning"
                content="TEST DATA"
                inline
            />
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
                    <span>Used: <span class="font-weight-bold">{{ data.used }}MB ({{ memoryUsedPercentage(data) }}%)</span></span>
                    <span>Available: <span class="font-weight-bold">{{ data.available }}MB</span></span>
                    <span>Total: <span class="font-weight-bold">{{ data.total }}MB</span></span>
                </v-col>
                <v-col cols="12">
                    <v-progress-linear
                        :value="memoryUsedPercentage(data)"
                        :color="color(memoryUsedPercentage(data))"
                        height="25"
                    >
                        <strong>{{ memoryUsedPercentage(data) }}%</strong>
                    </v-progress-linear>
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
    name: 'Memory',
    data() {
        return {
            loading: false,
            testData: false,
            socketRoom: 'memory',
            textNoData: 'No data could be determined.',
            memoryData: null,
            limits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: 'primary' },
                mid: { value: 50, color: 'yellow' },
                high: { value: 60, color: 'orange' },
                max: { value: 80, color: 'red' }
            }
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        data() {
            if (this.memoryData) return this.memoryData
            return false
            /*
            const temperature = Temperature.query()
                .orderBy('timestamp', 'asc')
                .last()
            return temperature?.temperature || false
            */
        }
    },
    activated() {
        // Socket.IO: Joining room
        this.loading = true // Set loading to true after the app joins the room
        this.socketListening(true, this.socketRoom)
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.socketListening(false, this.socketRoom)
    },
    sockets: {
        memory(message) {
            if (message._status === 'error') {
                console.error(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                // Set loading to 'false' after we get an error
                this.loading = false
                return false
            } else if (message._status === 'ok') {
                // Saving socket data
                // console.log(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                const data = message?.data?.data

                // TEST DATA - are not real
                if (message?.data?.TEST_DATA) {
                    this.testData = true
                }

                this.memoryData = data.memory
                // TODO
                // Inserting data into database
                /*
                Temperature.insert({
                    data: {
                        temperature: data,
                        timestamp: moment().unix()
                    }
                })
                */
            } else {
                console.log(`[Socket.io] -> Message from server '${this.socketRoom}', without usable data:`, message)
            }

            // Set loading to 'false' after we get data
            this.loading = false
        }
    },
    methods: {
        memoryUsedPercentage(memory) {
            const percentage = (memory.used / memory.total) * 100 // returns current load percentage
            return Math.round(percentage * 100) / 100 // Rounds last 2 digits
        },
        color(val) {
            // Coloring of equal or greater values (from max to low)
            const limit = this.limits
            if (val >= limit.max.value) {
                return limit.max.color
            } else if (val >= limit.high.value) {
                return limit.high.color
            } else if (val >= limit.mid.value) {
                return limit.mid.color
            } else if (val >= limit.low.value) {
                return limit.low.color
            }
            return 'secondary' // not possible
        }
    }
}
</script>
