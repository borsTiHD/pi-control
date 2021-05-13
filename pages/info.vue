<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
            <device />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4">
            <device />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4">
            <device />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4">
            <device />
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4">
            <device />
        </v-col>
    </v-row>
</template>

<script>
import Device from '~/components/infos/Device.vue'

export default {
    name: 'Info',
    components: {
        Device
    }
}
</script>
