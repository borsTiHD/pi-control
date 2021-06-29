import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

export default ({ $auth }) => {
    const isDev = process.env.dev
    const connection = isDev ? 'http://localhost:8800' : ''

    console.log('connection:', connection)

    // Socke.io: Putting token in 'Authorization' header key for 'jwt' authentication
    const token = $auth.strategy.token.get()
    const options = {
        extraHeaders: {
            Authorization: token
        }
    }

    Vue.use(new VueSocketIO({
        debug: true,
        connection: SocketIO(connection, options)
    }))
}
