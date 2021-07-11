<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <auto-refresh />
        </v-col>
        <v-col cols="12" sm="8" md="6">
            <design />
        </v-col>
    </v-row>
</template>

<script>
import AutoRefresh from '~/components/settings/AutoRefresh.vue'
import Design from '~/components/settings/Design.vue'

export default {
    name: 'Settings',
    components: {
        AutoRefresh,
        Design
    }
}
</script>
