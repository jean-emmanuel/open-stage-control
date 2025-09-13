import {EventEmitter} from 'events'
import net from 'net'
import * as settings from '../settings.mjs'
import osc from './osc.mjs'
import zeroconf from '../zeroconf'

class OscTCPClient extends EventEmitter {

    constructor(options) {

        super()

        this.options = options
        this.remoteAddress = options.address
        this.remotePort = options.port

        this.open()

    }

    open() {

        this.port = new osc.TCPSocketPort(this.options)

        this.port.on('error', (err)=>{
            console.error('(ERROR, TCP)', err)
        })

        this.port.on('close', (hadErr)=>{
            console.log(`(TCP) Connection closed (${this.remoteAddress}:${this.remotePort})`)
            if (!this.options.socket) {
                console.log(`(TCP) Attempting reconnection in 5s (${this.remoteAddress}:${this.remotePort})`)
                this.reconnect()
            } else {
                this.emit('die')
            }
        })

        this.port.on('message', (msg, timetag)=>{
            this.emit('message', msg, timetag, {address: this.remoteAddress, port: this.remotePort})
        })

        this.port.on('ready', ()=>{
            console.log(`(TCP) Connection established (${this.remoteAddress}:${this.remotePort})`)
        })

        if (!this.options.socket) {

            this.port.open()

        } else {

            this.port.emit('ready')

        }

    }

    reconnect() {

        setTimeout(()=>{
            this.open()
        }, 5000)

    }

    send(msg) {

        this.port.send(msg)

    }



}

export default class OscTCPServer extends EventEmitter {

    constructor() {

        super()

        this.port = settings.read('tcp-port')
        this.targets = settings.read('tcp-targets')

        this.clients = {}

        this.server = net.createServer(this.bindSocket.bind(this))
        this.on = this.server.on.bind(this.server)
    }

    bindSocket(socket) {

        this.addClient(new OscTCPClient({
            metadata: true,
            socket: socket,
            address: socket.remoteAddress.replace('::ffff:', ''),
            port: socket.remotePort
        }))

    }

    addClient(client) {

        this.clients[client.remoteAddress] = this.clients[client.remoteAddress] || {}
        this.clients[client.remoteAddress][client.remotePort] = client

        client.on('message', (msg, timetag, info)=>{
            this.emit('message', msg, timetag, info)
        })

        client.on('die', (hadError)=>{
            if (this.clients[client.remoteAddress]) delete this.clients[client.remoteAddress][client.remotePort]
        })

    }


    start() {


        this.server.listen({port: this.port})

        for (var i in this.targets) {

            this.addClient(new OscTCPClient({
                metadata: true,
                address: this.targets[i].split(':')[0],
                port: this.targets[i].split(':')[1]
            }))

        }

        zeroconf.publish({
            name: settings.infos.productName + (settings.read('instance-name') ? ' (' + settings.read('instance-name') + ')' : ''),
            protocol: 'tcp',
            type: 'osc',
            port: this.port
        }).on('error', (e)=>{
            console.error(`Error: Zeroconf: ${e.message}`)
        })

    }

    stop() {

        this.server.close()

    }

}
