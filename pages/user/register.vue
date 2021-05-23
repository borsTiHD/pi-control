<template>
    <v-row align="center" justify="center" class="mt-12">
        <v-col cols="12" md="6" lg="3">
            <v-card>
                <v-card-title class="headline">Registration</v-card-title>
                <v-card-text>
                    <authentication-form button-title="Register" :loading="loading" @submit="register" />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import AuthenticationForm from '@/components/forms/AuthentiactionForm'

export default {
    name: 'Register',
    auth: false,
    components: {
        AuthenticationForm
    },
    data: () => ({
        loading: false
    }),
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

                if (user) {
                    await this.$router.push('/admin')
                }
            } catch (error) {
                console.error('[Register] -> Failed to login:', error)
                this.$toast.error(error.response.data.message)
            }
            this.loading = false
        }
    }
}
</script>
