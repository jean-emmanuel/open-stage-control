import {normalizeDragEvent, resetEventOffset, TRAVERSING_SAMEWIDGET} from './utils.mjs'
import iOS from '../ui/ios.mjs'

var targets = {},
    previousPointers = {}

function pointerDownHandler(event) {

    if (event.capturedByEditor || event.touchPunch) return event

    if (!event.target._drag_multitouch) {
        for (var i in targets) {
            if (targets[i] == event.target) return event
        }
    }

    event = normalizeDragEvent(event)
    event.stopPropagation = true

    var target = closestDragContainer(event.target)

    if (!target) return event

    if (event.traversingStack) {

        var widget = target._drag_widget,
            local = event.traversingStack.stack[event.traversingStack.stack.length - 1]

        if (widget.getProp) {
            // if first touched widget is a container, wait until another widget is touched while moving
            event.traversingStack.firstType = widget.isContainer ? '?' : widget.getProp('type')
        }

        if (local.mode === TRAVERSING_SAMEWIDGET) {
            if (local.type === '') {
                local.type = event.traversingStack.firstType
            }
            event.traversing = local.type === event.traversingStack.firstType || event.traversingStack.firstType === '?'
        } else {
            event.traversing = true
        }

    }

    targets[event.pointerId] = target
    previousPointers[event.pointerId] = event


    if (event.pointerType !== 'mouse') domObserver.activate()

    triggerWidgetEvent(targets[event.pointerId], 'draginit', event)

    if (event.cancelDragEvent) clearPointer(event)

    return event

}

function pointerMoveHandler(event) {

    event = normalizeDragEvent(event, previousPointers[event.pointerId])

    event.stopPropagation = true

    if (event.traversing) {

        var previousTarget = targets[event.pointerId],
            target = event.isTouch ?
                document.elementFromPoint(event.clientX, event.clientY)
                : event.target

        if (target) target = closestDragContainer(target)

        var local = null,
            containersOnly = false,
            backupTarget = target

        if (target && event.traversingStack) {
            for (var i = event.traversingStack.stack.length - 1; i > -1; i--) {
                if (event.traversingStack.stack[i].container.contains(target)) {
                    local = event.traversingStack.stack[i]
                    break
                }
            }
            if (!local) {
                target = null
            } else if (local.mode === TRAVERSING_SAMEWIDGET) {
                var widget = target._drag_widget
                if (local.type === '?' && widget.getProp && !widget.isContainer) local.type = widget.getProp('type')
                if (widget.getProp && local.type !== widget.getProp('type')) target = null
            }
        }




        if (target && event.isTouch) {
            resetEventOffset(event, target)
        }

        if (previousTarget !== target && !containersOnly) {
            triggerWidgetEvent(previousTarget, 'dragend', event)
        }


        if (target) {

            if (previousTarget === target) {

                triggerWidgetEvent(target, 'drag', event)

            } else  {
                triggerWidgetEvent(target, 'draginit', event)

            }

        } else {

            // notify container of move events if no draggable widget is under the pointer
            triggerWidgetEvent(backupTarget, 'drag', event, true)

        }

        targets[event.pointerId] = target


    } else {
        triggerWidgetEvent(targets[event.pointerId], 'drag', event)
    }

    previousPointers[event.pointerId] = event

}

function pointerUpHandler(event) {

    event = normalizeDragEvent(event, previousPointers[event.pointerId])
    event.stopPropagation = true

    triggerWidgetEvent(targets[event.pointerId], 'dragend', event)

    clearPointer(event)

}

function clearPointer(event) {

    delete targets[event.pointerId]
    delete previousPointers[event.pointerId]

    if (domObserver.active) {
        var t
        for (var k in targets) {t=targets[k]}
        if (t === undefined) domObserver.deactivate()
    }

}


// Move / Up Filter

function pointerMoveFilter(event) {

    if (targets[event.pointerId] !== undefined) {
        pointerMoveHandler.call(targets[event.pointerId], event)
    }

}

function pointerUpFilter(event) {

    if (targets[event.pointerId] !== undefined) {
        pointerUpHandler.call(targets[event.pointerId], event)
        delete targets[event.pointerId]
    }

}

// Mouse events wrappers

function mouseDownCapture(event) {
    if (event.pointerType === 'touch') return
    event.stopPropagation()
    // event.pointerId = 'mouse'
    pointerDownHandler(event)
}

function mouseMoveCapture(event) {
    if (event.pointerType === 'touch') return
    // event.pointerId = 'mouse'
    event.inertia = event.ctrlKey ? 10 : 1
    pointerMoveFilter(event)
}

function mouseUpCapture(event){
    if (event.pointerType === 'touch') return
    // event.pointerId = 'mouse'
    pointerUpFilter(event)
}


// Touch events wrappers

