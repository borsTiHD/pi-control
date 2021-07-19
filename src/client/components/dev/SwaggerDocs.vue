<template>
    <v-card :elevation="getElevation" :outlined="getOutlined">
        <v-card-title class="headline">Swagger Api Docs</v-card-title>
        <v-card-actions>
            <v-btn @click="swaggerBtn">
                Go to Swagger Docs
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Swagger',
    data() {
        return {
            loadingTestBtn: false,
            loadingHelpBtn: false
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
    },
    methods: {
        swaggerBtn() {
            // const swagger = `http://${this.$config.HOST_IP}:${this.$config.PORT_BACKEND}/api-docs/` // From Dev values
            const swagger = this.$axios.defaults.baseURL.replace('/api/v1', '/api-docs') // Axios baseURL
            window.open(swagger, '_blank')
        }
    }
}
</script>
