import { spawn } from 'child_process'
import fs from 'fs-extra'

export default (cbHandler = () => {}) => {
    // Callback function will emit data output from the session
    try {
        // Create child process
        const child = spawn('/bin/sh')

        // Create session
        const session = {
            terminal: child,
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
        session.terminal.stdout.on('data', (buffer) => {
            const data = buffer.toString()
            session.handler({ _status: 'ok', type: 'data', data })
        })

        // Handle Error
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
