<template>
    <v-card class="flex d-flex flex-column mt-2">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-swap-horizontal-bold
            </v-icon>
            Swap
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
                    <span>Used: {{ swap.used }}MB ({{ swapUsedPercentage(swap) }}%)</span>
                    <span>Free: {{ swap.free }}MB</span>
                    <span>Total: {{ swap.total }}MB</span>
                </v-col>
                <v-col cols="12">
                    <v-progress-linear
                        :value="swapUsedPercentage(swap)"
                        height="25"
                    >
                        <strong>{{ swapUsedPercentage(swap) }}%</strong>
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
    name: 'Swap',
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
        swap() {
            if (this.data) {
                const swapTypes = this.crawlSwapTypes(this.data)
                const swapData = this.crawlSwapData(this.data)
                const arrWithObj = swapData.map((item, index) => {
                    return {
                        value: item,
                        type: swapTypes[index]
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
        crawlSwapTypes(data) {
            // Crawls response from 'free'
            // Filters swap types -> total, used, free, shared, buff/cache, available
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 0) {
                return arr[0].replace(/^\s+/gm, '').split(/\s+/)
            }
            return false
        },
        crawlSwapData(data) {
            // Crawls response from 'free'
            // Filters swap data
            const arr = data.split('\n')
            if (Array.isArray(arr) && arr.length > 0) {
                return arr[2].replace(/Swap:\s+/gm, '').split(/\s+/)
            }
            return false
        },
        swapUsedPercentage(swap) {
            const percentage = (swap.used / swap.total) * 100 // returns current load percentage
            return Math.round(percentage * 100) / 100 // Rounds last 2 digits
        }
    }
}
</script>
