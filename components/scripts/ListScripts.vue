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
            <v-row v-if="loadingScanFiles">
                <v-col cols="12">
                    <span>Scanning scripts...</span>
                    <v-progress-linear
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col>
                    <v-treeview
                        rounded
                        hoverable
                        open-on-click
                        open-all
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
                            <options-menu v-if="item.type === 'file' && isCustomScript(item.path)" :item="item" @edited="editedScript" @deleted="deletedScript" />
                            <!-- Info: File is locked for editing/deleting -->
                            <v-btn
                                v-if="item.type === 'file' && !isCustomScript(item.path)"
                                icon
                                color="primary"
                                disabled
                            >
                                <v-icon>mdi-lock-outline</v-icon>
                            </v-btn>
                        </template>
                    </v-treeview>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions v-if="!loadingScanFiles">
            <v-row>
                <v-col class="d-flex mx-3">
                    <add-script @added="addedScript" />
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import RunScript from '~/components/scripts/RunScript.vue'
import AddScript from '~/components/scripts/AddScript.vue'
import OptionsMenu from '~/components/scripts/OptionsMenu.vue'

export default {
    name: 'ListScripts',
    components: {
        RunScript,
        AddScript,
        OptionsMenu
    },
    data() {
        return {
            loadingScanFiles: false,
            items: [],
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
        isCustomScript(path) {
            // Validates folder structure
            // Returns true, if the custom path is in there
            return /^scripts\\custom\\/gm.test(path) /* win path */ || /^scripts\/custom\//gm.test(path) /* linux path */
        },
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
        },
        addedScript() {
            // Scanning all files again after a new script added
            this.scanFiles()
        },
        editedScript() {
            // Scanning all files again after a script got edited
            this.scanFiles()
        },
        deletedScript() {
            // Scanning all files again after a script got deleted
            this.scanFiles()
        }
    }
}
</script>
