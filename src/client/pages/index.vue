<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-card :elevation="getElevation" :outlined="getOutlined">
                <v-card-text>
                    <v-skeleton-loader
                        type="table-heading, paragraph, table-row-divider, sentences, button, table-tfoot"
                    />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'IndexPage',
    auth: false,
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined',
            getAlreadyVisited: 'settings/getAlreadyVisited'
        })
    },
    created() {
        this.changeRoute()
    },
    activated() {
        this.changeRoute()
    },
    methods: {
        ...mapActions({
            setAlreadyVisited: 'settings/setAlreadyVisited'
        }),
        async changeRoute() {
            // Clientside Init
            if (process.client) {
                // Getting 'visited' from persisted vuex-store
                // If its false, send to 'about' page. If its true, send to 'dashboard'
                if (this.getAlreadyVisited) {
                    this.$router.push('/dashboard')
                } else {
                    // Set value to true, so the next visit will bring the user directly to the 'dashboard'
                    this.setAlreadyVisited(true)
                    this.$router.push('/about')
                }
            }
        }
    }
}
</script>
