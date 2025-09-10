var ansiHTML = require('ansi-html'),
    WS = require('../node_modules/ws'),
    path = require('path')

function send(msg, data){
    var ipc = new WS('ws://127.0.0.1:8080/dev/')
    ipc.on('error', ()=>{})
    ipc.on('open', ()=>{
        ipc.send(JSON.stringify([msg, data]))
        ipc.close()
    })
}

module.exports = function watchChangePlugin() {

    var reloadClient = false

    return {

        buildEnd(error) {

            if (error) {
                var msg = `<div class="error-stack">
                               ${error.message.replace(path.resolve(__dirname + '/..'),'')} at line ${error.loc.line}\n${error.frame}
                           </div>`
                send('errorPopup', msg.trim())
                reloadClient = false
            } else {
                reloadClient = true
            }

        },

        writeBundle() {
            if (reloadClient) {
                send('reload')
            }
        }
    }
}
