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
            <diskspace :loading="loading.disk" @rescan="scanDiskData" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <system :loading="loading.system" @rescan="scanSystemData" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <device :loading="loading.hardware" @rescan="scanHardwareData" />
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
                system: false,
                hardware: false,
                disk: false
            },
            scripts: {
                kernel: path.join('server', 'misc', 'kernel info.sh'),
                operatingSystem: path.join('server', 'misc', 'operating system.sh'),
                hardwareScript: path.join('server', 'cpu', 'show cpu info.sh'),
                disk: path.join('server', 'disk', 'df.sh')
            }
        }
    },
    created() {
        // Initial collecting data
        this.scanSystemData()
        this.scanHardwareData()
        this.scanDiskData()
    },
    methods: {
        ...mapActions({
            setKernelData: 'device/setKernelData',
            setOperatingSystem: 'device/setOperatingSystem',
            setHardwareData: 'device/setHardwareData',
            setDiskData: 'device/setDiskData'
        }),
        async scanSystemData() {
            // Sets loading state
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
        },
        async scanHardwareData() {
            // Sets loading state
            this.loading.hardware = true

            // Collecting hardware data
            try {
                const hardwareData = await this.$runScript(this.scripts.hardwareScript)
                if (hardwareData && (typeof hardwareData === 'string' || hardwareData instanceof String)) this.setHardwareData(hardwareData) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.hardware = false
        },
        async scanDiskData() {
            // Sets loading state
            this.loading.disk = true

            // Collecting disk data
            try {
                const disk = await this.$runScript(this.scripts.disk)
                if (disk && (typeof disk === 'string' || disk instanceof String)) this.setDiskData(disk) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.disk = false
        }
    }
}
</script>
