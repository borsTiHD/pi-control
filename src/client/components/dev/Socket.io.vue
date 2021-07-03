<template>
    <v-card>
        <v-card-title class="headline">Socket.io Playground</v-card-title>
        <v-card-actions>
            <v-btn
                @click="sendSocketMsg"
            >
                Send Message
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
    activated() {
        // Socket.IO: Joining room
        this.$socket.emit('room:join', 'testRoom')
    },
    deactivated() {
        // Socket.IO: Leaving room
        this.$socket.emit('room:leave', 'testRoom')
    },
    sockets: {
        connect() {
            console.log('[Socket.io] -> Connected to server')
        },
        devMessage(message) {
            console.log('[Socket.io] -> Message from server:', message)
            this.text += `${message}\n`
        },
        intervalTest(message) {
            console.log('[Socket.io] -> Message from server \'intervalTest\':', message)
            this.text += `${message} `
        }
    },
    methods: {
        sendSocketMsg() {
            console.log('[Socket.io] -> Emit message to server')
            const randomNumber = Math.floor(Math.random() * 100) + 1
            this.$socket.emit('dev-message', randomNumber)
        },
        clearText() {
            this.text = ''
        }
    }
}
</script>
