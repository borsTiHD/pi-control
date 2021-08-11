import childProcess from 'child_process'
import util from 'util'
import moment from 'moment'

// Promisefied execFile
const execFile = util.promisify(childProcess.execFile)

// CONSTs
const isWin = process.platform === 'win32'
const TEN_MEGABYTES = 1000 * 1000 * 10
const ERROR_MESSAGE_PARSING_FAILED = 'Error on parsing script output'

// Getting Unix uptime
async function nonWindows() {
    try {
        const command = 'uptime'
        const args = ['-s']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const uptime = stdout.trim()
        return uptime
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get system uptime:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows uptime
async function isWindows() {
    try {
        const command = 'powershell'
        const args = ['(get-date) – (gcim Win32_OperatingSystem).LastBootUpTime | Format-Table Days,Hours,Minutes,Seconds'] // Milliseconds
        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing into Lines
        const lines = stdout.trim().split('\n').slice(2)
        const line = lines[0]

        const psOutputRegex = /^[ \t]*(?<days>\d+)[ \t]+(?<hours>\d+)[ \t]+(?<minutes>\d+)[ \t]+(?<seconds>\d+)/
        const match = psOutputRegex.exec(line)
        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        // Building result
        const { days, hours, minutes, seconds } = match.groups

        // Moment.js parsing - Number.parseInt(days, 10)
        const format = 'YYYY-MM-DD HH:mm:ss'
        const uptime = moment().subtract(days, 'days').subtract(hours, 'hours').subtract(minutes, 'minutes').subtract(seconds, 'seconds').format(format)

        return uptime
    } catch (error) {
        console.error('[Controller] -> Error on executing powershell script to get system uptime:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Export module
export default async() => {
    // Determines collecting data depending on operating system
    if (isWin) {
        return isWindows()
    } else {
        return await nonWindows()
    }
}
