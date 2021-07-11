<template>
    <v-navigation-drawer
        v-model="drawer"
        :floating="!getOutlined"
        clipped
        fixed
        app
    >
        <v-list nav>
            <v-list-item two-line>
                <v-list-item-avatar>🚀</v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>Application</v-list-item-title>
                    <v-list-item-subtitle>to the moon</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider class="pa-1" />
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
                        icon: 'mdi-monitor-dashboard',
                        title: 'Dashboard',
                        to: '/dashboard'
                    },
                    {
                        icon: 'mdi-car-cruise-control',
                        title: 'Processes',
                        to: '/processes'
                    },
                    {
                        icon: 'mdi-script-text-outline',
                        title: 'Scripts',
                        to: '/scripts'
                    },
                    {
                        icon: 'mdi-information-outline',
                        title: 'About',
                        to: '/about'
                    },
                    {
                        icon: 'mdi-cogs',
                        title: 'Settings',
                        to: '/settings'
                    }
                ])
            } else if (this.regAllowed) {
                items = items.concat([
                    {
                        icon: 'mdi-account-plus',
                        title: 'Register',
                        to: '/user/register'
                    },
                    {
                        icon: 'mdi-information-outline',
                        title: 'About',
                        to: '/about'
                    }
                ])
            } else {
                items = items.concat([
                    {
                        icon: 'mdi-account-check ',
                        title: 'Login',
                        to: '/user/login'
                    },
                    {
                        icon: 'mdi-information-outline',
                        title: 'About',
                        to: '/about'
                    }
                ])
            }

            // Hidden dev page
            if (process.env.dev) {
                items.push({
                    icon: 'mdi-bottle-tonic-skull-outline',
                    title: 'Developement',
                    to: '/dev'
                })
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
