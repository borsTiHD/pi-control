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
        // Command/Args: excludes temporary devices / mountings
        // Header (English): Disk types -> Filesystem, Type, 1M-blocks, Used, Available, Use%, Mounted on
        // Header (German): Disk types -> Dateisystem, Typ, 1M-Blöcke, Benutzt, Verfügbar, Verw%, Eingehängt auf
        const command = 'df'
        const args = ['-x', 'tmpfs', '-x', 'devtmpfs', '-m', '-T']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const lines = stdout.trim().split('\n')
        lines.shift() // deletes first line with headers
        const diskspace = lines.map((line, index) => {
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
        })

        return diskspace
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get diskspace:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows uptime
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        const pseudoData = [
            {
                filesystem: '/dev/root', // Filesystem
                type: 'ext4', // Type
                total: 59645, // 1M-blocks
                used: 7244, // Used
                available: 49927, // Available
                usedPercentage: 13, // Use%
                mounted: '/' // Mounted on
            },
            {
                filesystem: '/dev/mmcblk0p1', // Filesystem
                type: 'vfat', // Type
                total: 253, // 1M-blocks
                used: 49, // Used
                available: 205, // Available
                usedPercentage: 20, // Use%
                mounted: '/boot' // Mounted on
            }
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
