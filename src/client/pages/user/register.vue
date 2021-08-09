<template>
    <v-row align="center" justify="center" class="mt-12">
        <v-col v-if="regAllowed" cols="12" md="6" lg="3">
            <v-card :elevation="getElevation" :outlined="getOutlined">
                <v-card-title class="headline">Registration</v-card-title>
                <v-card-text>
                    <authentication-form button-title="Register" :loading="loading" @submit="register" />
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else-if="$auth.loggedIn" cols="12" md="6" lg="6">
            <v-card :elevation="getElevation" :outlined="getOutlined">
                <v-card-title class="headline">Logged in</v-card-title>
                <v-card-text>
                    <v-alert
                        :icon="$icons.mdiShieldLockOutline"
                        prominent
                        text
                        type="info"
                    >
                        Registration not available, already logged in: {{ $auth.user.email }}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else cols="12" md="6" lg="6">
            <v-card :elevation="getElevation" :outlined="getOutlined">
                <v-card-title class="headline">Registration not available</v-card-title>
                <v-card-text>
                    <v-alert
                        :icon="$icons.mdiShieldLockOutline"
                        prominent
                        text
                        type="error"
                    >
                        Already a user account registered. No more registrations allowed right now.
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import AuthenticationForm from '@/components/forms/AuthentiactionForm.vue'

export default {
    name: 'Register',
    auth: false,
    components: {
        AuthenticationForm
    },
    data: () => ({
        loading: false,
        regAllowed: false
    }),
    head() {
        return {
            title: `${this.$options.name} | ${this.headTitle()}`
        }
    },
    computed: {
        ...mapGetters({
            getElevation: 'settings/getElevation',
            getOutlined: 'settings/getOutlined'
        })
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
        async register(form) {
            this.loading = true
            try {
                // Register User
                console.log('[Register] -> Try to register user:', form)
                await this.$axios.post('/auth/register', {
                    email: form.email,
                    password: form.password
                })

                // Login User
                const user = await this.$auth.loginWith('local', {
                    data: {
                        email: form.email,
                        password: form.password
                    }
                })
                this.$toast.info(user.data.message)

                // Pushes user to dashboard route
                if (user) {
                    await this.$router.push('/dashboard')
                }
            } catch (error) {
                console.error('[Register] -> Failed to login:', error)
                const message = error.response.data.message || error.message || 'Unknown error has occurred'
                this.$toast.error(message)
            }
            this.loading = false
        },
        isRegistrationAllowed() {
            this.$axios.get('/auth/registered-users')
                .then((res) => {
                    this.regAllowed = res.data.registration
                })
        }
    }
}
</script>