// Touchend event is not emitted when target element is removed/detached
// Watch for DOM mutations and simulate pointerUp if a registered
// target is removed/detached
const domObserver = new MutationObserver(function(mutations) {
    for (var id in targets) {
        var event = previousPointers[id],
            target = targets[id]

        if (!event || event.pointerType === 'mouse') continue

        for (var mutation of mutations) {
            for (var node of mutation.removedNodes) {
                if (node == target || node.contains(target)){
                    pointerUpHandler(event)
                }
            }
        }
    }
})
domObserver.active = false
domObserver.activate = ()=>{
    if (!domObserver.active) {
        domObserver.observe(DOM.get('#osc-container')[0], {subtree: true, childList: true})
        domObserver.active = true
    }
}
domObserver.deactivate = ()=>{
    if (domObserver.active) {
        domObserver.disconnect()
        domObserver.active = false
    }
}

function touchDownCapture(event) {

    var preventDefault = true

    event.stopPropagation()

    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]

        if (event.traversingStack) {
            touchEvent.traversingStack = event.traversingStack
        }

        touchEvent.pointerId = touchEvent.identifier

        touchEvent = pointerDownHandler(touchEvent)

        // allow scroll if drag is cancelled or widget is a container
        if (touchEvent.cancelDragEvent || touchEvent.allowScroll) preventDefault = false
    }
    if (preventDefault) event.preventDefault()
}

function touchMoveCapture(event) {
    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]
        touchEvent.fingers = 0
        for (var j in event.touches) {
            if (event.touches[j].target && event.touches[j].target.isSameNode(touchEvent.target)) {
                touchEvent.fingers += 1
            }
        }

        touchEvent.pointerId = touchEvent.identifier
        pointerMoveFilter(touchEvent)
    }
}

function touchUpCapture(event) {
    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]
        touchEvent.pointerId = touchEvent.identifier
        pointerUpFilter(touchEvent)
    }
}



function ancestorDragContainers(target) {
    var containers = [],
        container = target
    while (container !== null) {
        if (container._drag_widget) {
            containers.splice(0, 0, container._drag_widget)
            if (container._drag_widget.root) break
        }
        container = container.parentNode
    }
    return containers
}

function closestDragContainer(target) {
    var container = target
    while (container !== null) {
        if (container._drag_widget) {
            return container
        } else {
            container = container.parentNode
        }
    }
    return null
}

// Callback trigger

function triggerWidgetEvent(target, name, event, containersOnly) {

    // trigger drag events from parent to child
    var widgets = ancestorDragContainers(target),
        widget

    for (widget of widgets) {
        if (containersOnly && !widget.isContainer) continue
        widget.trigger(name, event)
        if (event.preventDefault) break
    }

    // if child is a container, let it scroll
    if (widget && widget.scroll) event.allowScroll = true
}

// init
if (!iOS) {
    document.addEventListener('pointermove', mouseMoveCapture, true)
    if ('onwebkitmouseforcechanged' in document) document.addEventListener('webkitmouseforcechanged', mouseMoveCapture, true)
}
if (!iOS) document.addEventListener('pointerup', mouseUpCapture, true)

document.addEventListener('touchmove', touchMoveCapture, true)

if ('ontouchforcechange' in document) document.addEventListener('touchforcechange', touchMoveCapture, true)

DOM.addEventListener(document, 'touchend touchcancel', touchUpCapture, true)

if (!iOS) document.addEventListener('pointerdown', mouseDownCapture)

export function setup(options) {

    if (
        this._customBindings['drag'] !== 0 ||
        this._customBindings['draginit'] !== 0 ||
        this._customBindings['dragend'] !== 0 ||
        !options || options.ignoreCustomBindings
    ) {
        return
    }

    var {element, multitouch} = options

    element.addEventListener('touchstart', touchDownCapture, false)
    element._drag_widget = this
    element._drag_multitouch = multitouch

}

export function teardown(options) {

    if (
        this._customBindings['drag'] !== 0 ||
        this._customBindings['draginit'] !== 0 ||
        this._customBindings['dragend'] !== 0 ||
        !options || options.ignoreCustomBindings
    ) {
        return
    }

    var {element} = options

    element.style.touchAction = ''
    element.removeEventListener('touchstart', touchDownCapture, false)
    delete element._drag_widget
    delete element._drag_multitouch

}

export function enableTraversingGestures(element, options={}) {

    if (element._traversing) return

    var traversing = options.type ? TRAVERSING_SAMEWIDGET : true,
        traversingType = options.type === 'smart' || options.type === 'auto' ? '' : options.type

    element._traversing = traversing

    function makeEventTraversing(event) {
        if (event.ctrlKey) return
        if (!event.traversingStack) event.traversingStack = {firstType: '', stack: []}
        event.traversingStack.stack.push({
            container: element.parentNode,
            mode: traversing,
            type: traversingType
        })

    }

    if (!iOS) element.addEventListener('pointerdown', makeEventTraversing, true)
    element.addEventListener('touchstart', makeEventTraversing, true)

    element.addEventListener('disableTraversingGestures', (e)=>{
        e.stopPropagation()
        if (!iOS) element.removeEventListener('pointerdown', makeEventTraversing, true)
        element.removeEventListener('touchstart', makeEventTraversing, true)

    })

}

export function disableTraversingGestures(element) {

    if (!element._traversing) return

    delete element._traversing

    DOM.dispatchEvent(element, 'disableTraversingGestures')

}
