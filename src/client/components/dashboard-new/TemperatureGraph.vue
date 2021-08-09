<template>
    <div>
        <line-chart :chart-data="chartData" />
    </div>
</template>

<script>
import moment from 'moment'
import { LineChart } from 'vue-chart-3'
import Temperature from '@/models/Temperature'

export default {
    name: 'TemperatureGraph',
    components: {
        LineChart
    },
    /*
    setup() {
        const data = ref(() => {
            const temperature = Temperature.query()
                .orderBy('timestamp', 'asc')
                .limit(5).get()
            return temperature || false
        })
        const lineRef = ref()

        // Coloring of equal or greater values (from max to low)
        const tempLimits = {
            low: { value: 0, color: '#4CAF50' },
            mid: { value: 50, color: '#ffeb3b' },
            high: { value: 60, color: '#ffa500' },
            max: { value: 75, color: '#ce0018' }
        }

        const options = ref({
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart'
                }
            }
        })

        const chartData = computed(() => {
            const labels = []
            const datasets = [
                {
                    data: [],
                    backgroundColor: []
                }
            ]

            data.forEach((tempObj) => {
                // Pushing Timestamp into labels
                labels.push(moment.unix(tempObj.timestamp).format('HH:mm:ss'))

                // Getting Data
                const temperature = tempValue(tempObj.temperature)
                const color = valToColor(temperature)

                // Pushing data
                datasets[0].data.push(temperature)
                datasets[0].backgroundColor.push(color)
            })

            return {
                labels,
                datasets
            }
        })

        function tempValue(value) {
            // Returns temperature value without any text
            const temperature = value.replace('\'C', '') // Removes "'C" from value
            return parseFloat(temperature) || false
        }

        function valToColor(val) {
            // Coloring of equal or greater values (from max to low)
            const limit = this.tempLimits
            if (val >= limit.max.value) {
                return limit.max.color
            } else if (val >= limit.high.value) {
                return limit.high.color
            } else if (val >= limit.mid.value) {
                return limit.mid.color
            } else if (val >= limit.low.value) {
                return limit.low.color
            }
            return '' // not possible
        }

        return { data, chartData, lineRef, options, tempLimits, tempValue, valToColor }
    },
    */
    data() {
        return {
            tempLimits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: '#4CAF50' },
                mid: { value: 50, color: '#ffeb3b' },
                high: { value: 60, color: '#ffa500' },
                max: { value: 75, color: '#ce0018' }
            }
        }
    },
    computed: {
        data() {
            const temperature = Temperature.query()
                .orderBy('timestamp', 'asc')
                .limit(5).get()
            return temperature || false
        },
        chartData() {
            if (!this.data) return false

            const labels = []
            const datasets = [
                {
                    data: [],
                    backgroundColor: []
                }
            ]

            this.data.forEach((tempObj) => {
                // Pushing Timestamp into labels
                labels.push(moment.unix(tempObj.timestamp).format('HH:mm:ss'))

                // Getting Data
                const temperature = this.tempValue(tempObj.temperature)
                const color = this.color(temperature)

                // Pushing data
                datasets[0].data.push(temperature)
                datasets[0].backgroundColor.push(color)
            })

            return {
                labels,
                datasets
            }
        }
    },
    methods: {
        tempValue(value) {
            // Returns temperature value without any text
            const temperature = value.replace('\'C', '') // Removes "'C" from value
            return parseFloat(temperature) || false
        },
        color(val) {
            // Coloring of equal or greater values (from max to low)
            const limit = this.tempLimits
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
