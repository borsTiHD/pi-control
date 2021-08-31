<template>
    <v-sheet v-if="chartData" color="rgba(0, 0, 0, .12)">
        <v-sparkline
            :value="chartData"
            color="rgba(255, 255, 255, .7)"
            :gradient="['#f72047', '#ffd200', '#1feaea']"
            :line-width="3"
            height="80"
            padding="12"
            stroke-linecap="round"
            smooth
        />
    </v-sheet>
</template>

<script>
import Temperature from '@/models/Temperature'

export default {
    name: 'TemperatureGraph',
    data() {
        return {
            maxValues: 20
        }
    },
    computed: {
        data() {
            const temperature = Temperature.query()
                .orderBy('timestamp', 'desc')
                .limit(this.maxValues).get().reverse()
            return temperature || false
        },
        chartData() {
            if (!this.data) return false

            // Generating data
            const data = []
            this.data.forEach((tempObj) => {
                // Pushing only value
                const temperature = this.tempValue(tempObj.temperature)
                data.push(temperature)
            })

            // Fills missing data if not enough data is available
            const length = this.data.length
            if (length < this.maxValues) {
                let missing = this.maxValues - length
                if (missing > 0) {
                    while (missing--) {
                        data.unshift(0)
                    }
                }
            }

            return data
        }
    },
    methods: {
        tempValue(value) {
            // Returns temperature value without any text
            const temperature = value.replace('\'C', '') // Removes "'C" from value
            return parseFloat(temperature) || false
        }
    }
}
</script>
