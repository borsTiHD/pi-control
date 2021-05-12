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
        <v-sheet class="pa-4 primary">
            <v-text-field
                v-model="search"
                label="Search Files"
                dark
                flat
                solo-inverted
                hide-details
                clearable
                clear-icon="mdi-close-circle-outline"
            />
            <v-checkbox
                v-model="caseSensitive"
                color="secondary"
                dark
                hide-details
                label="Case sensitive search"
            />
        </v-sheet>
        <v-card-text>
            <v-row v-if="items !== null">
                <v-col>
                    <v-treeview
                        rounded
                        hoverable
                        open-on-click
                        :items="items"
                        :search="search"
                        :filter="filter"
                        :open.sync="open"
                    >
                        <template #prepend="{ item }">
                            <v-icon>
                                {{ item.type === 'folder' ? 'mdi-folder' : 'mdi-file-outline' }}
                            </v-icon>
                        </template>
                        <template #append="{ item }">
                            <run-script v-if="item.type === 'file'" :item="item" />
                        </template>
                    </v-treeview>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <span>Scanning scripts...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import RunScript from '~/components/scripts/RunScript.vue'

export default {
    components: {
        RunScript
    },
    data() {
        return {
            loadingScanFiles: false,
            items: null,
            open: [1, 2],
            search: null,
            caseSensitive: false
        }
    },
    computed: {
        filter() {
            return this.caseSensitive
                ? (item, search, textKey) => item[textKey].includes(search)
                : undefined
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
                    this.items = res.data.scripts.children
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    this.loadingScanFiles = false
                })
        }
    }
}
</script>
