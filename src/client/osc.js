import widgetManager from './managers/widgets'
import EventEmitter from './events/event-emitter'
import ipc from './ipc/'
import {deepEqual} from './utils'

var Osc = class Osc extends EventEmitter {

    constructor() {

        super()

        this.syncOnly = false
        this.remoteControl = {}
        this.serverTargets = []

        ;(async ()=>{
            this.remoteControl = (await import('./remote-control')).default
        })()

    }

    send(data) {

        if (this.syncOnly) {

            this.sync(data)

        } else {

            if (!CLIENT_SYNC) data.noSync = 1

            ipc.send('sendOsc', data)

        }

    }

    sync(data) {

        if (CLIENT_SYNC) ipc.send('syncOsc', data)

    }

    match(widget, data) {

        let widgetTarget = widget.getProp('target'),
            match = true

        if (data._rawTarget) {
            // if the message target is provided (when message comes from another client connected to the same server)
            // then we only update the widgets that have the exact same target
            match = deepEqual(widgetTarget, data._rawTarget)

        } else if (data.host === 'midi') {
            // if the message comes from a midi port, only update widgets that send to that port
            let widgetArrayTarget = Array.isArray(widgetTarget) ? widgetTarget : [widgetTarget],
                strTarget = data.host + ':' + data.port

            match = widgetArrayTarget.includes(strTarget) ||
                    (!widgetArrayTarget.includes(null) && this.serverTargets.includes(strTarget))

        }

        return match

    }

    receive(data){

        if (data._rawTarget && !CLIENT_SYNC) return

        if (typeof this.remoteControl.exists === 'function' && this.remoteControl.exists(data.address)) this.remoteControl.exec(data.address, data.args, data.cm)

        var [widgets, restArgs] = widgetManager.getWidgetByAddressAndArgs(data.address, data.args)

        for (let i in widgets) {

            if (this.match(widgets[i], data)) {
                widgets[i].setValue(restArgs,{send:false,sync:true,fromExternal:!data.target})
            }

        }

        this.trigger(data.address, data)

    }

}


var osc = new Osc()

export default osc
