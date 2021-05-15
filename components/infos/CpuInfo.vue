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
            <v-row v-if="loading && !cpuLoad">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else-if="cpuLoad">
                <v-col cols="12">
                    <span>CPU Cores: {{ cpuCores }}</span><br>
                </v-col>
                <v-col cols="12">
                    <span v-for="(item, index) in cpuLoad" :key="index" class="mr-4">{{ item }}</span>
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
            textNoData: 'No data could be determined. Please rescan manually.'
        }
    },
    computed: {
        ...mapGetters({
            getCpuCores: 'device/getCpuCores',
            getTopData: 'device/getTopData'
        }),
        cpuLoad() {
            if (this.getTopData) return this.crawlCpuLoad(this.getTopData)
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
        }
    }
}
</script>
