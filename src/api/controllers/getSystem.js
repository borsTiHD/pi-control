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
        const command = 'hostnamectl'
        const args = []

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const lines = stdout.trim().split('\n')
        const system = lines.map((line, index) => {
            const split = line.split(': ')
            return { name: split[0], state: split[1] }
        })
        return system
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get system information:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows uptime
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        const pseudoData = [
            { name: 'Static hostname', state: 'WindowsTest' },
            { name: 'Icon name', state: 'computer' },
            { name: 'Machine ID', state: 'xxxxxx' },
            { name: 'Boot ID', state: 'xxxxxx' },
            { name: 'Operating System', state: 'Raspbian GNU/Linux 10 (buster)' },
            { name: 'Kernel', state: 'Linux 5.10.17-v7l+' },
            { name: 'Architecture', state: 'arm' }
        ]
        return pseudoData
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
