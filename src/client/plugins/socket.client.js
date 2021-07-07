import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

export default ({ $auth }) => {
    const isDev = process.env.dev
    const HOST_IP = process.env.HOST_IP
    const PORT_BACKEND = process.env.PORT_BACKEND
    const connection = isDev ? `http://${HOST_IP}:${PORT_BACKEND}` : ''

    // Socke.io: Putting token in 'Authorization' header key for 'jwt' authentication
    const token = $auth.strategy.token.get()
    const options = {
        extraHeaders: {
            Authorization: token
        }
    }

    Vue.use(new VueSocketIO({
        // debug: !!isDev,
        connection: SocketIO(connection, options)
    }))
}
