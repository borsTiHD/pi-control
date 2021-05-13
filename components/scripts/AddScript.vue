<template>
    <div>
        <v-tooltip bottom>
            <template #activator="{ on, attrs }">
                <v-btn
                    color="primary"
                    :loading="loading"
                    :disabled="loading"
                    v-bind="attrs"
                    v-on="on"
                    @click="addScript"
                >
                    Add Script
                    <v-icon>mdi-file-plus-outline</v-icon>
                </v-btn>
            </template>
            <span>Add custom script</span>
        </v-tooltip>

        <!-- User prompt for new script -->
        <new-script-prompt ref="userInput" />
    </div>
</template>

<script>
import NewScriptPrompt from '@/components/prompts/NewScriptPrompt.vue'

export default {
    name: 'AddScript',
    components: {
        NewScriptPrompt
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
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

            // Post request
            const url = '/scripts/add'
            this.loading = true
            this.$axios.post(url, scriptData)
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
