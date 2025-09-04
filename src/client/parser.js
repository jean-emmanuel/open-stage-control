var widgetManager = require("./managers/widgets"),
    stateManager = require("./managers/state"),
    { deepCopy } = require("./utils");

var Parser = class Parser {
    constructor() {
        this.iterators = {};
        this.widgets = {};
        this.defaults = {};
    }

    getIterator(id) {
        this.iterators[id] = (this.iterators[id] || 0) + 1;
        return this.iterators[id];
    }

    reset() {
        this.iterators = {};
        widgetManager.reset();
    }

    parse(options) {
        var {
            data,
            parentNode,
            parent,
            tab,
            reCreateOptions,
            children,
            index,
            hash,
            locals,
            variables
        } = options;

        var props = data;

        // Set default widget type
        props.type = tab ? "tab" : props.type || "fader";

        if (!this.widgets[props.type]) {
            console.error(
                "[" +
                    props.id +
                    "] Widget type \"" +
                    props.type +
                    "\" does not exist, falling back to \"fader\""
            );
            props.type = "fader";
        }

        // Get widget's defaults
        var defaults = this.defaults[props.type];

        // Set widget's undefined options to default
        for (let i in defaults) {
            if (i.indexOf("_") !== 0 && props[i] === undefined)
                props[i] = deepCopy(defaults[i]);
        }

        // Generate widget's id, based on its type
        if (props.id === "auto" || !props.id) {
            var id;
            while (!id || widgetManager.getWidgetById(id).length) {
                id = props.type + "_" + this.getIterator(props.type);
            }
            props.id = id;
        }

        // Remove props that don't apply
        for (let j in props) {
            if (defaults[j] === undefined || j[0] === "_") delete props[j];
        }

        // create widget
        var widget = new this.widgets[props.type]({
            props,
            parent,
            parentNode,
            reCreateOptions,
            children,
            hash,
            locals,
            variables
        });

        widgetManager.addWidget(widget);

        // set widget's initial state
        var defaultValue = widget.getProp("default"),
            currentValue = widget.getProp("value");

        if (currentValue !== "" && currentValue !== undefined) {
            stateManager.pushValueNewProp(widget.getProp("id"), currentValue);
        } else if (defaultValue !== "" && defaultValue !== undefined) {
            widget.setValue(defaultValue, { defaultInit: true });
        }

        widget.created(index);

        parentNode.appendChild(widget.container);
        widget.mounted = true;

        // Editor needs to get the container object
        return widget;
    }
};

var parser = new Parser();

module.exports = parser;

parser.widgets = require("./widgets/").widgets;
for (var k in parser.widgets) {
    parser.defaults[k] = parser.widgets[k].defaults()._props();
}
