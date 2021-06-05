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
                @click="editScript"
            >
                <v-icon>mdi-file-edit-outline</v-icon>
            </v-btn>

            <!-- User prompt for new script -->
            <script-prompt ref="editScript" />
        </template>
        <span>Edit script</span>
    </v-tooltip>
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
            const urlRead = '/scripts/read'
            this.loading = true
            const script = await this.$axios.get(urlRead, { params: this.item })
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
                title: 'Edit Script',
                input: {
                    name: file[0],
                    ext: file[1],
                    text: script.content
                }
            }).then((res) => res).catch((err) => {
                console.error('[Edit Script] -> User canceled.')
                console.error(err)
                error = true
                return err
            })
            if (error) return false

            // Creates params for request
            const params = {
                oldFile: this.item,
                newFile: {
                    name: `${scriptData.name}.${scriptData.ext}`,
                    content: scriptData.text
                }
            }

            // Request file content over api call
            const urlEdit = '/scripts/edit/file'
            this.loading = true
            this.$axios.post(urlEdit, null, { params })
                .then((res) => {
                    this.$emit('edited')
                    const data = res.data
                    console.log('[Edit Script] -> Script Edited Response:', data)
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
