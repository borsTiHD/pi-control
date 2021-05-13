<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <system />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <device />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <cpu-info />
        </v-col>
    </v-row>
</template>

<script>
import System from '~/components/infos/System.vue'
import Device from '~/components/infos/Device.vue'
import CpuInfo from '~/components/infos/CpuInfo.vue'

export default {
    name: 'Info',
    components: {
        System,
        Device,
        CpuInfo
    }
}
</script>
