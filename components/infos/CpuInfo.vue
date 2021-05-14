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
                    <v-simple-table dense>
                        <template #default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Name
                                    </th>
                                    <th class="text-left">
                                        State
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="item in items"
                                    :key="item.name"
                                >
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.state }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
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
            items: [],
            scripts: {
                cpuScript: path.join('server', 'misc', 'top.sh')
            }
        }
    },
    async created() {
        // Collecting data
        this.loading = true
        const cpuData = await this.$runScript(this.scripts.cpuScript).then((data) => this.crawlTopResponse(data)).catch((error) => {
            console.error(error)
        })

        console.log('cpuData', cpuData)

        // Pushing data in Items
        this.items = []

        // Ending loading
        this.loading = false
    },
    methods: {
        crawlTopResponse(data) {
            // Crawls response from 'top -b -n1'
            const arr = data.split('\n')
            console.log('arr', arr)
            return arr
        }
    }
}
</script>
