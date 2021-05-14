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
        async runScript() {
            this.loading = true
            try {
                const data = await this.$runScript(this.item.path /* , ['a', 'b', 'c'] */)
                this.$toast.info(`Script executed.\n${data === '' ? '' : `Output: ${data}`}`)
            } catch (error) {
                console.error(error)
            }
            this.loading = false
        }
    }
}
</script>
