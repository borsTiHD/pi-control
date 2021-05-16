<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <uptime :loading="loading.uptime" @rescan="scanAlias('uptime')" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <cpu-info :loading="cpuLoading" @rescan="scanAlias('cpu')" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <temperature :loading="loading.temperature" @rescan="scanAlias('temperature')" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <memory :loading="loading.memory" @rescan="scanAlias('memory')" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <diskspace :loading="loading.disk" @rescan="scanAlias('disk')" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <system :loading="systemLoading" @rescan="scanAlias('system')" />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <device :loading="loading.hardware" @rescan="scanAlias('hardware')" />
        </v-col>
    </v-row>
</template>

<script>
import path from 'path'
import { mapGetters, mapActions } from 'vuex'

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
            created: false,
            loading: {
                uptime: false,
                kernel: false,
                operatingSystem: false,
                hardware: false,
                cpuCores: false,
                topScript: false,
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
            },
            intervalTimer: 1000 * 5,
            interval: {
                uptime: null,
                cpuLoad: null,
                memory: null,
                temperature: null
            }
        }
    },
    computed: {
        ...mapGetters({
            getAutoRefresh: 'settings/getAutoRefresh'
        }),
        cpuLoading() {
            // Because we load multiple scripts, the child component gets this computed value for loading state
            if (this.loading.cpuCores && this.loading.topScript) return true
            return false
        },
        systemLoading() {
            // Because we load multiple scripts, the child component gets this computed value for loading state
            if (this.loading.kernel && this.loading.operatingSystem) return true
            return false
        }
    },
    created() {
        if (process.client) {
            // Initial collecting data with 'alias'
            this.scanAlias('disk')
            this.scanAlias('hardware')
            this.scanAlias('system')
        }
    },
    activated() {
        // Initial collecting after every component activation
        this.scanAlias('uptime')
        this.scanAlias('cpu')
        this.scanAlias('memory')
        this.scanAlias('temperature')

        // Clearing existing intervals
        if (this.interval.uptime) { clearInterval(this.interval.uptime) }
        if (this.interval.cpuLoad) { clearInterval(this.interval.cpuLoad) }
        if (this.interval.memory) { clearInterval(this.interval.memory) }
        if (this.interval.temperature) { clearInterval(this.interval.temperature) }

        // Interval for collecting data if 'AutoRefresh' is activated in settings
        if (this.getAutoRefresh) {
            this.interval.uptime = setInterval(() => { this.scanAlias('uptime') }, this.intervalTimer) // Uptime
            this.interval.cpuLoad = setInterval(() => { this.scanAlias('cpu') }, this.intervalTimer) // CPU Load
            this.interval.memory = setInterval(() => { this.scanAlias('memory') }, this.intervalTimer) // Memory Data
            this.interval.temperature = setInterval(() => { this.scanAlias('temperature') }, this.intervalTimer) // Temperature
        }
    },
    deactivated() {
        // Clearing intervals on leaving
        if (this.interval.uptime) { clearInterval(this.interval.uptime) }
        if (this.interval.cpuLoad) { clearInterval(this.interval.cpuLoad) }
        if (this.interval.memory) { clearInterval(this.interval.memory) }
        if (this.interval.temperature) { clearInterval(this.interval.temperature) }
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
            if (loading !== false) { this.loading[loading] = true }

            try { // Collecting uptime data
                const data = await this.$runScript(script, null, true)
                if (data && (typeof data === 'string' || data instanceof String)) storeAction(data) // Save in store
            } catch (err) {
                console.error(err)
            }

            // Ending loading
            if (loading !== false) { this.loading[loading] = false }
        },
        scanAlias(method) {
            switch (method) {
                case 'cpu':
                    this.scanData(this.scripts.cpuCores, 'cpuCores', (data) => { this.setCpuCores(data) })
                    this.scanData(this.scripts.topScript, 'topScript', (data) => { this.setTopData(data) })
                    break

                case 'system':
                    this.scanData(this.scripts.kernel, 'kernel', (data) => { this.setKernelData(data) })
                    this.scanData(this.scripts.operatingSystem, 'operatingSystem', (data) => { this.setOperatingSystem(data) })
                    break

                case 'uptime':
                    this.scanData(this.scripts.uptime, 'uptime', (data) => { this.setUptimeData(data) })
                    break

                case 'hardware':
                    this.scanData(this.scripts.hardware, 'hardware', (data) => { this.setHardwareData(data) })
                    break

                case 'disk':
                    this.scanData(this.scripts.disk, 'disk', (data) => { this.setDiskData(data) })
                    break

                case 'memory':
                    this.scanData(this.scripts.memory, 'memory', (data) => { this.setMemoryData(data) })
                    break

                case 'temperature':
                    this.scanData(this.scripts.temperature, 'temperature', (data) => { this.setTemperatureData(data) })
                    break

                default:
                    break
            }
        }
    }
}
</script>
