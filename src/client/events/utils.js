const Touch = window.Touch || class Touch {}
const zoom = require('../ui/zoom')

// const cssTransformCoords = require('./transform-coords')


module.exports = {

    fix: function(e) {

        return {

            target: e.target === document ? null : e.target, // firefox passes document when outside the page
            firstTarget: null,
            offsetX: e.offsetX,
            offsetY: e.offsetY,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            movementX: e.movementX === undefined ? undefined : e.movementX / zoom.localZoom,
            movementY: e.movementY === undefined ? undefined : e.movementY / zoom.localZoom,
            pointerId: e.pointerId,
            pointerType: e.pointerType,
            button: e.button,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            inertia: e.multitouch ? 1 : e.inertia,
            traversing: e.traversing,
            traversingStack: e.traversingStack,
            multitouch: e.multitouch,
            isTouch: e instanceof Touch,
            force: e.webkitForce || e.force || 0,
            radiusX: e.radiusX,
            radiusY: e.radiusY,
            rotationAngle: e.rotationAngle,
            // iOS only
            altitudeAngle: e.altitudeAngle,
            azimuthAngle: e.azimuthAngle,
            touchType: e.touchType
        }

    },

    normalizeDragEvent: function(event, previousEvent) {

        event = module.exports.fix(event)

        event.firstTarget = previousEvent ? previousEvent.firstTarget : event.target

        if (event.movementX === undefined) {

            event.movementX = previousEvent ? event.pageX - previousEvent.pageX : 0
            event.movementY = previousEvent ? event.pageY - previousEvent.pageY : 0

        }

        if (event.isTouch && !previousEvent) {

            module.exports.resetEventOffset(event, event.target)

        } else if (event.isTouch && previousEvent) {

            event.offsetX = previousEvent.offsetX + event.movementX
            event.offsetY = previousEvent.offsetY + event.movementY

        }

        if (event.inertia === undefined) {

            event.inertia = 1

        }

        if (previousEvent) {

            if (previousEvent.traversing) event.traversing = previousEvent.traversing
            if (previousEvent.traversingStack) event.traversingStack = previousEvent.traversingStack

            if (previousEvent.multitouch) {
                event.multitouch = previousEvent.multitouch
                event.inertia = 1
            }

        }


        // if (!event.traversing) {
        //     // css transform fix (doesn't work well with traversing gestures)
        //     var transformedCoords  = cssTransformCoords(event.firstTarget, event.movementX, event.movementY)
        //     event.movementX = transformedCoords.x
        //     event.movementY = transformedCoords.y
        // }

        return event

    },

    resetEventOffset: function(event, target) {

        var off = DOM.offset(target)

        event.offsetX = event.pageX - off.left
        event.offsetY = event.pageY - off.top

        // if (!event.traversing) {
        //     // css transform fix (doesn't work well with traversing gestures)
        //     var transformedCoords  = cssTransformCoords(event.firstTarget, event.offsetX, event.offsetY)
        //     event.offsetX = transformedCoords.x
        //     event.offsetY = transformedCoords.y
        // }

    },

    TRAVERSING_SAMEWIDGET: 1

}
