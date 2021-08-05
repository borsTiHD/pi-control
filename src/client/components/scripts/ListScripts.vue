<template>
    <v-card :elevation="getElevation" :outlined="getOutlined">
        <v-card-title class="headline d-flex">
            <span class="mr-auto">
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
                            <v-icon>{{ $icons.mdiCached }}</v-icon>
                        </v-btn>
                    </template>
                    <span>Rescan scripts</span>
                </v-tooltip>
            </span>
            <add-script v-if="!loadingScanFiles" @added="addedScript" />
        </v-card-title>
        <v-card-text v-if="!loadingScanFiles">
            <v-text-field
                v-model="search"
                label="Search Files"
                flat
                solo-inverted
                hide-details
                clearable
                :clear-icon="$icons.mdiCloseCircleOutline"
            />
            <v-checkbox
                v-model="caseSensitive"
                color="secondary"
                hide-details
                label="Case sensitive search"
            />
        </v-card-text>
        <v-divider class="mx-4" />
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
                                {{ item.type === 'folder' ? $icons.mdiFolder : $icons.mdiFileOutline }}
                            </v-icon>
                        </template>
                        <template #append="{ item }">
                            <run-script v-if="item.type === 'file'" :item="item" />
                            <add-folder v-if="item.type === 'folder' && isCustomScript(item.path) || item.name === 'custom'" :item="item" @added="addedFolder" />
                            <add-script v-if="item.type === 'folder' && isCustomScript(item.path) || item.name === 'custom'" :item="item" type="small" @added="addedFolder" />
                            <options-menu v-if="(isCustomScript(item.path)) || item.name === 'custom'" :item="item" @edited="editedScript" @deleted="deletedScript" />
                            <!-- Info: File is locked for editing/deleting -->
                            <v-btn
                                v-if="!isCustomScript(item.path) && item.name !== 'custom'"
                                icon
                                color="primary"
                                disabled
                            >
                                <v-icon>{{ $icons.mdiLockOutline }}</v-icon>
                            </v-btn>
                        </template>
                    </v-treeview>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

import RunScript from '~/components/scripts/RunScript.vue'
import AddScript from '~/components/scripts/AddScript.vue'
import AddFolder from '~/components/scripts/AddFolder.vue'
import OptionsMenu from '~/components/scripts/OptionsMenu.vue'

export default {
    name: 'ListScripts',
    components: {
        RunScript,
        AddScript,
        AddFolder,
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
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        }),
        filter() {
            return this.caseSensitive
                ? (item, search, textKey) => item[textKey].includes(search)
                : undefined
        }
    },
    created() {
        if (process.client) {
            this.scanFiles()
        }
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
        addedFolder() {
            // Scanning all files again after a new folder added
            this.scanFiles()
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
