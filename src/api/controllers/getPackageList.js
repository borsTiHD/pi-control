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

        // Parsing into Lines
        const lines = stdout.trim().split('\n').slice(1)
        const outputRegex = /^(?<name>.*?)\/.*?now[ \t]+(?<version>.*?)[ \t]+(?<installed>\[.+\])/gm

        // Parsing all lines and return objects with details for every package
        return lines.map((line) => {
            outputRegex.lastIndex = 0
            const match = outputRegex.exec(line)
            if (match === null) {
                throw new Error(`${ERROR_MESSAGE_PARSING_FAILED} - line: ${line}`) // If nothing matched
            }
            const { name, version, installed } = match.groups
            return { name, version, installed }
        })
    } catch (error) {
        console.error('[Controller] -> Error on executing shell script to get system packages:', error)
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }
}

// Getting windows packages
async function isWindows(config) {
    if (config.DEV && config.TEST_DATA) {
        try {
            /*
            const command = 'powershell'
            const args = ['Get-ItemProperty HKLM:\\Software\\Wow6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select-Object DisplayName, DisplayVersion | Format-Table –AutoSize'] // ', Publisher, InstallDate' https://www.howtogeek.com/165293/how-to-get-a-list-of-software-installed-on-your-pc-with-a-single-command/
            // const args = ['Get-WmiObject -Class Win32_Product | select Name, Version'] // https://www.codetwo.com/admins-blog/how-to-check-installed-software-version/
            const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

            // Parsing into Lines
            const lines = stdout.trim().split('\n').slice(2)

            // TODO
            // Regex: /^(?<name>.*)[ \t]+(?<version>(\d+|\.+)+).+/gm

            const arr = []
            lines.forEach((line) => {
                const software = line.replace('\r', '').split()
                arr.push(software)
            })
            */

            // Test data, crawled from linux
            const stdout = `Auflistung... Fertig
            acl/oldstable,now 2.2.53-4 armhf  [Installiert,automatisch]
            apt/oldstable,now 1.8.2.3 armhf  [installiert]
            bash/oldstable,now 5.0-4 armhf  [installiert]
            bison/oldstable,now 2:3.3.2.dfsg-1 armhf  [installiert]
            blt/oldstable,now 2.5.3+dfsg-4 armhf  [Installiert,automatisch]
            bluetooth/now 5.50-1.2~deb10u1+rpt2 all  [Installiert,aktualisierbar auf: 5.50-1.2~deb10u2+rpt1]
            bluez-firmware/testing,now 1.2-4+rpt8 all  [Installiert,automatisch]
            bluez-tools/oldstable,now 2.0~20170911.0.7cb788c-2 armhf  [installiert]
            bluez/now 5.50-1.2~deb10u1+rpt2 armhf  [Installiert,aktualisierbar auf: 5.50-1.2~deb10u2+rpt1]
            bsdmainutils/oldstable,now 11.1.2 armhf  [installiert]
            libc-bin/oldstable,now 2.28-10+rpi1 armhf  [Installiert,aktualisierbar auf: 2.28-10+rpt2+rpi1]
            libc-dev-bin/oldstable,now 2.28-10+rpi1 armhf  [Installiert,aktualisierbar auf: 2.28-10+rpt2+rpi1]
            libc-l10n/oldstable,now 2.28-10+rpi1 all  [Installiert,aktualisierbar auf: 2.28-10+rpt2+rpi1]
            libc6-dbg/oldstable,now 2.28-10+rpi1 armhf  [Installiert,aktualisierbar auf: 2.28-10+rpt2+rpi1]
            libc6-dev/oldstable,now 2.28-10+rpi1 armhf  [Installiert,aktualisierbar auf: 2.28-10+rpt2+rpi1]
            libc6/oldstable,now 2.28-10+rpi1 armhf  [Installiert,aktualisierbar auf: 2.28-10+rpt2+rpi1]
            libcaca0/oldstable,now 0.99.beta19-2.1 armhf  [Installiert,automatisch]
            libcairo-gobject2/testing,now 1.16.0-4+rpt1 armhf  [Installiert,automatisch]
            rapidjson-dev/oldstable,now 1.1.0+dfsg2-5 all  [installiert]
            raspberrypi-artwork/testing,now 20150921 all  [installiert]
            raspberrypi-bootloader/now 1:1.20210805-1 armhf  [Installiert,aktualisierbar auf: 1:1.20210831-1]raspberrypi-kernel/now 1:1.20210805-1 armhf  [Installiert,aktualisierbar auf: 1:1.20210831-1]
            raspberrypi-net-mods/testing,now 1.3.0 all  [installiert]
            raspberrypi-sys-mods/now 20210706 armhf  [Installiert,aktualisierbar auf: 20210901]
            raspberrypi-ui-mods/testing,now 1.20210706 armhf  [installiert]
            raspbian-archive-keyring/oldstable,now 20120528.2 all  [installiert]
            system-config-printer/oldstable,now 1.5.11-4 all  [installiert]
            systemd-sysv/now 241-7~deb10u7+rpi1 armhf  [Installiert,aktualisierbar auf: 241-7~deb10u8+rpi1]
            systemd/now 241-7~deb10u7+rpi1 armhf  [Installiert,aktualisierbar auf: 241-7~deb10u8+rpi1]
            sysvinit-utils/oldstable,now 2.93-8 armhf  [installiert]
            tar/oldstable,now 1.30+dfsg-6 armhf  [installiert]
            udev/now 241-7~deb10u7+rpi1 armhf  [Installiert,aktualisierbar auf: 241-7~deb10u8+rpi1]
            udisks2/oldstable,now 2.8.1-4 armhf  [Installiert,automatisch]
            zlib1g/oldstable,now 1:1.2.11.dfsg-1 armhf  [installiert]`

            // Parsing into Lines
            const lines = stdout.trim().split('\n').slice(1)
            const outputRegex = /^(?<name>.*?)\/.*?XXnow[ \t]+(?<version>.*?)[ \t]+(?<installed>\[.+\])/gm

            // Parsing all lines and return objects with details for every package
            return lines.map((line) => {
                outputRegex.lastIndex = 0
                const match = outputRegex.exec(line)
                if (match === null) {
                    throw new Error(`${ERROR_MESSAGE_PARSING_FAILED} - line: ${line}`) // If nothing matched
                }
                const { name, version, installed } = match.groups
                return { name, version, installed }
            })
        } catch (error) {
            console.error('[Controller] -> Error on executing powershell script to get system packages:', error)
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
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
