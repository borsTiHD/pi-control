<template>
    <v-navigation-drawer v-model="rightDrawer" right temporary app>
        <v-list nav>
            <v-list-item>
                <v-list-item-avatar>
                    <v-icon>mdi-cogs</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="title">Quick Settings</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="pa-1" />

            <v-list-item @click="changeDarkMode">
                <v-list-item-action>
                    <v-icon>
                        {{ darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
                    </v-icon>
                </v-list-item-action>
                <v-list-item-title>
                    {{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            getRightDrawer: 'layout/getRightDrawer'
        }),
        rightDrawer: {
            get() {
                return this.getRightDrawer
            },
            set(value) {
                this.setRightDrawer(value)
            }
        },
        darkMode() {
            return this.$vuetify.theme.dark
        }
    },
    methods: {
        ...mapActions({
            setRightDrawer: 'layout/setRightDrawer'
        }),
        changeDarkMode() {
            if (this.darkMode) {
                this.$idb.putKeyValue('userSettings', 'preference', 'darkMode', false)
                this.$vuetify.theme.dark = false
            } else {
                this.$idb.putKeyValue('userSettings', 'preference', 'darkMode', true)
                this.$vuetify.theme.dark = true
            }
        }
    }
}
</script>
