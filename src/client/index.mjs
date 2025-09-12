import './globals.mjs'
import './stacktrace.mjs'
import './ui/init.mjs'

import locales from './locales/index.mjs'
import uiLoading from './ui/ui-loading.mjs'
import ipc from './ipc/index.mjs'
import * as backup from './backup.mjs'

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
