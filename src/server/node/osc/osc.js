import osc from 'osc/src/osc.js'
import transports from 'osc/src/platforms/osc-node.js'

osc.UDPPort = transports.UDPPort
osc.TCPSocketPort = transports.TCPSocketPort

export default osc
