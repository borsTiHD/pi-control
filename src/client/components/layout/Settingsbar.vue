<template>
    <v-navigation-drawer v-model="rightDrawer" right temporary app>
        <v-list class="d-flex flex-column justify-space-between fill-height" nav>
            <div>
                <v-list-item>
                    <v-list-item-avatar>
                        <v-icon>{{ $icons.mdiCogs }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title class="title">Quick Settings</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider class="pa-1" />

                <v-list-item @click="changeDarkMode">
                    <v-list-item-action>
                        <v-icon>
                            {{ darkMode ? $icons.mdiWeatherSunny : $icons.mdiWeatherNight }}
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                        {{ darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
                    </v-list-item-title>
                </v-list-item>

                <v-list-item v-if="$auth.loggedIn" @click="logoutUser">
                    <v-list-item-action>
                        <v-icon>{{ $icons.mdiAccountArrowLeft }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
            </div>

            <div class="mt-auto">
                <v-list-item>
                    <v-list-item-content>
                        <logged-in-user />
                    </v-list-item-content>
                </v-list-item>

                <v-divider class="pa-1" />

                <v-list-item>
                    <v-list-item-content>
                        <app-version />
                    </v-list-item-content>
                </v-list-item>
            </div>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import AppVersion from '~/components/display/AppVersion.vue'
import LoggedInUser from '~/components/display/LoggedInUser.vue'

export default {
    name: 'Settingsbar',
    components: {
        AppVersion,
        LoggedInUser
    },
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
            setDarkMode: 'settings/setDarkMode',
            setRightDrawer: 'layout/setRightDrawer'
        }),
        changeDarkMode() {
            const newMode = !this.darkMode
            this.setDarkMode(newMode)
            this.$vuetify.theme.dark = newMode
        },
        async logoutUser() {
            console.log('[Logout] -> User logout.')
            await this.$auth.logout(/* .... */)
        }
    }
}
</script>
