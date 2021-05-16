<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-chip
            </v-icon>
            CPU
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <v-btn
                        icon
                        color="primary"
                        class="ml-2"
                        :loading="loading"
                        :disabled="loading"
                        v-bind="attrs"
                        v-on="on"
                        @click="$emit('rescan')"
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
                </template>
                <span>Rescan</span>
            </v-tooltip>
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
            <v-row v-else-if="cpuLoad || cpuCores">
                <v-col v-if="cpuLoad" cols="12">
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
                <v-col v-if="cpuCores" cols="12" dense>
                    <span>CPU Cores: {{ cpuCores }}</span>
                </v-col>
                <v-col v-if="cpuUsage" cols="12" dense>
                    <span class="mr-2">CPU usage:</span>
                    <span v-for="(item, index) in cpuUsage" :key="index" class="mr-2">
                        {{ cpuUsageMapping(item.type) }}: {{ item.value }}%
                    </span>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <v-alert
                        text
                        prominent
                        type="error"
                        icon="mdi-cloud-alert"
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
    name: 'CpuInfo',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            textNoData: 'No data could be determined. Please rescan manually.',
            cpuLimits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: 'green' },
                mid: { value: 20, color: 'yellow' },
                high: { value: 50, color: 'orange' },
                max: { value: 75, color: 'red' }
            }
        }
    },
    computed: {
        ...mapGetters({
            getCpuCores: 'device/getCpuCores',
            getTopData: 'device/getTopData'
        }),
        cpuLoad() {
            if (this.getTopData) {
                const cpuLoad = this.crawlCpuLoad(this.getTopData)
                const arrWithObj = cpuLoad.map((item, index) => {
                    // Index determines which string is taken
                    const time = index === 0 ? 1 : index === 1 ? 5 : 15 // '1 min', '5 min', '15 min'
                    return {
                        value: parseFloat(item.replace(',', '.')), // Input something like '0,33' -> parseFloat needs a '.' instead ','
                        time
                    }
                })
                return arrWithObj
            }
            return false
        },
        cpuUsage() {
            if (this.getTopData) {
                const cpuUsage = this.crawlCpuUsage(this.getTopData)
                const arrWithObj = cpuUsage.map((item) => {
                    const arr = item.split(/\s+/) // Splitting value and text -> Idle: '92,7 id'
                    return {
                        value: parseFloat(arr[0].replace(',', '.')), // Input something like '7,3' -> parseFloat needs a '.' instead ','
                        type: arr[1]
                    }
                })
                return arrWithObj
            }
            return false
        },
        cpuCores() {
            if (this.getCpuCores) return this.getCpuCores
            return false
        }
    },
    methods: {
        crawlCpuLoad(data) {
            // Crawls response from 'top -b -n1'
            // Filters cpu load
            // Returns array with 3 loads for 1min, 5min, 15min
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 1) {
                const loadAvgString = 'load average:'
                const loadAvgRegexp = new RegExp(`${loadAvgString}.+$`, 'g')
                return arr[0].match(loadAvgRegexp).map((item) => {
                    const arr = item.replace(loadAvgString, '').replace(/^\s+/, '').split(', ')
                    return arr
                })[0]
            }
            return false
        },
        crawlCpuUsage(data) {
            // Crawls response from 'top -b -n1'
            // Filters cpu usage
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 2) {
                const regexp = /%Cpu\(s\):.+$/gm
                const cpuUsage = arr[2].match(regexp)
                if (Array.isArray(cpuUsage)) {
                    return cpuUsage[0].replace(/%Cpu\(s\):\s+/gm, '').split(/\W\s/gm).map((val) => {
                        return val.replace(/^\s+/, '')
                    })
                }
                return false
            }
            return false
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
