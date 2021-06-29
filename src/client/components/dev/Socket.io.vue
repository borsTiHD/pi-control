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
import { io } from 'socket.io-client'

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
        // Connects to socket.io server
        this.initSocket()
    },
    deactivated() {
        // Disconnects from socket.io server
        this.socket.disconnect()
    },
    methods: {
        initSocket() {
            this.dev = process.env.dev

            // Socke.io: Putting token in 'Authorization' header key for 'jwt' authentication
            const token = this.$auth.strategy.token.get()
            const options = {
                extraHeaders: {
                    Authorization: token
                }
            }

            // Connecting with socket.io server
            const socket = this.dev ? io('http://localhost:8800', options) : io('', options)

            socket.on('connect', () => {
                console.log('[Socket.io] - Connected to server')
            })
            socket.on('message', (message) => {
                console.log('[Socket.io] - Message from server:', message)
                this.text += `${message}\n`
            })
            socket.on('interval-test', (message) => {
                console.log('[Socket.io] - Message from server \'interval-test\':', message)
                this.text += `${message} `
            })
            socket.on('diconnect', () => {
                console.log('[Socket.io] - Disconnected from server')
            })

            this.socket = socket
        },
        sendSocketMsg() {
            console.log('[Socket.io] - Emit message to server')
            const randomNumber = Math.floor(Math.random() * 100) + 1
            this.socket.emit('message', randomNumber)
        },
        requestSocketInterval() {
            console.log('[Socket.io] - Request interval from server')
            this.socket.emit('interval-test', 2 * 1000)
        },
        clearText() {
            this.text = ''
        }
    }
}
</script>
