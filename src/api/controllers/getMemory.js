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
        const psOutputRegex = /^.*Mem:\s+(?<total>\d+)[ \t]+(?<used>\d+)[ \t]+(?<free>\d+)[ \t]+(?<shared>\d+)[ \t]+(?<cache>\d+)[ \t]+(?<available>\d+).+Swap:\s+(?<swapTotal>\d+)[ \t]+(?<swapUsed>\d+)[ \t]+(?<swapFree>\d+)/gms
        const match = psOutputRegex.exec(stdout.trim())
        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        const { total, used, free, shared, cache, available, swapTotal, swapUsed, swapFree } = match.groups
        const data = {
            memory: {
                total: Number.parseInt(total, 10),
                used: Number.parseInt(used, 10),
                free: Number.parseInt(free, 10),
                shared: Number.parseInt(shared, 10),
                cache: Number.parseInt(cache, 10),
                available: Number.parseInt(available, 10)
            },
            swap: {
                total: Number.parseInt(swapTotal, 10),
                used: Number.parseInt(swapUsed, 10),
                free: Number.parseInt(swapFree, 10)
            }
        }

        return data
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get memory usage:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows uptime
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        // Generate random number
        function getRandom(min = 0, max = 1000) {
            const r = Math.floor(Math.random() * (max - min + 1) + min)
            return r
        }

        // Building random test data
        const total = 16000
        const used = getRandom(600, 1000)
        const free = getRandom(3000, 4500)
        const shared = getRandom(100, 300)
        const cache = getRandom(2500, 4000)
        const available = total - used
        const swapTotal = 100
        const swapUsed = getRandom(20, 50)
        const swapFree = swapTotal - swapUsed

        return {
            memory: {
                total,
                used,
                free,
                shared,
                cache,
                available
            },
            swap: {
                total: swapTotal,
                used: swapUsed,
                free: swapFree
            }
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
