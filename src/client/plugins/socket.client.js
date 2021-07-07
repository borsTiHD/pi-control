import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

export default ({ $auth, $config }) => {
    const isDev = $config.dev
    const HOST_IP = $config.HOST_IP
    const PORT_BACKEND = $config.PORT_BACKEND
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
