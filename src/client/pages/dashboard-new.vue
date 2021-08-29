<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="5" class="d-flex flex-column">
            <memory class="mb-2" />
            <swap class="mt-2" />
        </v-col>
        <v-col cols="12" sm="8" md="3" lg="3" class="d-flex flex-column">
            <temperature class="mb-2" />
            <uptime class="mt-2" />
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="4" class="d-flex flex-column">
            <diskspace />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <system />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            <hardware />
        </v-col>
    </v-row>
</template>

<script>
import Memory from '~/components/dashboard-new/Memory.vue'
import Swap from '~/components/dashboard-new/Swap.vue'
import Uptime from '~/components/dashboard-new/Uptime.vue'
import Temperature from '~/components/dashboard-new/Temperature.vue'
import Diskspace from '~/components/dashboard-new/Diskspace.vue'
import System from '~/components/dashboard-new/System.vue'
import Hardware from '~/components/dashboard-new/Hardware.vue'

export default {
    name: 'Dashboard',
    components: {
        Memory,
        Swap,
        Uptime,
        Temperature,
        Diskspace,
        System,
        Hardware
    },
    head() {
        return {
            title: `${this.$options.name} | ${this.headTitle()}`
        }
    }
}
</script>
