import {EventEmitter} from 'events'
import * as settings from '../settings.mjs'
import OscUDPServer from './udp.mjs'
import OscTCPServer from './tcp.mjs'
import CustomModule from '../custom-module.mjs'
import MidiServer from '../midi.mjs'

export default class OscServer {

    constructor(){

        this.oscUDPServer = new OscUDPServer()
        this.oscTCPServer = new OscTCPServer()
        this.tcpInPort = settings.read('tcp-port')
        this.midiServer = settings.read('midi') ? new MidiServer() : null

        this.debug = settings.read('debug')

        this.customModuleEventEmitter = new EventEmitter()
        this.customModule = settings.read('custom-module') ? new CustomModule(settings.read('custom-module'), {
            app: this.customModuleEventEmitter,
            tcpServer: this.oscTCPServer,
            sendOsc: this.sendOsc.bind(this),
            receiveOsc: this.receiveOsc.bind(this),
            send: (host, port, address, ...args)=>{
                if (host.indexOf(':') > -1) {
                    args.unshift(address)
                    address = port
                    var split = host.split(':')
                    host = split[0]
                    port = parseInt(split[1])
                }

                this.sendOsc({host, port, address, args:args.map(x=>this.parseArg(x))})
            },
            receive: (host, port, address, ...args)=>{
                if (host[0] === '/') {
                    // host and port can be skipped
                    if (address !== undefined) args.unshift(address)
                    if (port !== undefined) args.unshift(port)
                    address = host
                    host = port = undefined
                } else if (host.indexOf(':') > -1) {
                    args.unshift(address)
                    address = port
                    var split = host.split(':')
                    host = split[0]
                    port = parseInt(split[1])
                }
                var lastArg = args[args.length - 1],
                    options = {}
                if (typeof lastArg === 'object' && lastArg !== null && lastArg.clientId !== undefined) {
                    options = args.pop()
                }
                this.receiveOsc({host, port, address, args:args.map(x=>this.parseArg(x)), cm: 1}, options.clientId)
            },
        }) : {}

    }

    parseArg(arg, type){

        if (arg === null) return null

        if (typeof arg === 'object' && arg.type && arg.type.length === 1) return arg

        if (type && type[0].match(/[bhtdscrmifTFNI]/)) {

            type = type[0]

            switch (type) {
                case 'i':
                    return {type: type, value: parseInt(arg)}
                case 'd':
                case 'f':
                    return {type: type, value: parseFloat(arg)}
                case 'T':
                case 'F':
                case 'N':
                    return {type: type}
                default:
                    return {type: type, value: arg}


            }

        }

        switch (typeof arg) {
            case 'number':
                return {type: 'f', value: arg}
            case 'boolean':
                return {type: arg ? 'T' : 'F', value: arg}
            case 'string':
                return {type: 's', value: arg}
            default:
                return {type: 's', value: JSON.stringify(arg)}
        }
    }

    sendOsc(data){

        if (!data) return

        if (data.host == 'midi') {

            if (this.midiServer) this.midiServer.send(data)

        } else {

            if (typeof data.address !== 'string' || data.address[0] !== '/') {
                console.error('(ERROR, OSC) Malformed address: ' + data.address)
                return
            }

            if (isNaN(parseInt(data.port))) {
                console.error('(ERROR, OSC) Invalid port: ' + data.port)
                return
            }

            if (this.tcpInPort && this.oscTCPServer.clients[data.host] && this.oscTCPServer.clients[data.host][data.port]) {

                this.oscTCPServer.clients[data.host][data.port].send({
                    address: data.address,
                    args: data.args
                })

            } else {

                this.oscUDPServer.send({
                    address: data.address,
                    args: data.args
                }, data.host, data.port)

            }

            if (this.debug) {
                console.log('\x1b[35m(DEBUG, OSC) Out: ', `{ address: '${data.address}', args: `, data.args, '} To: ' + data.host + ':' + data.port, '\x1b[0m')
            }

        }


    }

    receiveOsc(data, clientId){

        if (!data) return

        for (var i in data.args) {
            data.args[i] = data.args[i].value
        }

        if (data.args.length==1) data.args = data.args[0]

        this.ipcServer.send('receiveOsc', data, clientId)

        if (this.debug) console.log('\x1b[36m(DEBUG, OSC) In: ', {address:data.address, args: data.args}, 'From: ' + data.host + ':' + data.port, '\x1b[0m')

    }


    oscInFilter(data){
        if (this.customModule.oscInFilter) {
            try {
                return this.customModule.oscInFilter(data)
            } catch(e) {
                console.error('(ERROR, CUSTOM MODULE)', e)
                return data
            }
        } else {
            return data
        }
    }
    oscOutFilter(data){
        if (this.customModule.oscOutFilter) {
            try {
                return this.customModule.oscOutFilter(data)
            } catch(e) {
                console.error('(ERROR, CUSTOM MODULE)', e)
                return data
            }
        } else {
            return data
        }
    }

    oscInHandler(msg, timetag, info){
        var data = this.oscInFilter({address: msg.address, args: msg.args, host: info.address, port: info.port})
        if (!data) return
        this.receiveOsc(data)
    }

    oscInHandlerWrapper(msg, timetag, info) {
        var delay = timetag? Math.max(0,timetag.native - Date.now()) : 0
        if (delay) {
            setTimeout(()=>{
                this.oscInHandler(msg, timetag, info)
            }, delay)
        } else {
            this.oscInHandler(msg, timetag, info)
        }
    }

    start(ipcServer){

        this.ipcServer = ipcServer

        if (this.midiServer) this.midiServer.init((data)=>{

            data = this.oscInFilter({address: data.address, args: data.args, host: data.host, port: data.port})

            if (!data) return

            this.receiveOsc(data)

        })

        this.oscUDPServer.on('message', this.oscInHandlerWrapper.bind(this))
        this.oscUDPServer.start()

        if (settings.read('tcp-port')) {
            this.oscTCPServer.on('message', this.oscInHandlerWrapper.bind(this))
            this.oscTCPServer.start()
        }

        if (this.customModule.init) {
            try {
                this.customModule.init()
            } catch(e) {
                console.error('(ERROR, CUSTOM MODULE)', e)
            }
        }

    }

    stop() {

        if (this.customModule.stop) this.customModule.stop()
        if (this.midiServer) this.midiServer.stop()

    }

    send(host, port, address, args, typeTags, clientId) {
        // public send function

        var message = []

        if (!Array.isArray(args)) args = [args]

        if (typeof args === 'object' && args !== null) {

            var typeTag,
                arg

            for (var i = 0; i < args.length; i++) {

                if (typeTags && typeTags[i]) typeTag = typeTags[i]
                arg = this.parseArg(args[i], typeTag)

                if (arg !== null) message.push(arg)

            }
        }

        var data = this.oscOutFilter({address:address, args: message, host: host, port: port, clientId: clientId})

        this.sendOsc(data)

    }

}
