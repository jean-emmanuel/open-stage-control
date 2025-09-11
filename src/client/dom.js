export function dispatchEvent(element, name, data) {

    var event = new CustomEvent(name, {
        detail: data,
        bubbles: true,
        cancelable: true
    })

    element.dispatchEvent(event)

}

export function addEventListener(element, events, listener, capture) {

    var eventsAsObject = typeof events == 'string' ? events.split(' ') : events

    for (var i in eventsAsObject) {

        element.addEventListener(eventsAsObject[i], listener, capture)

    }

}

export function get(a, b) {

    var context = b ? a : document,
        selector = b || a,
        nodes

    if (selector.indexOf('>') === 0) selector = ':scope ' + selector

    if (selector.indexOf(' ') === -1 && selector.indexOf(',') === -1 && selector.indexOf('[') === -1) {
        if (selector.indexOf('#') === 0 && context === document) {
            nodes = [document.getElementById(selector.substr(1, selector.length - 1))]
        } else if (selector.lastIndexOf('.') === 0)  {
            nodes = context.getElementsByClassName(selector.substr(1, selector.length - 1))
        }
    }

    if (!nodes) nodes = context.querySelectorAll(selector)

    return [...nodes]

}

export function each(context, selector, callback) {

    var nodes = get(context, selector)

    nodes.forEach(callback)

    return nodes

}

export function index(element) {
    var parent = element.parentNode
    return parent ? Array.prototype.indexOf.call(parent.children, element) : -1
}

export function offset(element, container) {

    var offsetLeft = 0,
        offsetTop = 0

    if (element) {
        do {
            if (!isNaN(element.offsetLeft)) {
                offsetLeft += element.offsetLeft - element.scrollLeft
            }
            if (!isNaN(element.offsetTop)) {
                offsetTop += element.offsetTop - element.scrollTop
            }
        } while ((element = element.offsetParent) && element !== container)
    }

    return {
        left: offsetLeft,
        top: offsetTop
    }
}
