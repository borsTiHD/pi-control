<template>
    <v-row v-if="getAlerts.length > 0" justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <div id="alerts" class="mb-n3">
                <show-alert v-for="(alert, key, index) in indexedAlerts" :key="index" :data="alert" />
            </div>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

import ShowAlert from '@/components/alerts/ShowAlert.vue'

export default {
    name: 'ListAlerts',
    components: {
        ShowAlert
    },
    computed: {
        ...mapGetters({
            getAlerts: 'alerts/getAlerts'
        }),
        indexedAlerts() {
            if (this.getAlerts) {
                return this.getAlerts.map((item, index) => ({
                    index,
                    ...item
                }))
            }
            return []
        }
    }
}
</script>

<style scoped>
</style>
