import childProcess from 'child_process'
import util from 'util'

// Promisefied spawn
const execFile = util.promisify(childProcess.execFile)

// CONSTs
const isWin = process.platform === 'win32'
const TEN_MEGABYTES = 1000 * 1000 * 10
const ERROR_MESSAGE_PARSING_FAILED = 'Error on executing script - needs root/sudo privilegs'

// Getting Unix packages
async function nonWindows() {
    try {
        const command = 'apt-get'
        const args = ['update']

        const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

        // Return raw output
        return stdout
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to update package list:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows packages
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        return `OK:1 http://archive.raspberrypi.org/debian buster InRelease
        Holen:2 http://raspbian.raspberrypi.org/raspbian buster InRelease [15,0 kB]             
        OK:3 https://deb.nodesource.com/node_16.x buster InRelease                              
        Es wurden 15,0 kB in 1 s geholt (15,4 kB/s).                    
        Paketlisten werden gelesen... Fertig`
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
