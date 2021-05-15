<template>
    <v-card class="flex d-flex flex-column">
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
                        Influences the data on the info page. If activated CPU, memory and temperature data are polled on a regular basis.
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
