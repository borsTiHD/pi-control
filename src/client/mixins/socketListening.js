export default {
    methods: {
        socketListening(state, socketRoom) {
            if (state) {
                // Socket.IO: Joining room
                this.$socket.emit('room:join', socketRoom)
            } else {
                // Socket.IO: Leaving room
                this.$socket.emit('room:leave', socketRoom)
            }
        }
    }
}
