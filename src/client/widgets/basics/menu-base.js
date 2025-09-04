var Widget = require("../common/widget"),
    { iconify } = require("../../ui/utils"),
    { deepEqual } = require("../../utils");

class MenuBase extends Widget {
    constructor(options) {
        super(options);

        this.value = undefined;
        this.values = [];
        this.keys = [];
        this.objectInValues = false;
    }

    parseValues() {
        this.values = [];
        this.keys = [];

        var values = this.getProp("values") || [];

        if (
            typeof values === "object" &&
            values !== null &&
            Array.isArray(values.labels) &&
            Array.isArray(values.values) &&
            Object.keys(values).length === 2 &&
            values.labels.length === values.values.length
        ) {
            this.values = values.values;
            this.keys = values.labels;
        } else {
            if (
                !Array.isArray(values) &&
                !(typeof values === "object" && values !== null)
            ) {
                values = values !== "" ? [values] : [];
            }

            this.values = !Array.isArray(values)
                ? Object.values(values)
                : values;
            this.keys = !Array.isArray(values)
                ? Object.keys(values)
                : this.values;
        }

        this.objectInValues = this.values.some((x) => typeof x === "object");
    }

    getIndex(value) {
        var index = this.values.indexOf(value);
        if (index === -1 && this.objectInValues) {
            for (var i = 0; i < this.values.length; i++) {
                if (deepEqual(value, this.values[i])) return i;
            }
        }
        return index;
    }

    setLabel() {
        var string =
                this.getProp("label") === "auto"
                    ? "%value"
                    : this.getProp("label"),
            i = this.selected;

        if (i > -1 && string) {
            this.text.innerHTML = iconify(
                String(string)
                    .replace(
                        /%value/g,
                        typeof this.value === "string"
                            ? this.value
                            : JSON.stringify(this.value)
                    )
                    .replace(/%key/g, this.keys[i])
            );
        } else {
            this.text.innerHTML = iconify(
                String(string)
                    .replace(/%value/g, "")
                    .replace(/%key/g, "")
            );
        }
    }
}

module.exports = MenuBase;
