<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <uptime />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <cpu-info />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <temperature />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <memory />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <diskspace />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <system :loading="loading.system" @rescan="scanSystem" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <device />
        </v-col>
    </v-row>
</template>

<script>
import path from 'path'
import { mapActions } from 'vuex'

import System from '~/components/infos/System.vue'
import Device from '~/components/infos/Device.vue'
import CpuInfo from '~/components/infos/CpuInfo.vue'
import Uptime from '~/components/infos/Uptime.vue'
import Temperature from '~/components/infos/Temperature.vue'
import Memory from '~/components/infos/Memory.vue'
import Diskspace from '~/components/infos/Diskspace.vue'

export default {
    name: 'Info',
    components: {
        System,
        Device,
        CpuInfo,
        Uptime,
        Temperature,
        Memory,
        Diskspace
    },
    data() {
        return {
            loading: {
                system: false
            },
            scripts: {
                kernel: path.join('server', 'misc', 'kernel info.sh'),
                operatingSystem: path.join('server', 'misc', 'operating system.sh')
            }
        }
    },
    created() {
        this.scanSystem() // Initial system scan
    },
    methods: {
        ...mapActions({
            setKernelData: 'device/setKernelData',
            setOperatingSystem: 'device/setOperatingSystem'
        }),
        async scanSystem() {
            // Sets loading state and deletes all items
            this.loading.system = true

            // Collecting kernel data
            try {
                const kernelData = await this.$runScript(this.scripts.kernel)
                if (kernelData && (typeof kernelData === 'string' || kernelData instanceof String)) this.setKernelData(kernelData) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Collecting operating system data
            try {
                const operatingSystem = await this.$runScript(this.scripts.operatingSystem)
                if (operatingSystem && (typeof operatingSystem === 'string' || operatingSystem instanceof String)) this.setOperatingSystem(operatingSystem) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.system = false
        }
    }
}
</script>
