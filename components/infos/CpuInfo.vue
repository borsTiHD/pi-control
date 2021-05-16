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
                        <div class="d-flex flex-column">
                            <span>{{ item.value }}</span>
                            <span>{{ item.time }} min</span>
                        </div>
                    </v-progress-circular>
                </v-col>
                <v-col v-if="cpuCores" cols="12">
                    <span>CPU Cores: {{ cpuCores }}</span><br>
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
                const obj = cpuLoad.map((item, index) => {
                    // Index determines which string is taken
                    const time = index === 0 ? 1 : index === 1 ? 5 : 15 // '1 min', '5 min', '15 min'
                    return {
                        value: parseFloat(item.replace(',', '.')), // Input something like '0,33' -> parseFloat needs a '.' instead ','
                        time
                    }
                })
                return obj
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
        cpuLoadPercentage(cpuLoad) {
            const maxLoad = parseInt(this.cpuCores) // equals 100%
            return (cpuLoad * 100) / (maxLoad * 100) // returns current load percentage
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
        }
    }
}
</script>
