<template>
    <div>
        <span @click="getLatestRelease()">Version: {{ currentVersion }}</span>
        <span>Latest: {{ latestVersion }}</span>
    </div>
</template>

<script>
import pkg from '~~/package.json'

export default {
    name: 'AppVersion',
    data() {
        return {
            loading: false,
            latestRelease: null
        }
    },
    computed: {
        currentVersion() {
            return pkg.version
        },
        latestVersion() {
            if (this.latestRelease) {
                return this.latestRelease.name
            }
            return false
        }
    },
    methods: {
        getLatestRelease() {
            const url = 'https://api.github.com/repos/borsTiHD/pi-control/releases/latest'
            this.loading = true
            this.$axios.get(url)
                .then((res) => {
                    this.latestRelease = res.data
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
