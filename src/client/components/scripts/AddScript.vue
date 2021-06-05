<template>
    <v-tooltip left>
        <template #activator="{ on, attrs }">
            <v-btn
                :icon="type !== 'big'"
                color="primary"
                :loading="loading"
                :disabled="loading"
                v-bind="attrs"
                v-on="on"
                @click="addScript"
            >
                {{ type === 'big' ? 'Add Script' : '' }}
                <v-icon>mdi-file-plus-outline</v-icon>
            </v-btn>

            <!-- User prompt for new script -->
            <script-prompt ref="userInput" />
        </template>
        <span>Add new script</span>
    </v-tooltip>
</template>

<script>
import path from 'path'

import ScriptPrompt from '@/components/prompts/ScriptPrompt.vue'

export default {
    name: 'AddScript',
    components: {
        ScriptPrompt
    },
    props: {
        item: {
            type: Object,
            required: false,
            default: () => {
                return {}
            }
        },
        type: {
            type: String,
            required: false,
            default: 'big'
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        async addScript() {
            // User prompt for script data
            let error = false
            const scriptData = await this.$refs.userInput.show().then((res) => res).catch((err) => {
                console.error('[New Script] -> User canceled.')
                console.error(err)
                error = true
                return err
            })
            if (error) return false

            // Path if given, or default
            const fullPath = this.item?.path || path.join('scripts', 'custom')

            // Post request
            const url = '/scripts/add/file'
            this.loading = true
            this.$axios.post(url, { path: fullPath, script: scriptData })
                .then((res) => {
                    this.$emit('added')
                    const data = res.data
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        console.log('[New Script] -> Added new script:', data)
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
