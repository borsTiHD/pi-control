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
        const command = 'top -bn1 | grep "Cpu(s)\\|top -"'
        const args = []

        const { stdout } = await execFile(command, args, { shell: true, maxBuffer: TEN_MEGABYTES })

        // Parsing
        const psOutputRegex = /^.*load average:\s+(?<min1>\d+,\d+),[ \t]+(?<min5>\d+,\d+),[ \t]+(?<min15>\d+,\d+).+%Cpu\(s\):\s+(?<us>\d+,\d+)[ \t]+\D+(?<sy>\d+,\d+)[ \t]+\D+(?<ni>\d+,\d+)[ \t]+\D+(?<id>\d+,\d+)[ \t]+\D+(?<wa>\d+,\d+)[ \t]+\D+(?<hi>\d+,\d+)[ \t]+\D+(?<si>\d+,\d+)[ \t]+\D+(?<st>\d+,\d+)/gms
        const match = psOutputRegex.exec(stdout.trim())
        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        // Converts string with comma separated value to a float.
        function returnFloat(string) {
            return parseFloat(string.replace(',', '.')) // Input something like '7,3' -> parseFloat needs a '.' instead ','
        }

        const { min1, min5, min15, us, sy, ni, id, wa, hi, si, st } = match.groups
        const data = {
            load: {
                min1: returnFloat(min1),
                min5: returnFloat(min5),
                min15: returnFloat(min15)
            },
            usage: {
                us: returnFloat(us),
                sy: returnFloat(sy),
                ni: returnFloat(ni),
                id: returnFloat(id),
                wa: returnFloat(wa),
                hi: returnFloat(hi),
                si: returnFloat(si),
                st: returnFloat(st)
            }
        }

        return data
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get cpu usage:', error)
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
        const min1 = getRandom(1, 400) / 100
        const min5 = getRandom(1, 200) / 100
        const min15 = getRandom(1, 100) / 100
        const us = getRandom(100, 140) / 100
        const sy = getRandom(700, 800) / 100
        const ni = getRandom(1, 10) / 100
        const id = getRandom(4000, 9999) / 100
        const wa = getRandom(1, 10) / 100
        const hi = getRandom(1, 10) / 100
        const si = getRandom(1, 10) / 100
        const st = getRandom(1, 10) / 100

        return {
            load: {
                min1: parseFloat(min1),
                min5: parseFloat(min5),
                min15: parseFloat(min15)
            },
            usage: {
                us: parseFloat(us),
                sy: parseFloat(sy),
                ni: parseFloat(ni),
                id: parseFloat(id),
                wa: parseFloat(wa),
                hi: parseFloat(hi),
                si: parseFloat(si),
                st: parseFloat(st)
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
