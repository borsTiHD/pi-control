<template>
    <v-tooltip
        v-if="isInstallable"
        left
    >
        <template #activator="{ on, attrs }">
            <v-chip
                class="mr-2"
                color="info"
                bordered
                small
                v-bind="attrs"
                v-on="on"
                @click="installPwa"
            >
                Add to Home Screen
            </v-chip>
        </template>
        <span>Install it as a PWA app and access it from your home screen</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'AppPwaChip',
    data() {
        return {
        }
    },
    computed: {
        isInstallable() {
            // If app is already installed, don't show install button
            if (this.$pwa.installed) {
                return false
            }
            return this.$pwa.installable
        }
    },
    methods: {
        installPwa() {
            this.$pwa.install().catch((err) => {
                this.$toast.error(err.message)
            })
        }
    }
}
</script>
