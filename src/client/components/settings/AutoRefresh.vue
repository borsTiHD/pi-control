<template>
    <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
        <v-card-title class="headline">
            Auto Refresh
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-switch
                        :value="getAutoRefresh"
                        :input-value="getAutoRefresh"
                        label="Do you want to scan the data continuously?"
                        hide-details="auto"
                        inset
                        @change="updateAutoRefresh($event !== null, $event)"
                    />
                </v-col>
                <v-col cols="12">
                    <v-alert
                        text
                        dense
                        prominent
                        type="info"
                        icon="mdi-school"
                        class="mb-0"
                    >
                        Influences data collecting on the dashboard. If activated, several data (CPU, memory, temperature and uptime) are polled on a regular basis.
                    </v-alert>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'AutoRefresh',
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getAutoRefresh: 'settings/getAutoRefresh'
        })
    },
    methods: {
        ...mapActions({
            setAutoRefresh: 'settings/setAutoRefresh'
        }),
        updateAutoRefresh(value, event) {
            this.setAutoRefresh(value) // Set Vuex Store
        }
    }
}
</script>
