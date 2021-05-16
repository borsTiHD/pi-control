<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-thermometer
            </v-icon>
            Temperature
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
                    <v-progress-circular
                        :rotate="180"
                        :size="100"
                        :width="15"
                        :value="tempValue"
                        :color="color"
                    >
                        {{ tempValue }} °C
                    </v-progress-circular>
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
    name: 'Temperature',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            textNoData: 'No data could be determined. Please rescan manually.',
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
            getTemperatureData: 'device/getTemperatureData'
        }),
        data() {
            if (this.getTemperatureData) return this.getTemperatureData
            return false
        },
        tempValue() {
            // Returns temperature value without any text
            if (this.data) {
                const arr = this.data.split('=').map((item) => {
                    return item.replace('\'C', '') // Removes "'C" from value
                })
                return arr[1]
            }
            return false
        },
        color() {
            // Coloring of equal or greater values (from max to low)
            const val = this.tempValue
            const limit = this.tempLimits
            if (val >= limit.max) {
                return limit.max.color
            } else if (val >= limit.high) {
                return limit.high.color
            } else if (val >= limit.mid) {
                return limit.mid.color
            } else if (val >= limit.low) {
                return limit.low.color
            }
            return 'secondary' // not possible
        }
    }
}
</script>
