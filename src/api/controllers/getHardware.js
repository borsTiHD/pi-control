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
        const command = 'cat'
        const args = ['/proc/cpuinfo']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const outputRegex = /^.*model name\s+:\s+(?<processor>.+?)$.*?Hardware\s+:\s+(?<hardware>.+?)$.*?Revision\s+:\s+(?<revision>.+?)$.*?Serial\s+:\s+(?<serial>.+?)$.*?Model\s+:\s+(?<model>.+?)$/gms
        const rawData = stdout.trim() // For parsing only needed info

        const lines = stdout.trim().split('\n').map((line, index) => {
            const split = line.split(': ')
            if (Array.isArray(split) && split.length > 0) {
                return { name: split[0].replace(/\t+/, ''), state: split[1] }
            }
            return null
        }) // For sending all output

        console.log(rawData)
        console.log(lines)
        const match = outputRegex.exec(rawData)
        console.log(match)

        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        const { processor, hardware, revision, serial, model } = match.groups

        return {
            parsed: [
                { name: 'Processor:', state: processor },
                { name: 'Hardware:', state: hardware },
                { name: 'Revision:', state: revision },
                { name: 'Serial:', state: serial },
                { name: 'Model:', state: model }
            ],
            all: lines
        }
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get data:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows uptime
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        const pseudoData = [
            { name: 'Processor', state: 'ARMv7 Processor rev 3 (v7l)' },
            { name: 'Hardware', state: 'WindowsTest' },
            { name: 'Revision', state: 'd03114' },
            { name: 'Serial', state: '10000000aasfaw' },
            { name: 'Model', state: 'Raspberry Pi 4 Model B Rev 1.4' }
        ]
        return {
            parsed: pseudoData,
            all: 'not supported'
        }
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
