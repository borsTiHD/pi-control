<template>
    <v-tooltip top>
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                color="info"
                :loading="loading"
                :disabled="loading"
                v-bind="attrs"
                v-on="on"
                @click="editFolder"
            >
                <v-icon>{{ $icons.mdiFolderEditOutline }}</v-icon>
            </v-btn>

            <!-- User prompt for user data -->
            <script-prompt ref="editFolder" />
        </template>
        <span>Edit folder</span>
    </v-tooltip>
</template>

<script>
import ScriptPrompt from '@/components/prompts/ScriptPrompt.vue'

export default {
    name: 'EditFolder',
    components: {
        ScriptPrompt
    },
    props: {
        item: {
            type: Object,
            required: true,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async editFolder() {
            // Error flag
            let error = false

            // Request file content over api call
            const urlRead = '/scripts/read'
            this.loading = true
            const folder = await this.$axios.get(urlRead, { params: this.item })
                .then((res) => {
                    const data = res.data
                    console.log('[Edit Folder] -> Read Folder Data:', data)
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        return data.folder
                    }
                }).catch((error) => {
                    this.$toast.error(error.message)
                    console.error(error)
                    error = true
                }).finally(() => {
                    this.loading = false
                })
            if (error) return false

            // User prompt for folder data
            const userData = await this.$refs.editFolder.show({
                title: 'Edit folder',
                mode: 'folder',
                input: {
                    name: folder.name
                }
            }).then((res) => res).catch((err) => {
                console.error('[Edit Folder] -> User canceled.')
                console.error(err)
                error = true
                return err
            })
            if (error) return false

            // Creates params for request
            const params = {
                oldFolder: this.item,
                newFolder: {
                    name: userData.name
                }
            }

            console.log('params:', params)

            // Request file content over api call
            const urlEdit = '/scripts/edit/folder'
            this.loading = true
            this.$axios.post(urlEdit, null, { params })
                .then((res) => {
                    this.$emit('edited')
                    const data = res.data
                    console.log('[Edit Folder] -> Folder Edited Response:', data)
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        this.$toast.info(`${this.item.name}\n${data.info}`)
                    }
                }).catch((error) => {
                    this.$toast.error(error.message)
                    console.error(error)
                    error = true
                }).finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>
