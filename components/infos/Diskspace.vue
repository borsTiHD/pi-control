<template>
    <v-card class="flex d-flex flex-column">
        <v-card-title class="headline">
            <v-icon
                large
                color="primary"
                class="mr-2"
            >
                mdi-micro-sd
            </v-icon>
            Diskspace
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
                    {{ disk }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import path from 'path'

export default {
    name: 'Diskspace',
    data() {
        return {
            loading: false,
            disk: false,
            scripts: {
                disk: path.join('server', 'disk', 'df.sh')
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
            this.disk = await this.$runScript(this.scripts.disk).catch((error) => {
                console.error(error)
            })
            this.loading = false
        }
    }
}
</script>
