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
                @click="downloadScript"
            >
                <v-icon>{{ $icons.mdiCloudDownloadOutline }}</v-icon>
            </v-btn>
        </template>
        <span>Download {{ item.type === 'file' ? 'script' : 'folder' }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'DownloadScript',
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
        async downloadScript() {
            // Request download
            const url = '/scripts/download/'
            this.loading = true
            await this.$axios.get(url, {
                responseType: 'blob', // important
                params: this.item
            })
                .then((res) => {
                    try {
                        // Response header for filename + content type
                        const headerFileName = res.headers['content-disposition'] // 'x-suggested-filename'
                        const headerContentType = res.headers['content-type']

                        // Extracted file name
                        const fileName = headerFileName.match(/filename=".+"/gm).map((item) => {
                            return item.replace('filename="', '').replace('"', '') // extracting only the filename
                        })[0] // Returns array and tries to access the first item

                        console.log('Headers:', res.headers)
                        console.log('fileName:', fileName)

                        // Save File
                        const blob = new Blob([res.data], { type: headerContentType })
                        const link = document.createElement('a')
                        link.href = URL.createObjectURL(blob)
                        link.download = fileName
                        link.click()
                        URL.revokeObjectURL(link.href)
                    } catch (error) {
                        console.error(error)
                    }

                    // Let the user save the file.
                    // FileSaver.saveAs(res.data, effectiveFileName)

                    /*
                    const data = res.data
                    console.log('[Download Script] -> Read Script Data:', data)
                    if (data.error || data._status === 'error') {
                        throw new Error(data.info)
                    } else {
                        return data.script
                    }
                    */
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
