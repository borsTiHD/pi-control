<template>
    <v-app-bar clipped-left fixed app>
        <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
        <v-spacer />

        <app-update-chip />
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-cogs</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppUpdateChip from '~/components/display/AppUpdateChip.vue'

import pkg from '~~/package.json'
export default {
    name: 'Header',
    components: {
        AppUpdateChip
    },
    data() {
        return {
            title: `${pkg.productName}`
        }
    },
    computed: {
        ...mapGetters({
            isNewRelease: 'isNewRelease',
            getDrawer: 'layout/getDrawer',
            getRightDrawer: 'layout/getRightDrawer'
        }),
        drawer: {
            get() {
                return this.getDrawer
            },
            set(value) {
                this.setDrawer(value)
            }
        },
        rightDrawer: {
            get() {
                return this.getRightDrawer
            },
            set(value) {
                this.setRightDrawer(value)
            }
        }
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer',
            setRightDrawer: 'layout/setRightDrawer'
        })
    }
}
</script>
