<template>
    <v-tooltip left>
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                color="info"
                :loading="loading"
                :disabled="loading"
                v-bind="attrs"
                v-on="on"
                @click="addFolder"
            >
                <v-icon>{{ $icons.mdiFolderPlusOutline }}</v-icon>
            </v-btn>

            <!-- User prompt for new folder -->
            <script-prompt ref="userInput" />
        </template>
        <span>Add new folder</span>
    </v-tooltip>
</template>

<script>
import ScriptPrompt from '@/components/prompts/ScriptPrompt.vue'

export default {
    name: 'AddFolder',
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
        async addFolder() {
            // User prompt for script data
            let error = false
            const userData = await this.$refs.userInput.show({
                title: 'New Folder',
                mode: 'folder'
            }).then((res) => res).catch((err) => {
                console.error('[New Folder] -> User canceled.')
                console.error(err)
                error = true
                return err
            })
            if (error) return false

            // Post request
            const url = '/scripts/add/folder'
            this.loading = true
            this.$axios.post(url, { path: this.item.path, name: userData.name })
                .then((res) => {
                    this.$emit('added')
                    const data = res.data
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        console.log('[New Folder] -> Added new folder:', data)
                        this.$toast.info(`${data.info}`)
                    }
                }).catch((error) => {
                    this.$toast.error(error.message)
                    console.error(error)
                }).finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>
