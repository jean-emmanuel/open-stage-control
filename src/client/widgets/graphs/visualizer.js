var { clip } = require("../utils"),
    Plot = require("./plot"),
    StaticProperties = require("../mixins/static_properties"),
    canvasQueue = require("../common/queue");

class Visualizer extends StaticProperties(Plot, {
    rangeX: { min: "", max: "" },
    dots: false,
    smooth: false
}) {
    static description() {
        return "Display its value over time.";
    }

    static defaults() {
        return super.defaults().extend({
            widget: {
                interaction: { value: false }
            },
            style: {
                bars: null,
                dots: null
            },
            class_specific: {
                duration: {
                    type: "number",
                    value: 1,
                    help: "Defines visualization duration in seconds"
                },
                framerate: {
                    type: "number",
                    value: 30,
                    help: "Defines visualization framerate"
                },
                rangeY: {
                    type: "object",
                    value: { min: 0, max: 1 },
                    help: "Defines the min and max values for the y axis"
                },
                origin: {
                    type: "number",
                    value: "auto",
                    help: "Defines the y axis origin. Set to `false` to disable it"
                },
                logScaleY: {
                    type: "boolean|number",
                    value: false,
                    help: "Set to `true` to use logarithmic scale for the y axis (base 10). Set to a `number` to define the logarithm's base."
                },
                freeze: {
                    type: "boolean",
                    value: false,
                    help: "Set to `true` to freeze current view and ignore incoming values"
                }
            },
            osc: {
                decimals: null,
                typeTags: null,
                bypass: null,
                ignoreDefaults: null
            }
        });
    }

    constructor(options) {
        super(options);

        this.fps = clip(this.getProp("framerate"), [1, CANVAS_FRAMERATE]);
        this.length = Math.round(
            clip(this.fps * this.getProp("duration"), [8, 4096])
        );
        this.value = new Array(this.length).fill(this.rangeY.min);
        this.cancel = false;
        this.looping = false;
        this.clock = 0;
        this.lastUpdate = 0;
        this.watchDuration = 1000 * this.getProp("duration");
        this.ticks = 0;

        this.boundLoop = this.loop.bind(this);
    }

    startLoop() {
        this.clock = Date.now();
        if (!this.looping && !this.getProp("freeze")) {
            this.lastUpdate = Date.now();
            canvasQueue.on("frame", this.boundLoop);
            if (!canvasQueue.running) canvasQueue.startLoop();
            this.looping = true;
            this.ticks = 0;
        }
    }

    stopLoop() {
        if (this.looping) {
            canvasQueue.off("frame", this.boundLoop);
            this.looping = false;
        }
    }

    loop() {
        var t = Date.now();

        if (t - this.clock >= this.watchDuration) {
            this.stopLoop();
        }

        this.ticks += (t - this.lastUpdate) / (1000 / this.fps);

        if (Math.floor(this.ticks) > 0) {
            this.shiftData(Math.floor(this.ticks));
            this.ticks -= Math.floor(this.ticks);
            this.batchDraw();
        }

        this.lastUpdate = t;
    }

    shiftData(n) {
        for (var i = 0; i < n; i++) {
            this.value.push(this.value[this.length - 1]);
            this.value.splice(0, 1);
        }
    }

    getValue() {
        return this.value[this.length - 1];
    }

    setValue(v, options = {}) {
        if (typeof v === "number") {
            this.value[this.length - 1] = v;
            this.startLoop();

            if (options.sync) this.changed(options);
        } else if (Array.isArray(v) && v.length === this.length) {
            this.value = v;
            this.startLoop();

            if (options.sync) this.changed(options);
        }
    }

    onPropChanged(propName, options, oldPropValue) {
        if (super.onPropChanged(...arguments)) return;

        switch (propName) {
            case "freeze":
                if (this.getProp("freeze")) this.stopLoop();
                else this.startLoop();
                return;
        }
    }

    onRemove() {
        this.stopLoop();
        super.onRemove();
    }
}

Visualizer.dynamicProps =
    Visualizer.prototype.constructor.dynamicProps.concat("freeze");

module.exports = Visualizer;
