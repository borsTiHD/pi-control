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
            <memory :loading="loading.memory" @rescan="scanMemoryData" />
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
                disk: false,
                memory: false
            },
            scripts: {
                kernel: path.join('server', 'misc', 'kernel info.sh'),
                operatingSystem: path.join('server', 'misc', 'operating system.sh'),
                hardwareScript: path.join('server', 'cpu', 'show cpu info.sh'),
                disk: path.join('server', 'disk', 'df.sh'),
                memory: path.join('server', 'memory', 'free.sh')
            }
        }
    },
    created() {
        // Initial collecting data
        this.scanSystemData()
        this.scanHardwareData()
        this.scanDiskData()
        this.scanMemoryData()
    },
    methods: {
        ...mapActions({
            setKernelData: 'device/setKernelData',
            setOperatingSystem: 'device/setOperatingSystem',
            setHardwareData: 'device/setHardwareData',
            setDiskData: 'device/setDiskData',
            setMemoryData: 'device/setMemoryData'
        }),
        async scanSystemData() {
            // Sets loading state
            this.loading.system = true

            try { // Collecting kernel data
                const data = await this.$runScript(this.scripts.kernel)
                if (data && (typeof data === 'string' || data instanceof String)) this.setKernelData(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            try { // Collecting operating system data
                const data = await this.$runScript(this.scripts.data)
                if (data && (typeof data === 'string' || data instanceof String)) this.setOperatingSystem(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.system = false
        },
        async scanHardwareData() {
            // Sets loading state
            this.loading.hardware = true

            try { // Collecting hardware data
                const data = await this.$runScript(this.scripts.hardwareScript)
                if (data && (typeof data === 'string' || data instanceof String)) this.setHardwareData(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.hardware = false
        },
        async scanDiskData() {
            // Sets loading state
            this.loading.disk = true

            try { // Collecting disk data
                const data = await this.$runScript(this.scripts.disk)
                if (data && (typeof data === 'string' || data instanceof String)) this.setDiskData(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.disk = false
        },
        async scanMemoryData() {
            // Sets loading state
            this.loading.memory = true

            try { // Collecting memory data
                const data = await this.$runScript(this.scripts.memory)
                if (data && (typeof data === 'string' || data instanceof String)) this.setMemoryData(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.memory = false
        }
    }
}
</script>
