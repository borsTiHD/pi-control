<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="3" lg="3">
            <v-row>
                <v-col class="d-flex flex-column">
                    <temperature />
                </v-col>
                <v-col class="d-flex flex-column">
                    <uptime />
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import Uptime from '~/components/dashboard-new/Uptime.vue'
import Temperature from '~/components/dashboard-new/Temperature.vue'

export default {
    name: 'Dashboard',
    components: {
        Uptime,
        Temperature
    },
    head() {
        return {
            title: `${this.$options.name} | ${this.headTitle()}`
        }
    }
}
</script>
