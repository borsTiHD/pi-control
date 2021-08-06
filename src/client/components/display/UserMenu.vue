<template>
    <v-menu
        bottom
        min-width="200px"
        rounded
        offset-y
    >
        <template #activator="{ on }">
            <v-btn
                class="ml-4"
                icon
                x-large
                v-on="on"
            >
                <v-avatar>
                    <v-icon>
                        {{ $icons.mdiAccountCircle }}
                    </v-icon>
                </v-avatar>
            </v-btn>
        </template>
        <v-card>
            <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                    <v-avatar>
                        <v-icon>
                            {{ $icons.mdiAccountCircle }}
                        </v-icon>
                    </v-avatar>
                    <p class="text-caption mt-1">{{ $auth.loggedIn ? $auth.user.email : 'currently not logged in' }}</p>
                    <v-divider class="my-3" />
                    <v-btn
                        depressed
                        rounded
                        text
                        @click="loginButtonAction"
                    >
                        {{ loginButtonText }}
                    </v-btn>
                </div>
            </v-list-item-content>
        </v-card>
    </v-menu>
</template>

<script>
// import AppButton from '@/components/Button.vue'

export default {
    name: 'UserMenu',
    components: {
        // AppButton
    },
    data() {
        return {
            registrationAllowed: false
        }
    },
    computed: {
        loginButtonText() {
            if (this.$auth.loggedIn) {
                return 'Logout'
            } else if (this.registrationAllowed) {
                return 'Sign up'
            }
            return 'Login'
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
        isRegistrationAllowed() {
            // Checks if users are existing
            this.$axios.get('/auth/registered-users')
                .then((res) => {
                    // No user is registered if 'registration' is set to true
                    // therefore no login can be made and we redirect the user to the registration page
                    const regAllowed = res.data.registration
                    this.registrationAllowed = regAllowed
                })
        },
        loginButtonAction() {
            if (this.$auth.loggedIn) {
                // User is logged in and wants to logout
                this.userLogout()
            } else if (this.registrationAllowed) {
                // User is not logged in and no user is registered yet
                this.$router.push('/user/register')
            } else {
                // User is not logged in but could login (already users registered)
                this.$router.push('/user/login')
            }
        },
        async userLogout() {
            console.log('[Logout] -> User logout.')
            await this.$auth.logout(/* .... */)
        }
    }
}
</script>
