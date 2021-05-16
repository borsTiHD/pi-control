<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-memory
            </v-icon>
            Memory
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
                    <span>Used: {{ memory.used }}MB ({{ memoryUsedPercentage(memory) }}%)</span>
                    <span>Available: {{ memory.available }}MB</span>
                    <span>Total: {{ memory.total }}MB</span>
                </v-col>
                <v-col cols="12">
                    <v-progress-linear
                        :value="memoryUsedPercentage(memory)"
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
    name: 'Memory',
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
            getMemoryData: 'device/getMemoryData'
        }),
        data() {
            if (this.getMemoryData) return this.getMemoryData
            return false
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
        }
    }
}
</script>
