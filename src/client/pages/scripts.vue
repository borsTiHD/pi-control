<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <list-scripts />
        </v-col>
    </v-row>
</template>

<script>
import ListScripts from '~/components/scripts/ListScripts.vue'

export default {
    name: 'ScriptsPage',
    components: {
        ListScripts
    },
    head() {
        return {
            title: `${this.$options.name} | ${this.headTitle()}`
        }
    }
}
</script>
