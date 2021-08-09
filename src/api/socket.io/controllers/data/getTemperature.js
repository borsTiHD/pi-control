import childProcess from 'child_process'
import util from 'util'

// Promisefied execFile
const execFile = util.promisify(childProcess.execFile)

// CONSTs
const isWin = process.platform === 'win32'
const TEN_MEGABYTES = 1000 * 1000 * 10
const ERROR_MESSAGE_PARSING_FAILED = 'Error on parsing script output'

// Getting Unix uptime
async function nonWindows() {
    try {
        // Command gets information from VideoCore GPU on the Raspberry Pi
        const command = 'vcgencmd'
        const args = ['measure_temp']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const data = stdout.trim().split('=')
        return data[1]
    } catch (error) {
        console.error('[Socket.io] -> Error on executing shell script to get system temperature:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows uptime
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        const min = 20
        const max = 60
        const r = Math.floor(Math.random() * (max - min + 1) + min)
        return `${r}'C`
    }
    throw new Error('Windows is currently not supported')
}

// Export module
export default async(config) => {
    // Config: { DEV: config.DEV, TEST_DATA: config.TEST_DATA }

    // Determines collecting data depending on operating system
    if (isWin) {
        return isWindows(config)
    } else {
        return await nonWindows()
    }
}
