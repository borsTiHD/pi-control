<template>
    <v-card>
        <v-card-title class="headline">Socket.io Playground</v-card-title>
        <v-card-actions>
            <v-btn
                @click="sendSocketMsg"
            >
                Send Message
            </v-btn>
            <v-btn
                @click="requestSocketInterval"
            >
                Start Interval
            </v-btn>
        </v-card-actions>
        <v-card-text>
            <v-textarea
                name="input-7-1"
                label="Socket Messages"
                filled
                clearable
                auto-grow
                readonly
                :value="text"
                @click:clear="clearText"
            />
        </v-card-text>
    </v-card>
</template>

<script>

export default {
    name: 'SocketIo',
    data() {
        return {
            dev: false,
            socket: null,
            text: ''
        }
    },
    sockets: {
        connect() {
            console.log('[Socket.io] - Connected to server')
        },
        message(message) {
            console.log('[Socket.io] - Message from server:', message)
            this.text += `${message}\n`
        },
        intervalTest(message) {
            console.log('[Socket.io] - Message from server \'intervalTest\':', message)
            this.text += `${message} `
        }
    },
    methods: {
        sendSocketMsg() {
            console.log('[Socket.io] - Emit message to server')
            const randomNumber = Math.floor(Math.random() * 100) + 1
            this.$socket.emit('message', randomNumber)
        },
        requestSocketInterval() {
            console.log('[Socket.io] - Request interval from server')
            this.$socket.emit('intervalTest', 2 * 1000)
        },
        clearText() {
            this.text = ''
        }
    }
}
</script>
