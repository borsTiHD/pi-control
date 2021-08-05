<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                {{ $icons.mdiRaspberryPi }}
            </v-icon>
            Device
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
                        <v-icon>{{ $icons.mdiCached }}</v-icon>
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
                        :icon="$icons.mdiCloudAlert"
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
    name: 'Device',
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
            getHardwareData: 'device/getHardwareData'
        }),
        items() {
            // Result for return
            const items = []

            // Kernel Data
            const hardwareData = this.crawlHardware(this.getHardwareData)
            if (hardwareData) { hardwareData.forEach((item) => { items.push(item) }) }

            return items
        }
    },
    methods: {
        crawlHardware(data) {
            if (!data) return false
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
