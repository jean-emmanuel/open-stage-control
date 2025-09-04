var EventEmitter = require("../events/event-emitter");

class UiWidget extends EventEmitter {
    constructor(options = {}) {
        super();

        this.container = options.selector
            ? DOM.get(options.selector)[0]
            : options.element;
        this.parent = options.parent;
    }
}

module.exports = UiWidget;
