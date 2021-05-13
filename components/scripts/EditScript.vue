<template>
    <div>
        <v-tooltip left>
            <template #activator="{ on, attrs }">
                <v-btn
                    icon
                    color="info"
                    :loading="loading"
                    :disabled="loading"
                    v-bind="attrs"
                    v-on="on"
                    @click="editScript"
                >
                    <v-icon>mdi-file-edit-outline</v-icon>
                </v-btn>
            </template>
            <span>Edit script</span>
        </v-tooltip>

        <!-- User prompt for new script -->
        <script-prompt ref="editScript" />
    </div>
</template>

<script>
import ScriptPrompt from '@/components/prompts/ScriptPrompt.vue'

export default {
    name: 'EditScript',
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
        async editScript() {
            // Error flag
            let error = false

            // Request file content over api call
            const url = '/scripts/read'
            this.loading = true
            const script = await this.$axios.get(url, { params: this.item })
                .then((res) => {
                    const data = res.data
                    console.log('[Edit Script] -> Read Script Data:', data)
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        return data.script
                    }
                }).catch((error) => {
                    this.$toast.error(error.message)
                    console.error(error)
                    error = true
                }).finally(() => {
                    this.loading = false
                })
            if (error) return false

            // Split filename
            const file = script.name.split('.')

            // User prompt for script data
            const scriptData = await this.$refs.editScript.show({
                name: file[0],
                ext: file[1],
                text: script.content
            }).then((res) => res).catch((err) => {
                console.error('[Edit Script] -> User canceled.')
                console.error(err)
                error = true
                return err
            })
            if (error) return false

            console.log('scriptData:', scriptData)
        }
    }
}
</script>
