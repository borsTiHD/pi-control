import childProcess from 'child_process'
import util from 'util'

// Promisefied execFile
const execFile = util.promisify(childProcess.execFile)

// CONSTs
const isWin = process.platform === 'win32'
const TEN_MEGABYTES = 1000 * 1000 * 10
const ERROR_MESSAGE_PARSING_FAILED = 'Error on parsing script output'

// Getting Unix packages
async function nonWindows() {
    try {
        const command = 'apt'
        const args = ['list', '--installed']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing
        const packages = stdout.trim()
        return packages
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get system packages:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows packages
async function isWindows() {
    try {
        const command = 'powershell'
        const args = ['Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion | Format-Table –AutoSize'] // ', Publisher, InstallDate' https://www.howtogeek.com/165293/how-to-get-a-list-of-software-installed-on-your-pc-with-a-single-command/
        // const args = ['Get-WmiObject -Class Win32_Product | select Name, Version'] // https://www.codetwo.com/admins-blog/how-to-check-installed-software-version/
        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Parsing into Lines
        const lines = stdout.trim().split('\n').slice(2)

        const arr = []
        lines.forEach((line) => {
            const software = line.replace('\r', '').split()
            arr.push(software)
        })

        return lines
    } catch (error) {
        console.error('[Controller] -> Error on executing powershell script to get system packages:', error)
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
