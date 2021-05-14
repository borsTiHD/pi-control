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
                        @click="scanFiles"
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
                </template>
                <span>Rescan</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <p v-for="(item, index) in cpuLoad" :key="index">{{ item }}</p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import path from 'path'

export default {
    name: 'CpuInfo',
    data() {
        return {
            loading: false,
            cpuCores: 0,
            cpuLoad: [],
            scripts: {
                cpuCores: path.join('server', 'cpu', 'cores.sh'),
                topScript: path.join('server', 'misc', 'top.sh')
            }
        }
    },
    async created() {
        this.scanFiles()
    },
    methods: {
        async scanFiles() {
            // Loading
            this.loading = true

            // Collecting Data
            this.cpuCores = await this.$runScript(this.scripts.cpuCores).catch((error) => {
                console.error(error)
            })
            const topData = await this.$runScript(this.scripts.topScript).catch((error) => {
                console.error(error)
            })

            // Crawled 'top' data
            if (typeof topData === 'string' || topData instanceof String) {
                this.cpuLoad = this.crawlCpuLoad(topData)
            }

            // Ending loading
            this.loading = false
        },
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
            return []
        }
    }
}
</script>
