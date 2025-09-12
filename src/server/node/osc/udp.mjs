import osc from './osc'
import * as settings from '../settings'
import zeroconf from '../zeroconf'

export default class OscUDPServer {

    constructor() {

        this.port = settings.read('osc-port') || settings.read('port') || 8080

        this.server = new osc.UDPPort({
            localAddress: '0.0.0.0',
            localPort: this.port,
            metadata: true,
            broadcast: true
        })

        this.server.on('error', function(e) {
            if (e.code === 'EADDRINUSE') {
                console.error(`(ERROR, UDP) could not open port ${oscInPort} (already in use) `)
            } else {
                console.error('(ERROR, UDP)', e)
            }
        })

        this.on = this.server.on.bind(this.server)
        this.send = this.server.send.bind(this.server)
    }

    start() {

        this.server.open()

        zeroconf.publish({
            name: settings.infos.productName + (settings.read('instance-name') ? ' (' + settings.read('instance-name') + ')' : ''),
            protocol: 'udp',
            type: 'osc',
            port: this.port
        })

    }

    stop() {

        this.server.close()

    }
}
