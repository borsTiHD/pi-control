// Imports
const { execFile } = require('child_process')
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'

/**
 * ChildProcessClass    : Hiermit lassen sich '*.exe'/'*.sh' Andwendungen spawnen, die Asyncron laufen.
 *                        Eventlistener/Callbacks erhalten Benachrichtigungen in Form von streamout Nachrichten aus der jeweiligen Andwendung
 * URL                  : https://stackoverflow.com/questions/14332721/node-js-spawn-child-process-and-get-terminal-output-live
 */
class ChildProcessClass {
    constructor() {
        // Sammelt sämtliche Prozesse die gestartet werden
        this.childProcess = []
    }

    /**
     * execFile() : Startet eine Datei und gibt deren Stream Ausgaben an Callback Funktionen zurück
     *
     * @param    {string}       exe                 -> Pfad zur auszuführenden '*.exe'
     * @param    {object}       args                -> Übergebene Argumente in Form einer Objektliste >> zb. [ 'arg1', 'arg2' ]
     * @param    {function}     callbackOnStdout    -> Callback Funktion die bei einer Consolenausgabe gestartet wird
     * @param    {function}     callbackOnClose     -> Callback Funktion die bei beenden der Anwendung gestartet wird
     */
    execFile(file, args, callbackOnStdout, callbackOnClose) {
        try {
            const child = execFile(file, args)

            // Speichert ChildProzess
            this.childProcess.push(child)

            // You can also use a variable to save the output
            // for when the script closes later
            let scriptOutput = ''

            // Here is where the output goes
            child.stdout.setEncoding('utf8')
            child.stdout.on('data', (data) => {
                // console.log('stdout: ' + data)
                const convertedData = data.toString()
                callbackOnStdout(child.pid, convertedData)
                scriptOutput += convertedData
            })

            // Here is where the error output goes
            child.stderr.setEncoding('utf8')
            child.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`)
                const convertedData = data.toString()
                scriptOutput += convertedData
            })

            // Here you can get the exit code of the script
            child.on('close', (code) => {
                // console.log('closing code: ' + code)
                // console.log('Full output of script: ',scriptOutput)
                // Ermittelt den Index und Löscht den gespeicherten Prozess aus dem Array
                const index = this.childProcess.findIndex((item) => { return item.pid === child.pid })
                if (index !== -1) { this.childProcess.splice(index, 1) }
                // Startet die Callback Funktion
                callbackOnClose(child.pid, scriptOutput, code)
            })
            return child
        } catch (error) {
            console.log('[ChildProcess] -> Error:', error)
            return error
        }
    }

    /**
     * execShell() : Startet ein batch/sh Script und gibt deren Stream Ausgaben an Callback Funktionen zurück
     *
     * @param    {string}       path                 -> Pfad zum auszuführenden Script ohne Endung
     * @param    {object}       args                -> Übergebene Argumente in Form einer Objektliste >> zb. [ 'arg1', 'arg2' ]
     * @param    {function}     callbackOnStdout    -> Callback Funktion die bei einer Consolenausgabe gestartet wird
     * @param    {function}     callbackOnClose     -> Callback Funktion die bei beenden der Anwendung gestartet wird
     * @param    {function}     callbackOnError     -> Callback Funktion die bei einem Error gestartet wird
     */
    execShell(path, args, callbackOnStdout, callbackOnClose, callbackOnError) {
        // Ermittelt Datei Endung
        let file = null
        if (isWin) {
            file = `${path}.bat`
        } else if (isLinux) {
            file = `sh ${path}.sh`
        }

        try {
            console.log('[ChildProcess] -> Try spawning:', file)
            const child = execFile(file, args, { shell: true }, (error, stdout, stderr) => {
                if (error) {
                    console.error('[ChildProcess] -> Error:', error)
                    callbackOnError(error)
                }
            })

            // Speichert ChildProzess
            this.childProcess.push(child)

            // You can also use a variable to save the output
            // for when the script closes later
            let scriptOutput = ''

            // Here is where the output goes
            child.stdout.setEncoding('utf8')
            child.stdout.on('data', (data) => {
                // console.log('stdout: ' + data)
                const convertedData = data.toString()
                callbackOnStdout(child.pid, convertedData)
                scriptOutput += convertedData
            })

            // Here is where the error output goes
            child.stderr.setEncoding('utf8')
            child.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`)
                const convertedData = data.toString()
                scriptOutput += convertedData
            })

            // Here you can get the exit code of the script
            child.on('close', (code) => {
                // console.log('closing code: ' + code)
                // console.log('Full output of script: ',scriptOutput)
                // Ermittelt den Index und Löscht den gespeicherten Prozess aus dem Array
                const index = this.childProcess.findIndex((item) => { return item.pid === child.pid })
                if (index !== -1) { this.childProcess.splice(index, 1) }
                // Startet die Callback Funktion
                callbackOnClose(child.pid, scriptOutput, code)
            })
            return child
        } catch (error) {
            console.error('[ChildProcess] -> Error:', error)
            callbackOnError(error)
            return error
        }
    }

    /**
     * killChild() : Terminiert einen ChildProzess mithilfe der PID, sofern er existiert
     *
     * @param    {number}       pid         -> ProzessID die gesucht und gekillt werden soll
     */
    killChild(pid) {
        if (!pid) return false
        try {
            const index = this.childProcess.findIndex((x) => x.pid === pid)
            if (index !== -1) {
                this.childProcess[index].kill()
                return true
            }
            return false
        } catch (error) {
            console.log('[ChildProcess] -> killChild Error:', error)
            return error
        }
    }
}
module.exports = ChildProcessClass
