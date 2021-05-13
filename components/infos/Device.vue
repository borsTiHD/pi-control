<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-laptop
            </v-icon>
            Device
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
    name: 'Device',
    data() {
        return {
            loading: false,
            items: []
        }
    },
    async created() {
        // Collecting data
        this.loading = true
        const hardwareInfo = await this.fetchingData(path.join('scripts', 'server', 'cpu', 'show cpu info.sh')).then((data) => this.crawlHardware(data))
        this.items = hardwareInfo

        // Ending loading
        this.loading = false
    },
    methods: {
        async fetchingData(script) {
            const url = '/execute'
            const data = await this.$axios.post(url, null, { params: { script } })
                .then((res) => {
                    const data = res.data
                    console.log(`[Device] -> Executed Script (${script}):`, data)
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        return data.response.output
                    }
                }).catch((error) => {
                    this.$toast.error(error.message)
                    console.error(error)
                })
            return data
        },
        crawlHardware(data) {
            // Collecting following stuff
            /*
            Hardware        : BCM2711
            Revision        : d03114
            Serial          : 100000000a21a527
            Model           : Raspberry Pi 4 Model B Rev 1.4
            */
            function crawlingData(data, search) {
                const patt = new RegExp(`${search}.+$`, 'gm')
                const matches = data.match(patt)
                if (Array.isArray(matches)) {
                    return matches.map((item) => {
                        return item.replace(search, '').replace(/^\s+:\s+/gm, '')
                    })[0]
                }
                return false
            }

            // Return results
            return [
                { name: 'Hardware:', state: crawlingData(data, 'Hardware') },
                { name: 'Revision:', state: crawlingData(data, 'Revision') },
                { name: 'Serial:', state: crawlingData(data, 'Serial') },
                { name: 'Model:', state: crawlingData(data, 'Model') }
            ]
        }
    }
}
</script>
