<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
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
                        @click="$emit('rescan')"
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
            <v-row v-else-if="!loading && items.length > 0">
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
    name: 'System',
    props: {
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            textNoData: 'No data could be determined. Please rescan manually.'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getKernelData: 'device/getKernelData',
            getOperatingSystem: 'device/getOperatingSystem'
        }),
        items() {
            // Result for return
            const items = []

            // Kernel Data
            const kernelData = this.crawlKernelInfo(this.getKernelData)
            if (kernelData) { kernelData.forEach((item) => { items.push(item) }) }

            // Operating System Data
            const operatingSystem = this.crawlOperatingSystem(this.getOperatingSystem)
            if (operatingSystem) { items.push(operatingSystem) }

            return items
        }
    },
    methods: {
        crawlKernelInfo(data) {
            if (!data) return false
            // Crawls Kerlen infos -> exp. 'Linux hostname 5.10.17-v7l+ #1414 SMP Fri Apr 30 13:20:47 BST 2021 armv7l GNU/Linux'
            const arr = data.split(' ')
            return [
                { name: 'System:', state: arr[0] },
                { name: 'Hostname:', state: arr[1] },
                { name: 'Kernel:', state: data.replace(arr[0], '').replace(arr[1], '').replace(/^\s+/, '') }
            ]
        },
        crawlOperatingSystem(data) {
            if (!data) return false
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
            return [{ name: pattText, state: false }]
        }
    }
}
</script>
