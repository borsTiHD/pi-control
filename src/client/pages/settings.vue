<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" class="d-flex flex-column">
            <design class="mb-4" />
            <auto-refresh class="mb-4" />
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
    },
    head() {
        return {
            title: `${this.$options.name} | ${this.headTitle()}`
        }
    }
}
</script>
