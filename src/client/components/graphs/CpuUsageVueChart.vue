<template>
    <v-sheet color="rgba(0, 0, 0, .12)">
        <line-chart :chart-data="chartData" :height="100" :options="options" />
    </v-sheet>
</template>

<script>
import moment from 'moment'
import { LineChart } from 'vue-chart-3'
import Cpu from '@/models/Cpu'

export default {
    name: 'CpuUsageVueChart',
    components: {
        LineChart
    },
    data() {
        return {
            maxValues: 20,
            limits: { // Coloring of equal or greater values (from max to low)
                low: { value: 0, color: { bg: 'rgba(29, 179, 35, 0.3)', line: 'rgba(29, 179, 35, 1)' } }, // #1db323
                mid: { value: 50, color: { bg: 'rgba(255, 229, 0, 0.3)', line: 'rgba(255, 229, 0, 1)' } }, // #ffe500
                high: { value: 60, color: { bg: 'rgba(255, 166, 0, 0.3)', line: 'rgba(255, 166, 0, 1)' } }, // #ffa500
                max: { value: 75, color: { bg: 'rgba(206, 0, 24, 0.3)', line: 'rgba(206, 0, 24, 1)' } } // #ce0018
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                animation: {
                    duration: 0
                },
                scales: {
                    x: {
                        display: false,
                        title: {
                            display: false,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: false,
                        title: {
                            display: false,
                            text: 'Usage in %'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        }
    },
    computed: {
        data() {
            const cpuData = Cpu.query()
                .orderBy('timestamp', 'desc')
                .limit(this.maxValues).get().reverse()
            return cpuData || false
        },
        chartData() {
            const data = this.data
            if (!data) return false

            const labels = []
            const datasets = [
                {
                    data: [],
                    label: 'Usage in %',
                    borderColor: false,
                    backgroundColor: false,
                    borderWidth: 2,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    fill: true
                },
                {
                    data: Array(this.maxValues).fill(this.limits.mid.value),
                    label: 'mid',
                    borderColor: this.limits.mid.color.bg,
                    borderWidth: 1,
                    borderDash: [10, 5],
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    fill: false
                },
                {
                    data: Array(this.maxValues).fill(this.limits.max.value),
                    label: 'max',
                    borderColor: this.limits.max.color.bg,
                    borderWidth: 1,
                    borderDash: [10, 5],
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    fill: false
                }
            ]

            // Fills missing data if not enough data is available
            const length = data.length
            if (length < this.maxValues) {
                let missing = this.maxValues - length
                if (missing > 0) {
                    while (missing--) {
                        labels.push(0)
                        datasets[0].data.push(0)
                    }
                }
            }

            // Generating chart dataset
            data.forEach((cpuData) => {
                // Pushing Timestamp into labels
                labels.push(moment.unix(cpuData.timestamp).format('HH:mm:ss'))

                // Getting Data
                const idle = cpuData.id
                const usage = Math.round(100 - idle)
                const color = this.color(usage)

                // Pushing data
                datasets[0].data.push(usage)
                datasets[0].borderColor = color.line
                datasets[0].backgroundColor = color.bg
            })

            return {
                labels,
                datasets
            }
        }
    },
    methods: {
        color(val) {
            // Coloring of equal or greater values (from max to low)
            const limit = this.limits
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
