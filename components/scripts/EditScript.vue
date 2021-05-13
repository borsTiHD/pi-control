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
            // User prompt for script data
            let error = false
            const scriptData = await this.$refs.editScript.show({
                name: 'test',
                ext: 'test',
                text: 'test'
            }).then((res) => res).catch((err) => {
                console.error('[New Script] -> User canceled.')
                console.error(err)
                error = true
                return err
            })
            if (error) return false

            console.log('scriptData:', scriptData)

            /*
            const url = '/execute'
            this.loading = true
            this.$axios.post(url, null, {
                params: {
                    script: this.item.path
                    // args: ['a', 'b', 'c']
                }
            })
                .then((res) => {
                    console.log('[Scripts] -> Executed Script:', res.data)
                    const data = res.data
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        this.$toast.info(`${data.info}\n${data.response.output === '' ? '' : `Output: ${data.response.output}`}`)
                    }
                }).catch((error) => {
                    this.$toast.error(error.message)
                    console.error(error)
                }).finally(() => {
                    this.loading = false
                })
            */
        }
    }
}
</script>
