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
        const command = 'free'
        const args = ['-m']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const lines = stdout.trim().split('\n')
        lines.shift() // deletes first line with headers
        const data = lines.map((line, index) => {
            return line
            /*
            const split = line.split(/\s+/)
            return {
                filesystem: split[0], // Filesystem
                type: split[1], // Type
                total: parseInt(split[2]), // 1M-blocks
                used: parseInt(split[3]), // Used
                available: parseInt(split[4]), // Available
                usedPercentage: parseInt(split[5].replace('%', '')), // Use%
                mounted: split[6] // Mounted on
            }
            */
        })

        return data
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get memory usage:', error)
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
