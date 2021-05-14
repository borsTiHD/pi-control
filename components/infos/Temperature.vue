<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-thermometer
            </v-icon>
            Temperature
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <v-btn
                        icon
                        color="primary"
                        class="ml-2"
                        :loading="loading"
                        :disabled="loading"
                        v-bind="attrs"
                        v-on="on"
                        @click="scanFiles"
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
                </template>
                <span>Rescan</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <v-row v-if="loading">
                <v-col cols="12">
                    <span>Collecting data...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    {{ temp }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import path from 'path'

export default {
    name: 'Temperature',
    data() {
        return {
            loading: false,
            temp: false,
            scripts: {
                temp: path.join('server', 'misc', 'SoC temp in celsius.sh')
            }
        }
    },
    async created() {
        this.scanFiles()
    },
    methods: {
        async scanFiles() {
            // Collecting data
            this.loading = true
            this.temp = await this.$runScript(this.scripts.temp).catch((error) => {
                console.error(error)
            })
            this.loading = false
        }
    }
}
</script>
