import './globals'
import './stacktrace'
import './ui/init'

import locales from './locales'
import uiLoading from './ui/ui-loading'
import ipc from './ipc/index'
import * as backup from './backup'

uiLoading(locales('loading_server'))

function init() {

    setTimeout(()=>{

        ipc.init()

        document.title = TITLE

        ipc.send('open', {hotReload: backup.exists})

        window.onunload = ()=>{
            ipc.send('close')
        }

        backup.load()


    }, 100)

}

if (document.requestStorageAccess) {
    document.requestStorageAccess().then(init, init)
} else {
    init()
}
