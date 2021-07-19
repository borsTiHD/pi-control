<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="8">
            <swagger-docs />
        </v-col>
        <v-col cols="12" sm="8" md="8">
            <tests-app />
        </v-col>
        <v-col cols="12" sm="8" md="8">
            <socket-io />
        </v-col>
    </v-row>
</template>

<script>
import SwaggerDocs from '~/components/dev/SwaggerDocs.vue'
import TestsApp from '~/components/dev/Tests.vue'
import SocketIo from '~/components/dev/Socket.io.vue'

export default {
    name: 'Dev',
    components: {
        SwaggerDocs,
        TestsApp,
        SocketIo
    }
}
</script>
