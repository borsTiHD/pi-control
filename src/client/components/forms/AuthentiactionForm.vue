<template>
    <v-form
        ref="form"
        v-model="form.valid"
        lazy-validation
        @submit.prevent="onSubmit"
    >
        <v-text-field
            v-model="form.email"
            :rules="[ emailRules ]"
            label="E-mail"
            required
        />

        <v-text-field
            v-model="form.password"
            :counter="20"
            :rules="[ passwordRules ]"
            :type="'password'"
            label="Password"
            required
        />

        <v-btn
            :disabled="btnDisabled"
            :loading="loading"
            color="primary"
            class="mt-2"
            type="submit"
        >
            {{ buttonTitle }}
        </v-btn>
    </v-form>
</template>

<script>
export default {
    name: 'AuthenticationForm',
    props: {
        buttonTitle: {
            type: String,
            required: true,
            default: ''
        },
        loading: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    data: () => ({
        form: {
            valid: null,
            email: '',
            password: ''
        }
    }),
    computed: {
        btnDisabled() {
            // Disable button if parent component is 'loading', or form is 'not valid'
            if (!this.form.valid || this.loading) return true
            return false
        }
    },
    mounted() {
        this.cleaning()
    },
    methods: {
        cleaning() {
            // Default settings
            this.form.valid = false
            this.form.email = ''
            this.form.password = ''
        },
        emailRules(v) {
            if (!v) return 'E-mail is required'
            return /(.+@.+\..+|^admin$|^dev$)/.test(v) || 'E-mail must be valid'
        },
        passwordRules(v) {
            if (!v) return 'Password is required'
            return (v.length >= 4 && v.length <= 20) || 'Password must be at least 4 and less than 20 characters long'
        },
        onSubmit() {
            if (this.$refs.form.validate()) {
                this.form.finish = true
                this.$emit('submit', this.form)
            }
        }
    }
}
</script>
