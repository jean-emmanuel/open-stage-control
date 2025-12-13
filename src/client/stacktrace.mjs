import StackTrace from 'stacktrace-js'
import ipc from './ipc/index.mjs'
import uiConsole from './ui/ui-console.mjs'

window.onerror = function(msg,url,row,col, error) {

    StackTrace.fromError(error).then((stackframes)=>{

        var stringifiedStack = stackframes.join('\n')

        uiConsole.log('error', `${msg}\n${stringifiedStack}`)
        ipc.send('errorLog', `(ERROR, CLIENT) ${msg}\n${stringifiedStack}`)

    }).catch(()=>{

        uiConsole.log('error', `${msg}\n    at ${url}:${row}:${col}\n    (no stacktrace available)`)
        ipc.send('errorLog', `(ERROR, CLIENT) ${msg}\n    at ${url}:${row}:${col}\n    (no stacktrace available)`)

    })

}
