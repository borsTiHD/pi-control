<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <uptime :loading="loading.uptime" @rescan="scanData(scripts.uptime, 'uptime', (data) => { setUptimeData(data) })" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <cpu-info :loading="loading.cpu" @rescan="scanCpuData" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <temperature :loading="loading.temperature" @rescan="scanData(scripts.temperature, 'temperature', (data) => { setTemperatureData(data) })" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <memory :loading="loading.memory" @rescan="scanData(scripts.memory, 'memory', (data) => { setMemoryData(data) })" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <diskspace :loading="loading.disk" @rescan="scanData(scripts.disk, 'disk', (data) => { setDiskData(data) })" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <system :loading="loading.system" @rescan="scanSystemData" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <device :loading="loading.hardware" @rescan="scanData(scripts.hardware, 'hardware', (data) => { setHardwareData(data) })" />
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
                uptime: false,
                system: false,
                hardware: false,
                cpu: false,
                disk: false,
                memory: false,
                temperature: false
            },
            scripts: {
                uptime: path.join('server', 'misc', 'uptime.sh'),
                kernel: path.join('server', 'misc', 'kernel info.sh'),
                operatingSystem: path.join('server', 'misc', 'operating system.sh'),
                hardware: path.join('server', 'cpu', 'show cpu info.sh'),
                cpuCores: path.join('server', 'cpu', 'cores.sh'),
                topScript: path.join('server', 'misc', 'top.sh'),
                disk: path.join('server', 'disk', 'df.sh'),
                memory: path.join('server', 'memory', 'free.sh'),
                temperature: path.join('server', 'cpu', 'SoC temp in celsius.sh')
            }
        }
    },
    created() {
        // Initial collecting data
        this.scanData(this.scripts.uptime, 'uptime', (data) => { this.setUptimeData(data) })
        this.scanData(this.scripts.hardware, 'hardware', (data) => { this.setHardwareData(data) })
        this.scanData(this.scripts.disk, 'disk', (data) => { this.setDiskData(data) })
        this.scanData(this.scripts.memory, 'memory', (data) => { this.setMemoryData(data) })
        this.scanData(this.scripts.temperature, 'temperature', (data) => { this.setTemperatureData(data) })

        this.scanSystemData()
        this.scanCpuData()
    },
    methods: {
        ...mapActions({
            setUptimeData: 'device/setUptimeData',
            setKernelData: 'device/setKernelData',
            setOperatingSystem: 'device/setOperatingSystem',
            setHardwareData: 'device/setHardwareData',
            setCpuCores: 'device/setCpuCores',
            setTopData: 'device/setTopData',
            setDiskData: 'device/setDiskData',
            setMemoryData: 'device/setMemoryData',
            setTemperatureData: 'device/setTemperatureData'
        }),
        async scanData(script, loading, storeAction) {
            // Sets loading state
            this.loading[loading] = true

            try { // Collecting uptime data
                const data = await this.$runScript(script)
                if (data && (typeof data === 'string' || data instanceof String)) storeAction(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading[loading] = false
        },
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
                const data = await this.$runScript(this.scripts.operatingSystem)
                if (data && (typeof data === 'string' || data instanceof String)) this.setOperatingSystem(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.system = false
        },
        async scanCpuData() {
            // Sets loading state
            this.loading.cpu = true

            try { // Collecting cpu cores
                const data = await this.$runScript(this.scripts.cpuCores)
                if (data && (typeof data === 'string' || data instanceof String)) this.setCpuCores(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            try { // Collecting top data
                const data = await this.$runScript(this.scripts.topScript)
                if (data && (typeof data === 'string' || data instanceof String)) this.setTopData(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            this.loading.cpu = false
        }
    }
}
</script>
