<template>
    <div class="d-flex flex-column">
        <v-tooltip top>
            <template #activator="{ on, attrs }">
                <v-chip
                    class="ma-2 d-flex justify-center"
                    color="info"
                    outlined
                    pill
                    :close="$auth.loggedIn"
                    v-bind="attrs"
                    v-on="on"
                    @click:close="logoutUser"
                >
                    <v-icon left>{{ $icons.mdiAccountOutline }}</v-icon>
                    {{ $auth.loggedIn ? $auth.user.email : 'logged out' }}
                </v-chip>
            </template>
            <span>{{ $auth.loggedIn ? 'Click "x" to logout' : 'No user is currently logged in' }}</span>
        </v-tooltip>
    </div>
</template>

<script>

export default {
    name: 'LoggedInUser',
    computed: {
        loggedIn() {
            return !!this.$auth.loggedIn
        }
    },
    methods: {
        async logoutUser() {
            console.log('[Logout] -> User logout.')
            await this.$auth.logout(/* .... */)
        }
    }
}
</script>
