<template>
    <div class="d-flex flex-column">
        <v-tooltip top>
            <template #activator="{ on, attrs }">
                <v-chip
                    class="ma-2 d-flex justify-center"
                    :color="isUpToDate ? 'primary' : 'yellow'"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                    @click="goToNewRelease"
                >
                    <v-btn
                        v-if="loading"
                        icon
                        color="primary"
                        class="ml-2"
                        loading
                        disabled
                    >
                        <v-icon>mdi-cached</v-icon>
                    </v-btn>
                    <v-icon v-else left>
                        mdi-server-plus
                    </v-icon>
                    <span>{{ currentVersion }}</span>
                </v-chip>
            </template>
            <span>{{ isUpToDate ? 'App is up to date' : 'Newer version available' }}</span>
        </v-tooltip>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

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
            return `v.${pkg.version}`
        },
        latestVersion() {
            if (this.latestRelease) {
                return this.latestRelease.name
            }
            return false
        },
        isUpToDate() {
            // If latest version was succesfully fetched and it is not equal installed version it returns false
            if (this.latestVersion && this.currentVersion !== this.latestVersion) {
                this.setNewRelease(true) // Set 'newRelease' flag in store
                return false // Not up to date
            }
            this.setNewRelease(false) // Set 'newRelease' flag in store
            return true // App is up to date
        }
    },
    created() {
        // Fetching latest version from github repo
        this.getLatestRelease()
    },
    methods: {
        ...mapActions({
            setNewRelease: 'setNewRelease'
        }),
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
        },
        goToNewRelease() {
            if (!this.isUpToDate) {
                window.open(this.latestRelease.html_url, '_blank')
            }
        }
    }
}
</script>
