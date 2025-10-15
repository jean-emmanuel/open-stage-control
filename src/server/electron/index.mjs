import sourceMap from 'source-map-support'
import {fork} from 'child_process'
import path from 'path'
import {ipcMain} from 'electron'
import electronRemote from '@electron/remote/main'
import * as settings from '../node/settings.mjs'
import DocsServer from '../node/docs-server'
import app from './electron-app.mjs'
import window from './electron-window'
import createTray from './tray.mjs'
import midi from '../node/midi.mjs'
import qrcode from '../node/qrcode.mjs'

var dev = process.argv[0].includes('node_modules'),
    docsServer,
    launcher = null,
    tray = null,
    clientWindows = [],
    serverProcess = null

sourceMap.install({handleUncaughtExceptions: false})

function openDocs() {

    if (!docsServer) docsServer = new DocsServer()

    docsServer.open()

}


function openClient() {

    var address = settings.appAddresses()[0]

    function launch() {
        var win = window({
            address:address,
            shortcuts:true,
            fullscreen: settings.read('fullscreen'),
            noFocus: settings.read('client-options') && settings.read('client-options').some(x=>x.match(/nofocus=1/i)),
            id: 'client'
        })
        win.on('error', ()=>{
            console.log('ERR')
        })
        if (settings.read('clearCache')) {
            // clear browser cache and reload
            win.webContents.session.clearCache().then(()=>{
                settings.write('version', settings.infos.version)
                win.webContents.reload()
            })
        }
        clientWindows.push(win)
    }


    if (app.isReady()) {
        launch()
    } else {
        app.on('ready',function(){
            launch()
        })
    }

}

function startServerProcess() {

    var args = [ '--no-gui']

    for (var k in settings.read('options')) {
        args.push('--' + k)
        var val = settings.read(k)
        if (typeof val === 'object') {
            args = args.concat(val)
        } else if (typeof val !== 'boolean') {
            args.push(val)
        }
    }

    serverProcess = fork(app.getAppPath(), args, {stdio: 'pipe', env: {...process.env, OSC_SERVER_PROCESS: 1, ELECTRON_RUN_AS_NODE: 1}})

    var cb = (data)=>{
        if (data.indexOf('(INFO) Server started') > -1) {
            if (!settings.read('no-gui')) openClient()
            if (!settings.read('no-qrcode')) setTimeout(()=>{
                qrcode(launcher ? 'svg' : 'terminal', (qrstring)=>{
                    if (launcher) {
                        launcher.webContents.send('stdout', qrstring)
                    } else {
                        console.log(qrstring)
                    }
                })
            })
            serverProcess.stdout.off('data', cb)
        }
    }
    serverProcess.stdout.on('data', cb)

    serverProcess.stdout.on('data', (data) => {
        console.log(String(data).trim())
    })

    serverProcess.stderr.on('data', (data) => {
        var str = String(data).trim()
        if (str.includes('--debug')) return
        console.error(str)
    })



    serverProcess.on('message', (data) => {
        var [command, args] = data
        if (command === 'settings.write') {
            settings.write(args[0], args[1], false)
        }
    })

    serverProcess.on('close', (code) => {
        console.log('(INFO) Server stopped')
        serverProcess = null
        if (global.defaultClient) global.defaultClient.close()
    })

    if (launcher) {
        serverProcess.on('close', (code) => {
            if (!launcher.isDestroyed()) launcher.webContents.send('server-stopped')
        })
        launcher.webContents.send('server-starting')
    }

}

function stopServerProcess() {

    if (settings.read('no-gui')) {
        if (serverProcess) serverProcess.kill('SIGINT')
        serverProcess = null
        return
    }

    var toClose = clientWindows.filter(w=>w && !w.isDestroyed()),
        closed = 0

    if (toClose.length === 0) {
        serverProcess.kill('SIGINT')
        serverProcess = null
    }

    for (var w of toClose) {
        w.on('closed', ()=>{
            closed++
            if (closed === toClose.length) {
                clientWindows = []
                if (serverProcess) {
                    serverProcess.kill('SIGINT')
                    serverProcess = null
                }
            }
        })
        w.close()
    }

}

function startLauncher() {

    global.launcherSharedGlobals = {
        settings: settings,
        openDocs: openDocs,
        midilist: midi.list
    }
    var address = 'file://' + path.resolve(__dirname + '/../../launcher/' + 'index.html')

    // @electron/remote won't work without this hack
    process.mainModule = {require}
    electronRemote.initialize()

    app.on('ready', function(){

        launcher = window({address:address, shortcuts:dev, width:680, height:(40 + 200 + 20 + 24 * Object.keys(settings.options).filter(x=>settings.options[x].launcher !== false).length / 2), node:true, id: 'launcher'})

        electronRemote.enable(launcher.webContents)

        if (settings.read('useTray')) {

            tray = createTray({
                window: launcher,
                openClient: openClient,
                app: app,
                startServer: startServerProcess,
                stopServer: stopServerProcess
            })

            launcher.on('will-close', (e)=>{
                if (clientWindows.some(w=>w && !w.isDestroyed())) {
                    launcher.hide()
                    e.preventDefault()
                }
            })

        }


        launcher.on('close', (e)=>{
            if (tray && clientWindows.some(w=>w && !w.isDestroyed()) && serverProcess) {
                launcher.hide()
                e.preventDefault()
                return
            }
            process.stdout.write = stdoutWrite
            process.stderr.write = stderrWrite
            if (process.log) process.log = processLog
            if (tray) tray.destroy()
        })

    })

    let processLog = process.log,
        stdoutWrite = process.stdout.write,
        stderrWrite = process.stderr.write

    if (process.log) {
        process.log = function(string, encoding, fd) {
            processLog.apply(process, arguments)
            launcher.webContents.send('stdout', string)
        }
    }

    process.stdout.write = function(string, encoding, fd) {
        stdoutWrite.apply(process.stdout, arguments)
        launcher.webContents.send('stdout', string)
    }

    process.stderr.write = function(string, encoding, fd) {
        stderrWrite.apply(process.stderr, arguments)
        launcher.webContents.send('stderr', string)
    }

    ipcMain.on('start',function(e, options){

        startServerProcess()

    })

    ipcMain.on('stop',function(e, options){

        stopServerProcess()

    })

    ipcMain.on('openClient',function(e, options){

        openClient()

    })

    ipcMain.on('showQRCode',function(e, options){

        qrcode('svg', (qrstring)=>{
            launcher.webContents.send('stdout', qrstring)
        })

    })


    ipcMain.on('hide',function(e, options){

        launcher.hide()

    })
}


if (settings.read('docs')) {

    openDocs()

} else {

    // normal mode:
    // - electron process: launcher and/or built-in client(s)
    // - node process: server (node mode in a forked process)

    app.on('ready', ()=>{
        process.on('SIGINT', function() {
            if (serverProcess) {
                serverProcess.kill('SIGINT')
                serverProcess = null
            }
            process.exit(0)
        })
    })

    app.on('before-quit',()=>{
        if (serverProcess) {
            serverProcess.kill('SIGINT')
            serverProcess = null
        }
    })


    if (settings.cli) {

        startServerProcess()

    } else {

        startLauncher()

    }

}
