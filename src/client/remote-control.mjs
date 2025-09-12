import {updateWidget} from './editor/data-workers'
import editor from './editor'
import widgetManager from './managers/widgets'
import stateManager from './managers/state'
import sessionManager from './managers/session'
import deepExtend from 'deep-extend'
import notifications from './ui/notifications'
import uiConsole from './ui/ui-console'

var callbacks = {
    '/EDIT': function(args, custom_module) {

        if (READ_ONLY && !custom_module) return

        var [id, json, opts] = args,
            newdata = typeof json == 'string' ? JSON.parseFlex(json) : json,
            options = typeof opts == 'string' ? JSON.parseFlex(opts) : {},
            widgets = widgetManager.getWidgetById(id)

        if (!widgets.length) return

        for (var i = widgets.length - 1; i >= 0; i--) {

            var widget = widgets[i],
                data = widget.props

            for (var k in newdata) {
                data[k] = newdata[k]
            }

            updateWidget(widget, {
                reuseChildren: !(newdata.widgets || newdata.tabs),
                changedProps: Object.keys(newdata)
            })

        }

        editor.pushHistory()

        if (options.noWarning) editor.unsavedSession = false

    },
    '/EDIT/MERGE': function(args, custom_module) {

        if (READ_ONLY && !custom_module) return

        var [id, json, opts] = args,
            newdata = typeof json == 'string' ? JSON.parseFlex(json) : json,
            options = typeof opts == 'string' ? JSON.parseFlex(opts) : {},
            widgets = widgetManager.getWidgetById(id)

        if (!widgets.length) return

        for (var i = widgets.length - 1; i >= 0; i--) {

            var widget = widgets[i],
                data = widget.props

            deepExtend(data, newdata)

            updateWidget(widget, {
                reuseChildren: !(newdata.widgets || newdata.tabs),
                changedProps: Object.keys(newdata)
            })

        }

        editor.pushHistory()

        if (options.noWarning) editor.unsavedSession = false

    },
    '/EDIT/UNDO': function(args, custom_module) {

        if (READ_ONLY && !custom_module) return

        editor.undo()

    },
    '/EDIT/REDO': function(args, custom_module) {

        if (READ_ONLY && !custom_module) return

        editor.redo()

    },
    '/EDIT/GET': function(args) {

        var [target, idOrAddress, ...preArgs] = args,
            widgets = []

        if (idOrAddress[0] == '/') {

            widgets = widgetManager.getWidgetByAddress(
                widgetManager.createAddressRef(null, preArgs, idOrAddress)
            )

        } else {

            widgets = widgetManager.getWidgetById(idOrAddress)

        }

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].sendValue({
                target: [target],
                address: '/EDIT/GET',
                preArgs: [idOrAddress, ...preArgs],
                v: JSON.stringify(widgets[i].props),
                noSync: true
            }, {force: true})

        }

    },
    '/GET': function(args, transparentReply) {

        var [target, idOrAddress, ...preArgs] = args,
            widgets = []

        if (idOrAddress[0] == '/') {

            widgets = widgetManager.getWidgetByAddress(
                widgetManager.createAddressRef(null, preArgs, idOrAddress)
            )

        } else {

            widgets = widgetManager.getWidgetById(idOrAddress)

        }

        for (var i = widgets.length - 1; i >= 0; i--) {

            let overrides = {
                target: [target],
                noSync: true
            }

            if (!transparentReply) {

                overrides.address = '/GET'
                overrides.preArgs = [idOrAddress, ...preArgs]

            }

            return widgets[i].sendValue(overrides, {force: true})

        }

    },
    '/GET/#': function(args) {

        callbacks['/GET'](args, true)

    },
    '/SET': function(args) {

        var [idOrAddress, ...preArgsOrValue] = args,
            widgets = [],
            value = null

        if (idOrAddress[0] == '/') {

            [widgets, value] = widgetManager.getWidgetByAddressAndArgs(
                idOrAddress,
                preArgsOrValue
            )

        } else {

            widgets = widgetManager.getWidgetById(idOrAddress)
            value = preArgsOrValue
            if (value.length == 0) value = null
            else if (value.length == 1) value = value[0]

        }

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].setValue(value, {
                sync: true,
                send: true
            })

        }

    },
    '/STATE/GET': function(args) {

        if (Array.isArray(args)) args = args[0]

        var target = args,
            root = widgetManager.getWidgetById('root')[0],
            state = stateManager.get()

        root.sendValue({
            target: [target],
            address: '/STATE/GET',
            preArgs: [],
            v: JSON.stringify(state),
            noSync: true
        }, {force: true})

    },
    '/STATE/SET': function(args) {

        if (!Array.isArray(args)) args = [args]

        var json = args[0],
            data = typeof json == 'string' ? JSON.parseFlex(json) : json,
            send = !(args[1] === 0 || args[1] === false)

        stateManager.set(data, send)

    },
    '/STATE/STORE': function(args) {

        stateManager.quickSave()

    },
    '/STATE/RECALL': function(args) {

        stateManager.quickLoad()

    },
    '/STATE/SEND': function(args) {

        stateManager.send()

    },
    '/STATE/OPEN': function(args) {

        if (!Array.isArray(args)) args = [args]

        stateManager.requestOpen(args[0])

    },
    '/STATE/SAVE': function(args) {

        if (!Array.isArray(args)) args = [args]

        stateManager.save(args[0])

    },
    '/NOTIFY': function(args) {

        if (!Array.isArray(args)) args = [args]

        var icon
        if (args.length > 1 && typeof args[0] === 'string' && args[0].indexOf(' ') === -1) {
            icon = args.shift()
        }

        notifications.add({
            message: args.join('\n') || ' ',
            icon: icon
        })

    },
    '/LOG': function(args) {

        console.log(args)

    },
    '/SESSION/CREATE': function(args) {

        editor.unsavedSession = false

        sessionManager.create()

    },
    '/SESSION/OPEN': function(args) {

        if (!Array.isArray(args)) args = [args]

        sessionManager.requestOpen(args[0])

    },
    '/SESSION/SAVE': function(args) {

        if (!Array.isArray(args)) args = [args]

        sessionManager.save(args[0])

    },
    '/TABS': function(args) {

        if (!Array.isArray(args)) args = [args]

        for (let id of args) {
            let ws = widgetManager.getWidgetById(id)
            for (let w of ws) {
                if (w.getProp('type') === 'tab') {
                    var index = w.parent.children.indexOf(w)
                    w.parent.setValue(index, {sync: true, send: false})
                }
            }
        }
    },
    '/SCRIPT': function(args) {

        if (!Array.isArray(args)) args = [args]

        uiConsole.script.run({input_code: args[0]}, {sync: true, send: true})

    },
    '/RELOAD': function(args) {

        window.location.href = window.location.href

    }
}

export default {
    exec: function(name, args, custom_module){
        if (callbacks[name]) {
            callbacks[name](args, custom_module)
        }
    },
    exists: function(name){
        return name in callbacks
    }
}
