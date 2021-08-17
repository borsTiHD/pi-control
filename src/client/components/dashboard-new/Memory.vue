<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column mb-2">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiMemory }}
            </v-icon>
            Memory
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
                    <span>Used: <span class="font-weight-bold">{{ memory.used }}MB ({{ memoryUsedPercentage(memory) }}%)</span></span>
                    <span>Available: <span class="font-weight-bold">{{ memory.available }}MB</span></span>
                    <span>Total: <span class="font-weight-bold">{{ memory.total }}MB</span></span>
                </v-col>
                <v-col cols="12">
                    <v-progress-linear
                        :value="memoryUsedPercentage(memory)"
                        :color="color(memoryUsedPercentage(memory))"
                        height="25"
                    >
                        <strong>{{ memoryUsedPercentage(memory) }}%</strong>
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
            return false
            /*
            const temperature = Temperature.query()
                .orderBy('timestamp', 'asc')
                .last()
            return temperature?.temperature || false
            */
        },
        memory() {
            if (this.data) {
                const memoryTypes = this.crawlMemoryTypes(this.data)
                const memoryData = this.crawlMemoryData(this.data)
                const arrWithObj = memoryData.map((item, index) => {
                    return {
                        value: item,
                        type: memoryTypes[index]
                    }
                })

                // Building Object for better use
                const result = {}
                arrWithObj.forEach((obj) => {
                    result[obj.type] = obj.value
                })
                return result
            }
            return false
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
                console.log(`[Socket.io] -> Message from server '${this.socketRoom}':`, message)
                // const data = message.data.xxx

                // TEST DATA - are not real
                if (message?.data?.TEST_DATA) {
                    this.testData = true
                }

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
        crawlMemoryTypes(data) {
            // Crawls response from 'free'
            // Filters memory types -> total, used, free, shared, buff/cache, available
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 0) {
                return arr[0].replace(/^\s+/gm, '').split(/\s+/)
            }
            return false
        },
        crawlMemoryData(data) {
            // Crawls response from 'free'
            // Filters memory data
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 0) {
                return arr[1].replace(/Mem:\s+/gm, '').split(/\s+/)
            }
            return false
        },
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
