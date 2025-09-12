import {WebSocketServer} from 'ws'
import Client from './client'
import * as settings from '../settings'
import Callbacks from './callbacks'

class IpcServer {

    constructor(webServer, oscServer) {

        this.clients = {}
        this.webServer = webServer
        this.oscServer = oscServer
        this.server = new WebSocketServer({server: webServer.server})
        this.callbacks = new Callbacks(this, webServer, oscServer)


        this.server.on('connection', (socket, req)=>{
            var url  = req.url.split('/'),
                auth = url.pop().replace('_', '/'),
                id = url.pop()

            if (settings.read('authentication')) {
                if (settings.read('authentication') !== Buffer.from(auth, 'base64').toString()) {
                    console.log(`(WARNING) Client connexion refused for ${req.connection.remoteAddress} (authentication failed)`)
                    socket.close()
                    return
                }
            }


            if (!id) return

            id = decodeURI(id)

            if (!this.clients[id]) {

                var client = new Client(socket, id, req.connection.remoteAddress)
                this.clients[id] = client

                var customModule = settings.read('custom-module')
                for (let name of this.callbacks.getEvents()) {
                    client.on(name, (data)=>{
                        if (customModule) {
                            oscServer.customModuleEventEmitter.emit(name, data, {address: client.address, id: client.id})
                        }
                        this.callbacks[name](data, client.id)
                    })
                }

                client.on('destroyed', ()=>{
                    delete this.clients[id]
                })

            } else {

                this.clients[id].open(socket)
                this.clients[id].flush()

            }

            this.clients[id].emit('created')

        })

    }

    send(event, data, id, except) {

        var clients = id ? [this.clients[id]] : this.clients

        for (var k in clients) {
            if (!except || this.clients[k] != this.clients[except]) {
                if (clients[k]) clients[k].send(event, data)
            }
        }

    }


}

export default IpcServer
