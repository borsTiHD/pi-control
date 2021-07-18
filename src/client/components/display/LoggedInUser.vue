<template>
    <div class="d-flex flex-column">
        <v-tooltip top>
            <template #activator="{ on, attrs }">
                <v-chip
                    class="ma-2 d-flex justify-center"
                    color="info"
                    outlined
                    pill
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon left>
                        mdi-account-outline
                    </v-icon>
                    <span>{{ $auth.loggedIn ? $auth.user.email : 'logged out' }}</span>
                </v-chip>
            </template>
            <span>{{ $auth.loggedIn ? 'The user currently logged in.' : 'No user is currently logged in.' }}</span>
        </v-tooltip>
    </div>
</template>

<script>
export default {
    name: 'LoggedInUser'
}
</script>
