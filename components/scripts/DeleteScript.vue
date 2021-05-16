<template>
    <v-tooltip top>
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                color="red"
                :loading="loading"
                :disabled="loading"
                v-bind="attrs"
                v-on="on"
                @click="deleteScript"
            >
                <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
        </template>
        <span>Delete {{ item.type === 'file' ? 'script' : 'folder' }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'DeleteScript',
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
        async deleteScript() {
            // Request file content over api call
            const url = '/scripts/delete'
            this.loading = true
            this.$axios.post(url, null, { params: this.item })
                .then((res) => {
                    this.$emit('deleted')
                    const data = res.data
                    console.log('[Delete Script] -> Script Delete Response:', data)
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        this.$toast.info(`Path: ${this.item.name}\n${data.info}`)
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
