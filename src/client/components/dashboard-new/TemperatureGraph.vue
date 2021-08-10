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
    computed: {
        data() {
            const temperature = Temperature.query()
                .orderBy('timestamp', 'desc')
                .limit(5).get().reverse()
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
