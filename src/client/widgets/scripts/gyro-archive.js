var Widget = require("../common/widget"),
    GyroNorm = require("gyronorm/dist/gyronorm.complete.min.js"),
    { icon } = require("../../ui/utils"),
    { clip } = require("../utils"),
    html = require("nanohtml"),
    raw = require("nanohtml/raw");

class Gyroscope extends Widget {
    static description() {
        return "Device motion/orientation sensor.";
    }

    static defaults() {
        return super.defaults(
            {
                _class_specific: "gyroscope",

                frequency: {
                    type: "number",
                    value: 30,
                    help: "Value update frequency (updates per seconds)"
                },
                normalize: {
                    type: "boolean",
                    value: true,
                    help: "Normalize gravity related values"
                },
                compass: {
                    type: "boolean",
                    value: false,
                    help: "Set to `true` to return the orientation values with respect to the actual north direction of the world instead of the head direction of the device"
                },
                screenAdjusted: {
                    type: "boolean",
                    value: false,
                    help: "Set to `true` to return screen adjusted values"
                }
            },
            [],
            {
                value: {
                    type: "object",
                    value: "",
                    help: [
                        "The gyroscope's value is an object containing multiple values, which can be used by other widgets via the property maths syntax",
                        "- `value.do.alpha`: deviceorientation event alpha",
                        "- `value.do.beta`: deviceorientation event beta",
                        "- `value.do.gamma`: deviceorientation event gamma",
                        "- `value.do.absolute`: deviceorientation event absolute",
                        "- `value.dm.x`: devicemotion event acceleration x",
                        "- `value.dm.y`: devicemotion event acceleration y",
                        "- `value.dm.z`: devicemotion event acceleration z",
                        "- `value.dm.gx`: devicemotion event accelerationIncludingGravity x",
                        "- `value.dm.gy`: devicemotion event accelerationIncludingGravity y",
                        "- `value.dm.gz`: devicemotion event accelerationIncludingGravity z",
                        "- `value.dm.alpha`: devicemotion event rotationRate alpha",
                        "- `value.dm.beta`: devicemotion event rotationRate beta",
                        "- `value.dm.gamma`: devicemotion event rotationRate gamma"
                    ]
                }
            }
        );
    }

    constructor(options) {
        super({
            ...options,
            html: html` <div class="gyroscope">${raw(icon("compass"))}</div> `
        });

        this.sensor = new GyroNorm();
        this.sensor
            .init({
                frequency: 1000 / clip(this.getProp("frequency"), [0.01, 60]),
                gravityNormalized: this.getProp("normalize"),
                orientationBase: this.getProp("compass")
                    ? GyroNorm.WORLD
                    : GyroNorm.GAME,
                decimalCount: this.getProp("decimals"),
                screenAdjusted: this.getProp("screenAdjusted"),
                logger: null
            })
            .then(() => {
                this.sensor.start((data) => {
                    this.setValue(data, { sync: true, send: true });

                    // data.do.alpha       ( deviceorientation event alpha value )
                    // data.do.beta        ( deviceorientation event beta value )
                    // data.do.gamma       ( deviceorientation event gamma value )
                    // data.do.absolute    ( deviceorientation event absolute value )

                    // data.dm.x        ( devicemotion event acceleration x value )
                    // data.dm.y        ( devicemotion event acceleration y value )
                    // data.dm.z        ( devicemotion event acceleration z value )

                    // data.dm.gx        ( devicemotion event accelerationIncludingGravity x value )
                    // data.dm.gy        ( devicemotion event accelerationIncludingGravity y value )
                    // data.dm.gz        ( devicemotion event accelerationIncludingGravity z value )

                    // data.dm.alpha    ( devicemotion event rotationRate alpha value )
                    // data.dm.beta     ( devicemotion event rotationRate beta value )
                    // data.dm.gamma    ( devicemotion event rotationRate gamma value )
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    setValue(v, options = {}) {
        this.value = v;

        // if (options.send) this.sendValue()
        if (options.sync) this.changed(options);
    }

    onRemove() {
        this.sensor.end();

        super.onRemove();
    }
}

module.exports = Gyroscope;
