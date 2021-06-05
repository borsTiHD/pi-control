<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <tests-app />
        </v-col>
        <v-col cols="12" sm="8" md="6">
            <app-version />
        </v-col>
    </v-row>
</template>

<script>
import TestsApp from '~/components/dev/Tests.vue'
import AppVersion from '~/components/display/AppVersion.vue'

export default {
    name: 'Dev',
    components: {
        TestsApp,
        AppVersion
    }
}
</script>
