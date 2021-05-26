<template>
    <v-row align="center" justify="center" class="mt-12">
        <v-col cols="12" md="6" lg="3">
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
                const response = await this.$auth.loginWith('local', {
                    data: {
                        email: form.email,
                        password: form.password
                    }
                })
                console.log('RESULT:', response)
                // this.$toast.info(response.data.message)
            } catch (error) {
                console.error('[Login] -> Failed to login:', error)
                this.$toast.error(error.response.data.message)
            }
            this.loading = false
        }
    }
}
</script>
