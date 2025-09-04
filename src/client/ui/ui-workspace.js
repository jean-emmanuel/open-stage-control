var UiWidget = require("./ui-widget"),
    { setScrollbarColor } = require("./utils");

class UiWorkspace extends UiWidget {
    constructor(options) {
        super(options);

        setScrollbarColor(this.container);
    }
}

module.exports = new UiWorkspace({ selector: "osc-workspace" });
