<template>
    <v-card>
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-laptop
            </v-icon>
            Device Info
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
        this.loading = true
        const kernelData = await this.fetchingData(path.join('scripts', 'server', 'misc', 'kernel info.sh')).then((data) => this.crawlKernelInfo(data))
        const operatingSystem = await this.fetchingData(path.join('scripts', 'server', 'misc', 'operating system.sh')).then((data) => this.crawlOperatingSystem(data))

        console.log(kernelData)
        console.log(operatingSystem)

        /*
        this.items = [
            {
                name: 'test',
                state: 'test'
            }
        ]
        */

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
        crawlKernelInfo(data) {
            // Crawls Kerlen infos -> exp. 'Linux hostname 5.10.17-v7l+ #1414 SMP Fri Apr 30 13:20:47 BST 2021 armv7l GNU/Linux'
            const arr = data.split(' ')
            return {
                sysname: arr[0],
                nodename: arr[1],
                kernel: data.replace(arr[0], '').replace(arr[1], '').replace(/^\s+/, '')
            }
        },
        crawlOperatingSystem(data) {
            // Crawls OS infos -> searching for. 'Operating System: Raspbian GNU/Linux 10 (buster)'
            const pattText = 'Operating System:'
            const patt = new RegExp(`${pattText}.+$`, 'gm')
            const matches = data.match(patt)
            if (Array.isArray(matches)) {
                return matches.map((item) => {
                    return item.replace(pattText, '').replace(/^ +/gm, '')
                })[0]
            }
            return false
        }
    }
}
</script>
