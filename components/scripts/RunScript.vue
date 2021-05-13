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
                <v-icon>mdi-play-network-outline</v-icon>
            </v-btn>
        </template>
        <span>Run script</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'RunScript',
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
        }
    }
}
</script>
