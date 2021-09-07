import childProcess from 'child_process'
import path from 'path'
import util from 'util'

// Promisefied execFile
const execFile = util.promisify(childProcess.execFile)

// CONSTs
const isWin = process.platform === 'win32'
const TEN_MEGABYTES = 1000 * 1000 * 10
const ERROR_MESSAGE_PARSING_FAILED = 'Error on parsing script output'

// Collecting processes with 'ps' - copied and modified from https://github.com/sindresorhus/ps-list - thank you :)
async function nonWindows(options) {
    try {
        return await nonWindowsSingleCall(options)
    } catch (err) { // If the error is not a parsing error, it should manifest itself in multicall version too.
        console.error('[Controller] -> Error on executing nonWindowsSingleCall(), trying multiple calls next:', err)
        return await nonWindowsMultipleCalls(options)
    }
}

// Collecting processes with one 'ps' call
async function nonWindowsSingleCall(options) {
    const command = 'ps'
    const flags = options.all === false ? 'wwxo' : 'awwxo'
    const psFields = 'pid,ppid,uid,user,%cpu,%mem,time,comm,args' // original: 'pid,ppid,uid,%cpu,%mem,comm,args'

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
    const psOutputRegex = /^[ \t]*(?<pid>\d+)[ \t]+(?<ppid>\d+)[ \t]+(?<uid>\d+)[ \t]+(?<user>\D*?)[ \t]+(?<cpu>\d+\.\d+|\d+)[ \t]+(?<memory>\d+\.\d+|\d+)[ \t]+(?<time>.*?)[ \t]+/
    // const psOutputRegex = /^[ \t]*(?<pid>\d+)[ \t]+(?<ppid>\d+)[ \t]+(?<uid>\d+)[ \t]+(?<cpu>\d+\.\d+)[ \t]+(?<memory>\d+\.\d+)[ \t]+/

    // Parsing single lines
    const processes = lines.map((line, index) => {
        const match = psOutputRegex.exec(line)
        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        const { pid, ppid, uid, user, cpu, memory, time } = match.groups

        const processInfo = {
            pid: Number.parseInt(pid, 10),
            ppid: Number.parseInt(ppid, 10),
            uid: Number.parseInt(uid, 10),
            user,
            cpu: Number.parseFloat(cpu) || Number.parseInt(cpu, 10),
            memory: Number.parseFloat(memory) || Number.parseInt(memory, 10),
            time,
            name: undefined,
            cmd: undefined
        }

        if (processInfo.pid === psPid) {
            psIndex = index
            commPosition = line.indexOf(command, match[0].length)
            argsPosition = line.indexOf(command, commPosition + 2)
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
    const command = 'ps'
    const flags = (options.all === false ? '' : 'a') + 'wwxo'
    const psFields = ['comm', 'args', 'ppid', 'uid', 'user', '%cpu', '%mem', 'time'] // default: ['comm', 'args', 'ppid', 'uid', '%cpu', '%mem']
    const ret = {}

    await Promise.all(psFields.map(async(cmd) => {
        const { stdout } = await execFile(command, [flags, `pid,${cmd}`], { maxBuffer: TEN_MEGABYTES })

        for (let line of stdout.trim().split('\n').slice(1)) {
            line = line.trim()
            const [pid] = line.split(' ', 1)
            const val = line.slice(pid.length + 1).trim()

            if (ret[pid] === undefined) {
                ret[pid] = {}
            }

            ret[pid][cmd] = val
        }
    }))

    // Filter out inconsistencies as there might be race
    // issues due to differences in `ps` between the spawns
    return Object.entries(ret)
        .filter(([, value]) => value.comm && value.args && value.ppid && value.uid && value.user && value['%cpu'] && value['%mem'] && value.time)
        .map(([key, value]) => ({
            pid: Number.parseInt(key, 10),
            ppid: Number.parseInt(value.ppid, 10),
            uid: Number.parseInt(value.uid, 10),
            user: value.user,
            cpu: Number.parseFloat(value['%cpu']) || Number.parseInt(value['%cpu'], 10),
            memory: Number.parseFloat(value['%mem']) || Number.parseInt(value['%mem'], 10),
            time: value.time,
            name: path.basename(value.comm),
            cmd: value.args
        }))
}

// Collecting processes on windows
async function isWindows() {
    const command = 'powershell'
    const args = ['Get-Process'] // 'Get-Process | Format-Table Id, Cpu, VM, TotalProcessorTime, Name, Path'
    const { stdout } = await execFile(command, args, { maxBuffer: TEN_MEGABYTES })

    // Parsing into Lines
    const lines = stdout.trim().split('\n').slice(2) // deletes first two lines with headers
    lines[lines.length - 1] += '\n' // appends a 'new line' to the last item in array -> so that the regex rule can take effect

    // 'Get-Process' regex
    const psOutputRegex = /^[ \t]*(?<handles>\d+)[ \t]*(?<npm>\d+)[ \t]*(?<pm>\d+)[ \t]*(?<ws>\d+)[ \t]+(?<cpu>\d+\.\d+,\d+|\d+,\d+|\d+)[ \t]+(?<pid>\d+)[ \t]+(?<si>\d+)[ \t]+(?<name>.*?)[ \n]/

    // Parsing single lines
    const processes = lines.map((line) => {
        const match = psOutputRegex.exec(line)
        if (match === null) {
            throw new Error(ERROR_MESSAGE_PARSING_FAILED)
        }

        // Building result
        const { handles, npm, pm, ws, cpu, pid, si, name } = match.groups
        const processInfo = {
            handles: Number.parseInt(handles, 10),
            npm: Number.parseInt(npm, 10),
            pm: Number.parseInt(pm, 10),
            ws: Number.parseInt(ws, 10),
            cpu: Number.parseFloat(cpu) || Number.parseInt(cpu, 10),
            pid: Number.parseInt(pid, 10),
            si: Number.parseInt(si, 10),
            name
        }
        return processInfo
    })
    return processes
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
