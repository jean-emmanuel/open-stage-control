import StackTrace from 'stacktrace-js'
import ipc from './ipc/index.mjs'

var uiConsole
;(async()=>{
    uiConsole = (await import('./ui/ui-console.mjs')).default
})()

window.onerror = function(msg,url,row,col, error) {

    StackTrace.fromError(error).then((stackframes)=>{

        var stringifiedStack = stackframes.filter((sf)=>{

            return !sf.fileName.match('browser-pack')

        }).map(function(sf) {

            if (sf.functionName.match(/Object\./)) sf.functionName = 'require'

            return `    at ${sf.functionName} (${sf.fileName}:${sf.lineNumber}:${sf.columnNumber})`

        }).join('\n')

        uiConsole.log('error', `${msg}\n${stringifiedStack}`)
        ipc.send('errorLog', `(ERROR, CLIENT) ${msg}\n${stringifiedStack}`)

    }).catch(()=>{

        uiConsole.log('error', `${msg}\n    at ${url}:${row}:${col}\n    (no stacktrace available)`)
        ipc.send('errorLog', `(ERROR, CLIENT) ${msg}\n    at ${url}:${row}:${col}\n    (no stacktrace available)`)

    })

}
