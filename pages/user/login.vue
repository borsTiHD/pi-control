<template>
    <v-row align="center" justify="center" class="mt-12">
        <v-col v-if="$auth.loggedIn" cols="12" md="6" lg="6">
            <v-card>
                <v-card-title class="headline">Logged in</v-card-title>
                <v-card-text>
                    <v-alert
                        icon="mdi-shield-lock-outline"
                        prominent
                        text
                        type="info"
                    >
                        You are logged in as: {{ $auth.user.email }}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else cols="12" md="6" lg="3">
            <v-card>
                <v-card-title class="headline">Login</v-card-title>
                <v-card-text>
                    <authentication-form button-title="Submit" :loading="loading" @submit="login" />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import AuthenticationForm from '@/components/forms/AuthentiactionForm'

export default {
    name: 'Login',
    auth: false,
    components: {
        AuthenticationForm
    },
    data: () => ({
        loading: false
    }),
    methods: {
        async login(form) {
            this.loading = true
            try {
                console.log('[Login] -> Try to login user:', form)
                await this.$auth.loginWith('local', {
                    data: {
                        email: form.email,
                        password: form.password
                    }
                })
                this.$router.push('/dashboard')
            } catch (error) {
                console.error('[Login] -> Failed to login:', error)
                this.$toast.error(error.response.data.message)
            }
            this.loading = false
        }
    }
}
</script>
