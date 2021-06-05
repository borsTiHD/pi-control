<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-card>
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
export default {
    name: 'Index',
    auth: false,
    created() {
        this.changeRoute()
    },
    activated() {
        this.changeRoute()
    },
    methods: {
        async changeRoute() {
            // Clientside Init + Loading iDB data
            if (process.client) {
                // Getting 'visited' from iDB
                const alreadyVisited = await this.$idb.getKeyValue('userSettings', 'preference', 'visited')
                // If its false, send to 'about' page. If its true, send to 'dashboard'
                if (alreadyVisited) {
                    this.$router.push('/dashboard')
                } else {
                    // Set value to true, so the next visit will bring the user directly to the 'dashboard'
                    this.$idb.putKeyValue('userSettings', 'preference', 'visited', true)
                    this.$router.push('/about')
                }
            }
        }
    }
}
</script>
