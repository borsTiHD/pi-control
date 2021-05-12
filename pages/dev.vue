<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <tests-app />
        </v-col>
    </v-row>
</template>

<script>
import TestsApp from '~/components/dev/Tests.vue'

export default {
    name: 'Dev',
    components: {
        TestsApp
    }
}
</script>
