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
            System
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
                        @click="scanFiles"
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
                </template>
                <span>Rescan</span>
            </v-tooltip>
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
    name: 'System',
    data() {
        return {
            loading: false,
            items: [],
            scripts: {
                kernelScript: path.join('server', 'misc', 'kernel info.sh'),
                operatingSystemScript: path.join('server', 'misc', 'operating system.sh')
            }
        }
    },
    created() {
        this.scanFiles()
    },
    methods: {
        async scanFiles() {
            // Sets loading state and deletes all items
            this.loading = true
            this.items = []

            // Collecting kernel data
            try {
                const kernelData = await this.$runScript(this.scripts.kernelScript).then((data) => this.crawlKernelInfo(data))
                if (Array.isArray(kernelData)) { kernelData.forEach((item) => { this.items.push(item) }) }
            } catch (err) {
                console.error(err)
            }

            // Collecting operating system data
            try {
                const operatingSystem = await this.$runScript(this.scripts.operatingSystemScript).then((data) => this.crawlOperatingSystem(data))
                this.items.push(operatingSystem)
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading = false
        },
        crawlKernelInfo(data) {
            // Crawls Kerlen infos -> exp. 'Linux hostname 5.10.17-v7l+ #1414 SMP Fri Apr 30 13:20:47 BST 2021 armv7l GNU/Linux'
            const arr = data.split(' ')
            return [
                { name: 'System:', state: arr[0] },
                { name: 'Hostname:', state: arr[1] },
                { name: 'Kernel:', state: data.replace(arr[0], '').replace(arr[1], '').replace(/^\s+/, '') }
            ]
        },
        crawlOperatingSystem(data) {
            // Crawls OS infos -> searching for. 'Operating System: Raspbian GNU/Linux 10 (buster)'
            const pattText = 'Operating System:'
            const patt = new RegExp(`${pattText}.+$`, 'gm')
            const matches = data.match(patt)
            if (Array.isArray(matches)) {
                return {
                    name: pattText,
                    state: matches.map((item) => {
                        return item.replace(pattText, '').replace(/^ +/gm, '')
                    })[0]
                }
            }
            return false
        }
    }
}
</script>
