import pty from 'node-pty'

const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'

export default (cbHandler = () => {}, cbOnClose = () => {}) => {
    // Callback function will emit data output from the session
    // Create child process
    function spawnPty() {
        const shell = isWin ? 'powershell.exe' : 'bash'
        if (isLinux || isWin) {
            const ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME,
                env: process.env
            })
            return ptyProcess
        } else {
            // Not supporting os
            throw new Error(`Could not spawn a terminal session. The operating system used is not supported: ${process.platform}`)
        }
    }

    // Create session
    const session = {
        terminal: spawnPty(),
        handler: cbHandler,
        send(data) {
            this.terminal.write(data)
        },
        resize(cols, rows) {
            this.terminal.resize(Number(cols), Number(rows))
        },
        kill() {
            this.terminal.kill()
        },
        getPid() {
            return this?.terminal?.pid
        }
    }

    // Handle Data
    session.terminal.onData((data) => {
        session.handler({ _status: 'ok', type: 'data', data })
    })

    // Handle Closure
    session.terminal.onExit(({ exitCode, signal }) => {
        session.handler({ _status: 'ok', type: 'closure', data: exitCode, signal })
        cbOnClose({ exitCode, signal })
    })

    return session
}
