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
            <system />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <device />
        </v-col>
    </v-row>
</template>

<script>
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
    }
}
</script>
