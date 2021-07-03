<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex flex-column">
            hello
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'Processes',
    components: {},
    data() {
        return {}
    },
    computed: {
    },
    created() {
    },
    activated() {
        // Socket.IO: Joining room
        this.$socket.emit('room:join', 'processesRoom')
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.$socket.emit('room:leave', 'processesRoom')
    },
    sockets: {
        processes(message) {
            console.log('[Socket.io] -> Message from server \'processes\':', message)
        }
    },
    methods: {
    }
}
</script>
