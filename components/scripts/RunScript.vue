<template>
    <v-tooltip left>
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                color="green"
                :loading="loading"
                :disabled="loading"
                v-bind="attrs"
                v-on="on"
                @click="runScript"
            >
                <v-icon>mdi-play-protected-content</v-icon>
            </v-btn>
        </template>
        <span>Run script</span>
    </v-tooltip>
</template>

<script>
export default {
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
    computed: {
    },
    methods: {
        runScript() {
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
                    this.$toast.info(`${data.info}\n${data.response.output === '' ? '' : `Output: ${data.response.output}`}`)
                }).catch((error) => {
                    this.$toast.error(error)
                    console.error(error)
                }).finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>
