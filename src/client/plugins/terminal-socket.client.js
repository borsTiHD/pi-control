class TerminalClass {
    constructor(Vue) {
        // Vue Instance
        this.$vm = Vue
        this.$socket = null

        // Class Propertys
        this.state = null // Connection State
        this.buffer = '' // Buffered chunks of data
    }

    /**
     * connect() - Establishing socket connection
     * @param   {object}    socket  -> Socket object
     * @access  public
     */
    connect(socket) {
        // Sends request to socket server
        this.$socket = socket
        this.$socket.emit('terminal', 'connect')

        // TODO
        // need to load/subscribe to events from socket

        this.state = true // connected
    }

    /**
     * send() - Sending data to host
     * @param   {string}    data    -> Data to send
     * @access  public
     */
    send(data) {
        console.warn('sending not implemented right now...')
    }

    /**
     * onData() - On incoming data
     * @param   {string}    data    -> Buffer Data Stream
     * @access  private
     */
    onData(data) {
        // Saving chunk/data
        this.buffer += data

        // Checking size of buffer
        const bufferLength = this.buffer.length
        if (bufferLength > 15000) {
            // Buffer too long - cutting buffer / old data will be deleted
            this.buffer = this.buffer.slice(bufferLength - 10000)
        }
    }

    /**
     * getBuffer() - Gettings saved buffer data
     * @access  public
     * @returns {string}    -> Returns buffered data
     */
    getBuffer() {
        return this.buffer
    }

    /**
     * clearBuffer() - Deletes all saved data
     * @access  public
     */
    clearBuffer() {
        this.buffer = ''
    }
}

export default ({ app }, inject) => {
    // Inject $termClient in Vue, context and store
    const obj = new TerminalClass(app)
    inject('termClient', obj)
}
