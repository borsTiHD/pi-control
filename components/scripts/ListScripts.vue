<template>
    <v-card>
        <v-card-title class="headline">
            Scripts
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <v-btn
                        icon
                        color="primary"
                        class="ml-2"
                        :loading="loadingScanFiles"
                        :disabled="loadingScanFiles"
                        v-bind="attrs"
                        v-on="on"
                        @click="scanFiles"
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
                </template>
                <span>Rescan scripts</span>
            </v-tooltip>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col v-for="(file, index) in fileList" :key="index" cols="12">
                    <span>{{ file }}</span>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            loadingScanFiles: false,
            fileList: []
        }
    },
    created() {
        this.scanFiles()
    },
    methods: {
        scanFiles() {
            const url = '/scripts/list'
            this.loadingScanFiles = true
            this.$axios.get(url)
                .then((res) => {
                    console.log('[Scripts] -> Files scant:', res.data)
                    this.fileList = res.data.scripts
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    this.loadingScanFiles = false
                })
        }
    }
}
</script>
