<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiChip }}
            </v-icon>
            CPU

            <v-badge
                v-if="testData"
                color="warning"
                content="TEST DATA"
                inline
            />
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading && !cpuLoad && !cpuCores">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <div v-else-if="cpuLoad || cpuCores">
                <v-row class="d-flex">
                    <v-col v-if="cpuLoad" cols="auto" class="flex-grow-0 flex-shrink-1">
                        <v-progress-circular
                            v-for="(item, index) in cpuLoad"
                            :key="index"
                            class="mr-2"
                            :rotate="180"
                            :size="100"
                            :width="15"
                            :value="cpuLoadPercentage(item.value)"
                            :color="color(item.value)"
                        >
                            <div class="d-flex flex-column align-center">
                                <span>{{ item.value }}</span>
                                <span>{{ item.time }} min</span>
                            </div>
                        </v-progress-circular>
                    </v-col>
                    <v-col class="flex-grow-1 flex-lg-shrink-1 flex-xl-shrink-1">
                        <cpu-usage-vue-chart />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="cpuCores" cols="12" dense class="pb-0">
                        <span class="text-h6 mr-2">Cores:</span><span class="font-weight-bold">{{ cpuCores }}</span>
                    </v-col>
                    <v-col v-if="cpuUsage" cols="12" dense class="pt-0">
                        <span class="text-h6 mr-2">Usage:</span>
                        <span v-for="(value, name) in cpuUsage" :key="name" class="mr-2">
                            {{ cpuUsageMapping(name) }}: <span class="font-weight-bold">{{ value }}%</span>
                        </span>
                    </v-col>
                </v-row>
            </div>
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
import Cpu from '@/models/Cpu'
import CpuUsageVueChart from '~/components/graphs/CpuUsageVueChart.vue'

export default {
    name: 'CpuInfo',
    components: {
        CpuUsageVueChart
    },
    data() {
        return {
            loading: false,
            testData: false,
            socketRoom: 'cpu',
            textNoData: 'No data could be determined.',
            cpuLimits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: 'green' },
                mid: { value: 20, color: 'yellow' },
                high: { value: 50, color: 'orange' },
                max: { value: 75, color: 'red' }
            },
            cpuCores: null,
            loadData: null
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        cpuUsage() {
            const cpu = Cpu.query()
                .orderBy('timestamp', 'asc')
                .last()
            if (cpu) {
                delete cpu.$id
                delete cpu.timestamp
                return cpu
            }
            return false
        },
        cpuLoad() {
            if (this.loadData) {
                const cpuLoad = this.loadData
                return [
                    {
                        value: cpuLoad.min1,
                        time: 1
                    },
                    {
                        value: cpuLoad.min5,
                        time: 5
                    },
                    {
                        value: cpuLoad.min15,
                        time: 15
                    }
                ]
            }
            return false
        }
    },
    activated() {
        // Socket.IO: Joining room
        this.loading = true // Set loading to true after the app joins the room
        this.socketListening(true, this.socketRoom)

        // Checks whether core data are available, if not they are queried
        if (!this.cpuCores) {
            this.getCpuCores()
        }
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.socketListening(false, this.socketRoom)
    },
    sockets: {
        cpu(message) {
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

                // Checks whether core data are available, if not they are queried
                if (!this.cpuCores) {
                    this.getCpuCores()
                }

                // Setting load data in component
                this.loadData = data?.load

                // Inserting data into database
                Cpu.insert({
                    data: {
                        ...data.usage,
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
        getCpuCores() {
            const url = '/device/cores'
            this.$axios.get(url)
                .then(async(res) => {
                    // Saving numbers of cores in component
                    this.cpuCores = res?.data?.data
                }).catch((error) => {
                    console.error(error)
                })
        },
        cpuLoadPercentage(cpuLoad) {
            const maxLoad = parseInt(this.cpuCores) // equals 100%
            const percentage = ((cpuLoad * 100) / (maxLoad * 100)) * 100
            return percentage // returns current load percentage
        },
        color(cpuLoad) {
            // Coloring of equal or greater values (from max to low)
            const val = this.cpuLoadPercentage(cpuLoad)
            const limit = this.cpuLimits
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
        },
        cpuUsageMapping(item) {
            switch (item) {
                case 'us':
                    return 'User'
                case 'sy':
                    return 'Sys'
                case 'ni':
                    return 'Nice'
                case 'id':
                    return 'Idle'
                case 'wa':
                    return 'Wait'
                case 'hi':
                    return 'Hard Inter.'
                case 'si':
                    return 'Soft Inter.'
                case 'st':
                    return 'Steal'
                default:
                    return item
            }
        }
    }
}
</script>
