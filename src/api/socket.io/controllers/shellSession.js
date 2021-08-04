import { spawn } from 'child_process'
import fs from 'fs-extra'

const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'

export default (cbHandler = () => {}) => {
    // Callback function will emit data output from the session
    try {
        // Create child process
        function spawnChild() {
            if (isLinux) {
                return spawn('/bin/sh')
            } else if (isWin) {
                return spawn('cmd')
            } else {
                // TODO
                // Error handling for not supporting os
            }
        }

        // Create session
        const session = {
            terminal: spawnChild(),
            handler: cbHandler,
            send(data) {
                this.terminal.stdin.write(data)
            },
            async cwd() {
                const cwd = await fs.readlink(`/proc/${this.terminal.pid}/cwd`) // '/proc/' + session.terminal.pid + '/cwd'
                session.handler({ type: 'cwd', data: cwd })
            },
            kill() {
                this.terminal.kill()
            }
        }

        // Handle Data
        session.terminal.stdout.setEncoding('utf8')
        session.terminal.stdout.on('data', (buffer) => {
            const data = buffer.toString()
            session.handler({ _status: 'ok', type: 'data', data })
        })

        // Handle Error
        session.terminal.stderr.setEncoding('utf8')
        session.terminal.stderr.on('data', (buffer) => {
            const data = buffer.toString()
            session.handler({ _status: 'error', type: 'error', data })
        })

        // Handle Closure
        session.terminal.on('close', (exitcode) => {
            session.handler({ _status: 'ok', type: 'closure', data: exitcode })
        })

        // Handle Error Closure
        session.terminal.on('error', (error) => {
            session.handler({ _status: 'error', type: 'closure', data: error.message })
        })

        return session
    } catch (error) {
        console.error('[ShellSession] -> Error on creating shell session:', error)
        throw error
    }
}
