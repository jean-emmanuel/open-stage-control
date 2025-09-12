export default function(eventName, options={}){

    var widget_storage_key = '_' + eventName + '_widget'

    function closestWidgetContainer(target) {
        var container = target
        while (container !== null) {
            if (container[widget_storage_key]) {
                return container
            } else {
                container = container.parentNode
            }
        }
        return null
    }

    function triggerWidgetEvent(target, event) {
        var container = closestWidgetContainer(target)
        if (container) container[widget_storage_key].trigger(eventName, event)
    }

    document.addEventListener(eventName, (event)=>{
        triggerWidgetEvent(event.target, event)
    }, {passive: !!options.passive, capture: !!options.capture})

    return {

        setup: function(options) {
            var {element} = options || {element: this.container}
            element[widget_storage_key] = this
        },

        teardown: function(options) {
            var {element} = options || {element: this.container}
            delete element[widget_storage_key]
        }


    }


}
