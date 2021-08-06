<template>
    <v-app-bar
        scroll-target="#container"
        elevate-on-scroll
        clipped-left
        app
    >
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
        <v-spacer />

        <app-pwa-chip />
        <app-update-chip />
        <donate-chip />
        <user-menu />
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import pkg from 'projRoot/package.json'
import AppUpdateChip from '~/components/display/AppUpdateChip.vue'
import AppPwaChip from '~/components/display/AppPwaChip.vue'
import DonateChip from '~/components/display/DonateChip.vue'
import UserMenu from '~/components/display/UserMenu.vue'

export default {
    name: 'Header',
    components: {
        AppUpdateChip,
        AppPwaChip,
        DonateChip,
        UserMenu
    },
    data() {
        return {
            title: `${pkg.productName}`
        }
    },
    computed: {
        ...mapGetters({
            isNewRelease: 'isNewRelease',
            getDrawer: 'layout/getDrawer'
        }),
        drawer: {
            get() {
                return this.getDrawer
            },
            set(value) {
                this.setDrawer(value)
            }
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer'
        })
    }
}
</script>
