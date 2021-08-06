<template>
    <v-avatar>
        <img v-if="gravatar" :src="gravatar" alt="user profile image" @error="gravatarCheck = false">
        <v-icon v-else>
            {{ $icons.mdiAccountCircle }}
        </v-icon>
    </v-avatar>
</template>

<script>
export default {
    name: 'UserAvatar',
    data() {
        return {
            registrationAllowed: false,
            gravatarCheck: true
        }
    },
    computed: {
        gravatar() {
            // Checks if user is logged in
            // Also checks if gravatarCheck is still 'true' (changing on @error event)
            if (this.$auth.loggedIn && this.gravatarCheck) {
                const hash = this.$auth.user.emailMd5
                const defaultImage = '404'
                return `https://www.gravatar.com/avatar/${hash}?d=${defaultImage}`
            }
            return false
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
        }
    }
}
</script>
