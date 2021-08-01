<template>
    <v-row justify="center">
        <v-col class="d-flex flex-column">
            <v-card :elevation="getElevation" :outlined="getOutlined" class="flex d-flex flex-column">
                <v-card-title class="headline">
                    <v-icon
                        large
                        color="primary"
                        class="mr-2"
                    >
                        mdi-console
                    </v-icon>
                    Terminal
                </v-card-title>

                <v-card-text>
                    xxx
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Terminal',
    data() {
        return {
            socketRoom: 'terminal'
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
    }
}
</script>
