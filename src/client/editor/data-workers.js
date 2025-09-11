import widgetManager from '../managers/widgets'
import stateManager from '../managers/state'
import parser from '../parser'
import * as resize from '../events/resize'

var Panel, Matrix, editor
;(async ()=>{
    Panel = (await import('../widgets/containers/panel')).default
    Matrix = (await import('../widgets/containers/matrix')).default
    editor = (await import('./')).default
})()

var scrollState = {}

function updateWidget(widget, options={}) {

    if (options.changedProps) {
        // alternate routine for small edits
        var propNames = options.changedProps

        if (
            // if non dynamic props have changed, skip this and use rebuild routine
            !propNames.some(n => !widget.isDynamicProp(n))
        ) {

            var edited = widget.updateProps(options.changedProps, null, {fromEditor: true}) || widget

            editor.widgetTree.updateTree(editor.selectedWidgets)

            if (editor.selectedWidgets.includes(widget) && !options.preventSelect) {
                editor.select(edited)
            }

            return edited

        }

    }


    if (!widget.mounted) {
        console.debug(`updateWidget prevented on ${widget.getProp('id')} (widget not mounted yet)`)
        return
    }

    var reuseChildren = options.reuseChildren !== false && widget instanceof Panel
                        && !(widget instanceof Matrix)

    var children = undefined,
        removedChildren = []

    if (reuseChildren) {
        children = [...widget.children]
        if (options.removedIndexes) {
            options.removedIndexes = options.removedIndexes.sort((a, b) => b - a)
            for (let i of options.removedIndexes) {
                removedChildren.push(children.splice(i, 1)[0])
            }
        }
        if (options.addedIndexes) {
            options.addedIndexes = options.addedIndexes.sort((a, b) => a - b)
            for (let i of options.addedIndexes) {
                children.splice(i, 0, null)
            }
        }

    }

    // get widget's index
    var index = widget.parent.children.indexOf(widget)

    // list widgets to remove
    removedChildren = removedChildren.filter(x => x !== undefined)
    var removedWidgets = reuseChildren ?
            removedChildren.map(x => x.getAllChildren().concat(x)).concat(widget).reduce((a,b)=>a.concat(b), []) :
            widget.getAllChildren().concat(widget)

    // save state
    if (stateManager.queueCounter === 0) {
        scrollState = {} // scrollable modals don't store their scroll state in their value
    }
    stateManager.incrementQueue()
    for (let w of removedWidgets) {
        if (widgetManager.widgets[w.hash]) {
            let id = w.getProp('id'),
                value = w.getValue(),
                valueProp = w.getProp('value')

            stateManager.pushValueState(id, value)
            if (valueProp !== '' && valueProp !== undefined) stateManager.pushValueOldProp(id, valueProp)
        }
        if (w.getProp('scroll') && w.getProp('type') === 'modal') {
            var s = w.getScroll()
            if (s[0] !== 0 || s[1] !== 0) {
                scrollState[w.getProp('id')] = s
            }
        }
    }

    // remove old widgets
    widgetManager.removeWidgets(removedWidgets)

    // create new widget
    var newWidget = parser.parse({
        data: widget.props,
        parent: widget.parent,
        parentNode: widget.parentNode,
        reCreateOptions: options.reCreateOptions,
        locals: widget.parsersLocalScope,
        variables: widget.variables,
        hash: widget.hash,
        children: children,
        index: index
    })

    newWidget.container.parentNode.replaceChild(newWidget.container, widget.container)

    if (newWidget.getProp('type') === 'tab') newWidget.parent.trigger('tab-created', {widget: widget})


    if (reuseChildren && !(newWidget instanceof Panel)) {
        // remove remaining children if widget is not a container anymore
        widgetManager.removeWidgets(widget.getAllChildren())
    }

    if (reuseChildren) {
        // children don't listen to their parent's 'widget-created' event
        // so we have to let them know it's been updated
        widgetManager.trigger('prop-changed', {
            id: newWidget.getProp('id'),
            props: [],
            widget: newWidget,
            options: {}
        })
    }

    resize.check(newWidget.container)

    // restore state
    stateManager.decrementQueue()
    if (stateManager.queueCounter === 0) {
        for (let id in scrollState) {
            for (let w of widgetManager.getWidgetById(id)) {
                if (w.getProp('scroll')) w.setScroll(scrollState[id][0], scrollState[id][1])
            }
        }
    }

    editor.widgetTree.updateTree(editor.selectedWidgets)

    if (editor.selectedWidgets.includes(widget) && !options.preventSelect) {
        editor.select(newWidget)
    }

    return newWidget

}


var fakeStore = {}

var incrementWidget = function(data, root){

    if (!data) return

    if (root !== false) {
        fakeStore = {
            id:[],
            address:[]
        }
    }

    if (Array.isArray(data)) {
        for (let i in data) {
            data[i] = incrementWidget(data[i], false)
        }
        return data
    }

    var id = String(data.id),
        address = String(data.address)

    if (id && address == '/' + id) {

        data.address = 'auto'

    } else if (!address.match(/^(auto|\/control|\/note|\/program|\/sysex|\/mtc|\/key_pressure|\/channel_pressure|\/pitch)$/)) {

        var addressref = widgetManager.createAddressRef(null, data.preArgs,address)

        while (fakeStore.address.indexOf(address) != -1 || widgetManager.getWidgetByAddress(addressref).length) {

            address = address.replace(/([0-9]*)$/,function(m){
                var n = parseInt(m)+1
                n = isNaN(n)?1:n
                return n
            })
            addressref = widgetManager.createAddressRef(null, data.preArgs,address)
        }

        fakeStore.address.push(address)

        data.address = address

    }

    if (id) {
        while (fakeStore.id.indexOf(id) != -1 || widgetManager.getWidgetById(id).length) {
            id = id.replace(/([0-9]*)$/,function(m){
                var n = parseInt(m)+1
                n = isNaN(n)?1:n
                return n
            })
        }

        fakeStore.id.push(id)

        data.id = id

    }

    if (data.widgets && data.widgets.length) {
        for (let i in data.widgets) {
            data.widgets[i] = incrementWidget(data.widgets[i], false)
        }
    }

    if (data.tabs && data.tabs.length) {
        for (let i in data.tabs) {
            data.tabs[i] = incrementWidget(data.tabs[i], false)
        }
    }

    return data

}

export {
    updateWidget,
    incrementWidget
}
