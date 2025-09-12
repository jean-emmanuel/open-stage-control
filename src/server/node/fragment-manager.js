import chokidar from 'chokidar'

class FragmentManager {

    constructor(callbacks, ipcServer, webServer) {

        this.ipcServer = ipcServer
        this.webServer = webServer
        this.callbacks = callbacks

        this.fragments = {} // fragment files contents
        this.watchers = {} // fragment files watchers
        this.clients = {} // client ids for each watched fragment file

    }

    read(path, raw, clientId, then) {

        this.callbacks.fileRead({path: path, raw: raw}, clientId, true, (result)=>{
            this.fragments[path] = result
            then(result)
        }, (error)=>{
            this.ipcServer.send('errorLog', `Could not open fragment file:\n ${error}`, clientId)
            this.ipcServer.send('fragmentLoad', {path: path, notFound: true})
            this.deleteFragment(path)
        })

    }

    loadFragment(data, clientId) {

        var path = data.path
        var resolvedPath = this.webServer.resolvePath(path, clientId)

        if (!resolvedPath) {
            this.ipcServer.send('fragmentLoad', {path: path, notFound: true})
            return
        }

        if (!this.clients[resolvedPath]) this.clients[resolvedPath] = []
        if (!this.clients[resolvedPath].includes(clientId)) this.clients[resolvedPath].push(clientId)

        if (!this.fragments[resolvedPath]) {

            this.fragments[resolvedPath] = 'LOADING'

            this.read(resolvedPath, data.raw, clientId, (result)=>{
                this.ipcServer.send('fragmentLoad', {path: path, fileContent: this.fragments[resolvedPath], raw: data.raw}, clientId)
            })

            this.watchers[resolvedPath] = chokidar.watch(resolvedPath, {awaitWriteFinish: {stabilityThreshold: 200}}).on('change', ()=>{
                this.read(resolvedPath, data.raw, clientId, (result)=>{
                    for (let id of this.clients[resolvedPath]) {
                        this.ipcServer.send('fragmentLoad', {path: path, fileContent: this.fragments[resolvedPath], raw: data.raw}, id)
                    }
                })
            }).on('unlink', ()=>{
                this.deleteFragment(resolvedPath)
            })

        } else if (this.fragments[resolvedPath] !== 'LOADING') {

            this.ipcServer.send('fragmentLoad', {path: path, fileContent: this.fragments[resolvedPath], raw: data.raw}, clientId)

        }

    }

    deleteFragment(path) {

        this.watchers[path].close()
        delete this.clients[path]
        delete this.fragments[path]
        delete this.fragments[path]

    }

}


export default FragmentManager
