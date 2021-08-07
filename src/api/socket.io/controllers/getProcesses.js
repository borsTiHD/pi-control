import childProcess from 'child_process'
// import util from 'util'

const TEN_MEGABYTES = 1000 * 1000 * 10
// const execFile = util.promisify(childProcess.execFile)

const isWin = process.platform === 'win32'

// Collecting processes with 'ps' - copied and modified from https://github.com/sindresorhus/ps-list - thank you
async function nonWindows(options) {
    try {
        return await nonWindowsSingleCall(options)
    } catch (err) { // If the error is not a parsing error, it should manifest itself in multicall version too.
        console.error('[Socket.io] -> Error on executing nonWindowsSingleCall():', err)
        return await nonWindowsMultipleCalls(options)
    }
}

// Collecting processes with one 'ps' call
async function nonWindowsSingleCall(options) {
    const command = 'ps'
    const flags = options.all === false ? 'wwxo' : 'awwxo'
    const psFields = 'pid,ppid,uid,user,tty,stat,%cpu,%mem,etime,time,comm,args' // original: 'pid,ppid,uid,%cpu,%mem,comm,args'
    const ERROR_MESSAGE_PARSING_FAILED = 'Error on parsing script output'

    // TODO: Use the promise version of `execFile` when https://github.com/nodejs/node/issues/28244 is fixed.
    const [psPid, stdout] = await new Promise((resolve, reject) => {
        const child = childProcess.execFile(command, [flags, psFields], { maxBuffer: TEN_MEGABYTES }, (error, stdout) => {
            if (error === null) {
                resolve([child.pid, stdout])
            } else {
                reject(error)
            }
        })
    })

    // Parsing into Lines
    const lines = stdout.trim().split('\n')
    lines.shift() // deletes first line with headers

    // For parsing comm + args
    let psIndex
    let commPosition
    let argsPosition

    // TODO: Use named capture groups when targeting Node.js 10
    const psOutputRegex = /^[ \t]*(?<pid>\d+)[ \t]+(?<ppid>\d+)[ \t]+(?<uid>\d+)[ \t]+(?<user>\d+)[ \t]+(?<tty>\d+)[ \t]+(?<stat>\d+)[ \t]+(?<cpu>\d+\.\d+)[ \t]+(?<memory>\d+\.\d+)[ \t]+(?<etime>\d+)[ \t]+(?<time>\d+)[ \t]+/
    // const psOutputRegex = /^[ \t]*(?<pid>\d+)[ \t]+(?<ppid>\d+)[ \t]+(?<uid>\d+)[ \t]+(?<cpu>\d+\.\d+)[ \t]+(?<memory>\d+\.\d+)[ \t]+/

    // Parsing single lines
    const processes = lines.map((line, index) => {
        console.log('Line:', line)
        const match = psOutputRegex.exec(line)
        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        const { pid, ppid, uid, user, tty, stat, cpu, memory, etime, time } = match.groups

        const processInfo = {
            pid: Number.parseInt(pid, 10),
            ppid: Number.parseInt(ppid, 10),
            uid: Number.parseInt(uid, 10),
            user,
            tty,
            stat,
            cpu: Number.parseFloat(cpu),
            memory: Number.parseFloat(memory),
            etime,
            time,
            name: undefined,
            cmd: undefined
        }

        if (processInfo.pid === psPid) {
            psIndex = index
            commPosition = line.indexOf('ps', match[0].length)
            argsPosition = line.indexOf('ps', commPosition + 2)
        }

        return processInfo
    })

    if (psIndex === undefined || commPosition === -1 || argsPosition === -1) {
        throw new Error(ERROR_MESSAGE_PARSING_FAILED)
    }

    const commLength = argsPosition - commPosition
    for (const [index, line] of lines.entries()) {
        processes[index].name = line.slice(commPosition, commPosition + commLength).trim()
        processes[index].cmd = line.slice(argsPosition).trim()
    }

    processes.splice(psIndex, 1)
    return processes
}

// Collecting processes with multiple 'ps' calls
async function nonWindowsMultipleCalls(options) {
    throw new Error('Multiple Call Method not implemented right now')
}

// Collecting processes on windows
function isWindows(options) {
    throw new Error('Operating system is currently not supported')
}

// Export module
export default async(options = {}) => {
    // Determines collecting data depending on operating system
    if (isWin) {
        return isWindows(options)
    } else {
        return await nonWindows(options)
    }
}
