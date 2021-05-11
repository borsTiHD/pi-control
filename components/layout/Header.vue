<template>
    <v-app-bar clipped-left fixed app>
        <v-btn icon @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title style="cursor: pointer" @click="$router.push('/')" v-text="title" />
        <v-spacer />
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-cogs</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import pkg from '~~/package.json'
export default {
    data() {
        return {
            title: `${pkg.productName}`
        }
    },
    computed: {
        ...mapGetters({
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
