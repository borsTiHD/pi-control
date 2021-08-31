<template>
    <v-sheet v-if="chartData" color="rgba(0, 0, 0, .12)">
        <v-sparkline
            :value="chartData"
            color="rgba(255, 255, 255, .7)"
            :gradient="['#f72047', '#ffd200', '#1feaea']"
            :line-width="1"
            height="40"
            padding="6"
            stroke-linecap="round"
            smooth
        />
    </v-sheet>
</template>

<script>
import Cpu from '@/models/Cpu'

export default {
    name: 'CpuUsageGraph',
    data() {
        return {
            maxValues: 20
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
            if (!this.data) return false

            // Generating data
            const data = []
            this.data.forEach((cpuData) => {
                // Pushing only value
                const idle = cpuData.id
                const usage = Math.round(100 - idle)
                console.log(usage)
                data.push(usage)
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
    }
}
</script>
