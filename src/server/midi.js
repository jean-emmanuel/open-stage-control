var {PythonShell} = require('python-shell'),
    fs = require('fs'),
    path = require('path'),
    settings = require('./settings')

// last o-s-c version that changed midi sources
// must match version in midi.py / bundled midi executable
var midiVersion = '1.23.0'

var pythonOptions = {
    scriptPath:__dirname,
    mode:'text',
}

var midiBinaries = {
    x64: {
        linux: 'osc-midi-linux',
        darwin: 'osc-midi-osx',
        win32: 'osc-midi-windows.exe'
    },
    arm64:{
        darwin: 'osc-midi-osx',
    }
}

var expectMidiBinaries = fs.existsSync(path.join(__dirname, '/osc-midi.json')),
    expectMidiBinariesError = false

var pythonPathOverride
if (midiBinaries[process.arch] && midiBinaries[process.arch][process.platform]) {
    var p = path.resolve(__dirname,midiBinaries[process.arch][process.platform])
    if (fs.existsSync(p)) {
        pythonPathOverride = p
    } else if (expectMidiBinaries) {
        expectMidiBinariesError = true
    }
}

class MidiConverter {

    constructor() {

        if (expectMidiBinariesError) MidiConverter.midiBinariesError()

        this.py = new PythonShell('python/midi.py', Object.assign({
            args: [
                '--params',
                settings.read('debug') ? 'debug' : '',
                ...settings.read('midi')
            ],
            pythonPath: MidiConverter.getPythonPath()
        }, pythonOptions))

        this.py.childProcess.on('error', (e)=>{
            if (e.code === 'ENOENT') {
                console.error(`(ERROR, MIDI) Could not find python binary: ${e.message.replace(/spawn (.*) ENOENT/, '$1')}`)
            } else {
                console.error(`(ERROR, MIDI) ${e.message}`)
            }
        })

        this.running = true
        this.py.childProcess.on('exit', (code)=>{
            if (code === null) console.error('(ERROR, MIDI) Midi bridge process crashed')
            this.running = false
        })

    }

    send(data) {

        if (!this.running) return

        var args = []
        for (let i in data.args) {
            args.push(data.args[i].value)
        }

        this.py.send(JSON.stringify([data.port, data.address, ...args]))

    }

    stop() {

        this.py.childProcess.kill()

    }

    init(receiveOsc) {

        this.receiveOsc = receiveOsc
        this.py.on('message', (message)=>{
            MidiConverter.parseIpc(message, this)
        })

    }

    static parseIpc(message, instance) {

        // console.log(message)
        var name, data
        try {
            [name, data] = JSON.parse(message)
        } catch (err) {
            if (settings.read('debug')) console.error(`(ERROR, MIDI) Unparsed python log:\n    ${message}`)
        }
        if (name == 'log') {
            if (data.indexOf('ERROR') > -1) {
                console.error(data)
            } else {
                console.log(data)
            }
        } else if (name == 'debug') {
            if (data.indexOf('in:') === 0) {
                console.log('\x1b[36m(DEBUG, MIDI)', data, '\x1b[0m')
            } else if (data.indexOf('out:') === 0) {
                console.log('\x1b[35m(DEBUG, MIDI)', data, '\x1b[0m')
            } else {
                console.log('(DEBUG, MIDI) ' + data)
            }
        } else if (name ==  'osc') {
            instance.receiveOsc(data)
        } else if (name == 'error') {
            console.error('(ERROR, MIDI) ' + data)
        } else if (name == 'version' && data != midiVersion) {
            console.error(`(WARNING, MIDI) binary version mismatch (${data} installed, ${midiVersion} expected)`)
        }

    }

    static list() {

        if (expectMidiBinariesError) MidiConverter.midiBinariesError()

        PythonShell.run('python/midi.py', Object.assign({pythonPath: MidiConverter.getPythonPath(), args: ['--params', 'list-only']}, pythonOptions), function(e, results) {
            if (e) {
                if (e.code === 'ENOENT') {
                    console.error(`(ERROR, MIDI) Could not find python binary: ${e.message.replace(/spawn (.*) ENOENT/, '$1')}`)
                } else {
                    console.error(`(ERROR, MIDI) ${e.message}`)
                }
            }

            for (let r of results) {
                MidiConverter.parseIpc(r)
            }
        })

    }

    static getPythonPath() {

        var pythonPath = settings.read('midi') ? settings.read('midi').filter(x=>x.includes('path=')).map(x=>x.split('=')[1])[0] : undefined

        if (!pythonPath && pythonPathOverride) pythonPath = pythonPathOverride

        return pythonPath

    }

    static midiBinariesError() {

        console.error(`(ERROR, MIDI) Could not find midi binary file ${p}\nIt may have been deleted by your antivirus.`)
        console.log('(INFO, MIDI) Falling back to python implementation (see https://openstagecontrol.ammd.net/docs/midi/midi-configuration/).')
        expectMidiBinariesError = false

    }

}

module.exports = MidiConverter
