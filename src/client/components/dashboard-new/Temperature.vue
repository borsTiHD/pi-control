<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiThermometer }}
            </v-icon>
            Temperature

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
                <v-col cols="auto" class="flex-grow-0 flex-shrink-0">
                    <v-progress-circular
                        :rotate="180"
                        :size="100"
                        :width="15"
                        :value="tempValue"
                        :color="color(tempValue)"
                    >
                        {{ tempValue }} °C
                    </v-progress-circular>
                </v-col>
                <v-col class="flex-grow-1 flex-shrink-0">
                    <temperature-graph />
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
import moment from 'moment'
import { mapGetters } from 'vuex'
import Temperature from '@/models/Temperature'
import TemperatureGraph from '~/components/dashboard-new/TemperatureGraph.vue'

export default {
    name: 'Temperature',
    components: {
        TemperatureGraph
    },
    data() {
        return {
            loading: false,
            testData: false,
            socketRoom: 'temperature',
            textNoData: 'No data could be determined.',
            tempLimits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: 'green' },
                mid: { value: 50, color: 'yellow' },
                high: { value: 60, color: 'orange' },
                max: { value: 75, color: 'red' }
            }
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        tempValue() {
            // Returns temperature value without any text
            if (this.data) {
                const temperature = this.data.replace('\'C', '') // Removes "'C" from value
                return parseFloat(temperature)
            }
            return false
        },
        data() {
            const temperature = Temperature.query()
                .orderBy('timestamp', 'asc')
                .last()
            return temperature?.temperature || false
        }
    },
    created() {
        // Set loading
        this.loading = true
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
        temperature(message) {
            if (message._status === 'error') {
                console.error(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                // Set loading to 'false' after we get an error
                this.loading = false
                return false
            } else if (message._status === 'ok') {
                // Saving socket data
                // console.log(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                const data = message.data.temperature

                // TEST DATA - are not real
                if (message?.data?.TEST_DATA) {
                    this.testData = true
                }

                // Inserting data into database
                Temperature.insert({
                    data: {
                        temperature: data,
                        timestamp: moment().unix()
                    }
                })
            } else {
                console.log(`[Socket.io] -> Message from server '${this.socketRoom}', without usable data:`, message)
            }

            // Set loading to 'false' after we get data
            this.loading = false
        }
    },
    methods: {
        color(val) {
            // Coloring of equal or greater values (from max to low)
            const limit = this.tempLimits
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
