import sourceMap from 'source-map-support'
import * as settings from './settings'
import qrcode from './qrcode'
import zeroconf from './zeroconf'
import DocsServer from './docs-server'
import OscServer from './osc'
import WebServer from './server'
import IpcServer from './ipc/server'


sourceMap.install({handleUncaughtExceptions: false})

process.on('uncaughtException', (err)=>{
    console.error('(ERROR) A JavaScript error occurred in the main process:')
    console.error(err.stack)
})


if (settings.read('docs')) {

    var docsServer = new DocsServer()
    docsServer.open()

} else {

    var webServer = new WebServer(),
        oscServer = new OscServer(),
        ipcServer = new IpcServer(webServer, oscServer)

    webServer.start(ipcServer)
    oscServer.start(ipcServer)

    process.on('SIGINT', function() {
        webServer.stop()
        oscServer.stop()
        zeroconf.unpublishAll()
        process.exit(0)
    })

    if (!process.env.OSC_SERVER_PROCESS) webServer.on('serverStarted', ()=>{
        if (!settings.read('no-qrcode')) {
            qrcode('terminal', (qr)=>console.log(qr))
        }
    })

}
