import cache from './managers/cache'

var session, state, editor, ipc
;(async ()=>{
    session = (await import('./managers/session/')).default
    state = (await import('./managers/state')).default
    editor = (await import('./editor/')).default
    ipc = (await import('./ipc/')).default
})()

var localBackup = cache.get('backup', false)


export const exists = localBackup !== null

export function save() {

    if (session.session) {
        cache.set('backup', {
            session: session.session.data,
            saveMode: session.saveMode,
            sessionPath: session.sessionPath,
            fragments: session.fragments,
            state: state.get(),
            history: editor.history,
            historyState: editor.historyState,
            editorEnabled: editor.enabled,
        }, false)
    }

}

export function load() {

    if (localBackup) {

        var data = localBackup

        cache.remove('backup', false)
        for (let k in data.fragments) {
            session.setFragment({path: k, fileContent: data.fragments[k]})
        }
        session.load(data.session, ()=>{

            session.setSaveMode(data.saveMode)
            state.set(data.state, false)

            editor.clearHistory()
            editor.history = data.history
            editor.historyState = data.historyState

            if (data.editorEnabled) editor.enable()


            ipc.send('sessionSetPath', {path: data.sessionPath})
            session.setSessionPath(data.sessionPath)

        })

    }

}
