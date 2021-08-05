<template>
    <v-navigation-drawer
        v-model="drawer"
        :floating="!getOutlined"
        clipped
        fixed
        app
    >
        <v-list nav>
            <v-list-item-group
                v-model="selectedItem"
                color="primary"
            >
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                </v-list-item>

                <!-- Hidden dev page -->
                <v-divider v-if="$config.dev" class="pa-1" />
                <v-list-item v-if="$config.dev" to="/dev" router exact>
                    <v-list-item-action>
                        <v-icon>{{ $icons.mdiBottleTonicSkullOutline }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            Developement
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Sidebar',
    data: () => ({
        regAllowed: false,
        selectedItem: 1
    }),
    computed: {
        ...mapGetters({
            getOutlined: 'settings/getOutlined',
            getDrawer: 'layout/getDrawer'
        }),
        items() {
            let items = []

            // Checks if User is logged in, or if login/register is possible
            if (this.$auth.loggedIn) {
                items = items.concat([
                    {
                        icon: this.$icons.mdiMonitorDashboard,
                        title: 'Dashboard',
                        to: '/dashboard'
                    },
                    {
                        icon: this.$icons.mdiCarCruiseControl,
                        title: 'Processes',
                        to: '/processes'
                    },
                    {
                        icon: this.$icons.mdiConsole,
                        title: 'Terminal',
                        to: '/terminal'
                    },
                    {
                        icon: this.$icons.mdiScriptTextOutline,
                        title: 'Scripts',
                        to: '/scripts'
                    },
                    {
                        icon: this.$icons.mdiInformationOutline,
                        title: 'About',
                        to: '/about'
                    },
                    {
                        icon: this.$icons.mdiCogs,
                        title: 'Settings',
                        to: '/settings'
                    }
                ])
            } else if (this.regAllowed) {
                items = items.concat([
                    {
                        icon: this.$icons.mdiAccountPlus,
                        title: 'Register',
                        to: '/user/register'
                    },
                    {
                        icon: this.$icons.mdiInformationOutline,
                        title: 'About',
                        to: '/about'
                    }
                ])
            } else {
                items = items.concat([
                    {
                        icon: this.$icons.mdiAccountCheck,
                        title: 'Login',
                        to: '/user/login'
                    },
                    {
                        icon: this.$icons.mdiInformationOutline,
                        title: 'About',
                        to: '/about'
                    }
                ])
            }

            return items
        },
        drawer: {
            get() {
                return this.getDrawer
            },
            set(value) {
                this.setDrawer(value)
            }
        }
    },
    created() {
        if (process.client) {
            this.isRegistrationAllowed()
        }
    },
    activated() {
        this.isRegistrationAllowed()
    },
    methods: {
        ...mapActions({
            setDrawer: 'layout/setDrawer'
        }),
        isRegistrationAllowed() {
            // Checks if users are existing
            this.$axios.get('/auth/registered-users')
                .then((res) => {
                    this.regAllowed = res.data.registration
                })
        }
    }
}
</script>
