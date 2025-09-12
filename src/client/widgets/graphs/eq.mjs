import {mapToScale} from '../utils.mjs'
import Plot from './plot.mjs'
import StaticProperties from '../mixins/static_properties.mjs'

class Eq extends StaticProperties(Plot, {logScaleX: false, logScaleY:false, smooth:true}) {

    static description() {

        return 'Draws logarithmic frequency response from an array of filter objects.'

    }

    static defaults() {

        return super.defaults().extend({
            widget: {
                interaction: {value: false}
            },
            class_specific: {
                filters: {type: 'array', value: '', help: [
                    'Each item must be an object with the following properties',
                    '- `type`: string ("highpass", "highshelf", "lowpass", "lowshelf", "peak", "bandpass" or "notch", default: "peak")',
                    '- `freq`: number (filter\'s resonant frequency, default: 1000)',
                    '- `q`: number (Q factor, default: 1)',
                    '- `gain`: number (default: 0)',
                    '- `on`: boolean (default: true)',
                    '- `poles`: if `type` is "highpass" or "lowpass", indicates the number of poles for the filter (if omitted or 0, a biquad filter with Q factor is used). Set to 1 for 6dB/otaves roll-off, 2 for 12dB/octaves, etc.',
                    'See https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode'

                ]},
                pips: {type: 'boolean', value: true, help: 'Set to false to hide the scale'},
                rangeX: {type: 'object', value: {min: 20, max: 22000}, help: [
                    'Defines the min and max values for the x axis (in Hz, logarithmic scale)',
                    'The sampling frequency used to compute the response curve will be 2 * rangeX.max',

                ]},
                rangeY: {type: 'object', value: {min:-6, max:6}, help: 'Defines the min and max values for the y axis (in dB)'},
                origin: {type: 'number|boolean', value: 'auto', help: 'Defines the y axis origin. Set to `false` to disable it'},
                logScaleX: null,
                logScaleY: null
            },
            osc: {
                decimals: null,
                typeTags: null,
                bypass: null,
                ignoreDefaults: null
            }
        })

    }

    constructor(options) {

        super(options)

        this.calcResponse()

    }

    calcResponse() {

        var resolution = this.width,
            frequencyHz = new Float32Array(resolution),
            filterResponse = new Float32Array(resolution).fill(0),
            Fs = this.getProp('rangeX').max * 2

        for (let i = 0; i < resolution; ++i) {
            frequencyHz[i] = mapToScale(i, [0, this.width], [this.getProp('rangeX').min, this.getProp('rangeX').max], -1, true)
        }

        for (let filter of this.getProp('filters')) {

            if (filter.on !== undefined && !filter.on) continue

            var poles = 1,
                type = filter.type

            if ((type === 'lowpass' || type === 'highpass') && filter.poles !== undefined && filter.poles !== 0) {
                poles = Math.max(parseInt(filter.poles), 1)
                type += '-1p'
            }

            biquadResponse({
                type: type || 'peak',
                gain: filter.gain || 0,
                frequency: filter.freq || 1000,
                q: filter.q || 1,
                poles, Fs
            }, frequencyHz, filterResponse)
        }

        this.setValue(filterResponse, {sync: true})



    }

    setValue(v, options={}) {

        if (!(v instanceof Float32Array) && !(Array.isArray(v)) || v.length !== this.width) return

        this.value = v
        this.batchDraw()

        if (options.sync) this.changed(options)

    }

    resizeHandle(event){

        super.resizeHandle(event)
        if (this.width !== this.value.length) this.calcResponse()

    }

    onPropChanged(propName, options, oldPropValue) {

        super.onPropChanged(...arguments)

        switch (propName) {
            case 'filters':
                this.calcResponse()
                return

        }

    }

}

Eq.dynamicProps = Eq.prototype.constructor.dynamicProps.concat(
    'filters'
)

export default Eq


// biquadResponse
// Based on code by Nigel Redmon @ https://www.earlevel.com
function biquadResponse(options, frequencyHz, filterResponse) {

    var {type, frequency, q, gain, Fs, poles} = options,
        len = frequencyHz.length,
        a0, a1, a2, b1, b2,norm

    var V = Math.pow(10, Math.abs(gain) / 20)
    var K = Math.tan(Math.PI * frequency / Fs)

    switch (type) {
        case 'lowpass':
            norm = 1 / (1 + K / q + K * K)
            a0 = K * K * norm
            a1 = 2 * a0
            a2 = a0
            b1 = 2 * (K * K - 1) * norm
            b2 = (1 - K / q + K * K) * norm
            break

        case 'highpass':
            norm = 1 / (1 + K / q + K * K)
            a0 = 1 * norm
            a1 = -2 * a0
            a2 = a0
            b1 = 2 * (K * K - 1) * norm
            b2 = (1 - K / q + K * K) * norm
            break

        case 'lowpass-1p':
            // b1 = Math.exp(-2.0 * Math.PI * (frequency / Fs))
            // a0 = 1.0 - b1
            // b1 = -b1
            // a1 = a2 = b2 = 0
            // using lowpass 1p1z instead
            norm = 1 / (1 / K + 1)
            a0 = a1 = norm
            b1 = (1 - 1 / K) * norm
            a2 = b2 = 0
            break

        case 'highpass-1p':
            // b1 = -Math.exp(-2.0 * Math.PI * (0.5 - frequency / Fs))
            // a0 = 1.0 + b1
            // b1 = -b1
            // a1 = a2 = b2 = 0
            // using highpass 1p1z instead
            norm = 1 / (K + 1)
            a0 = norm
            a1 = -norm
            b1 = (K - 1) * norm
            a2 = b2 = 0
            break

        case 'bandpass':
            norm = 1 / (1 + K / q + K * K)
            a0 = K / q * norm
            a1 = 0
            a2 = -a0
            b1 = 2 * (K * K - 1) * norm
            b2 = (1 - K / q + K * K) * norm
            break

        case 'notch':
            norm = 1 / (1 + K / q + K * K)
            a0 = (1 + K * K) * norm
            a1 = 2 * (K * K - 1) * norm
            a2 = a0
            b1 = a1
            b2 = (1 - K / q + K * K) * norm
            break

        case 'peak':
            if (gain >= 0) {
                norm = 1 / (1 + 1/q * K + K * K)
                a0 = (1 + V/q * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - V/q * K + K * K) * norm
                b1 = a1
                b2 = (1 - 1/q * K + K * K) * norm
            }
            else {
                norm = 1 / (1 + V/q * K + K * K)
                a0 = (1 + 1/q * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - 1/q * K + K * K) * norm
                b1 = a1
                b2 = (1 - V/q * K + K * K) * norm
            }
            break
        case 'lowshelf':
            if (gain >= 0) {
                norm = 1 / (1 + Math.SQRT2 * K + K * K)
                a0 = (1 + Math.sqrt(2*V) * K + V * K * K) * norm
                a1 = 2 * (V * K * K - 1) * norm
                a2 = (1 - Math.sqrt(2*V) * K + V * K * K) * norm
                b1 = 2 * (K * K - 1) * norm
                b2 = (1 - Math.SQRT2 * K + K * K) * norm
            }
            else {
                norm = 1 / (1 + Math.sqrt(2*V) * K + V * K * K)
                a0 = (1 + Math.SQRT2 * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - Math.SQRT2 * K + K * K) * norm
                b1 = 2 * (V * K * K - 1) * norm
                b2 = (1 - Math.sqrt(2*V) * K + V * K * K) * norm
            }
            break
        case 'highshelf':
            if (gain >= 0) {
                norm = 1 / (1 + Math.SQRT2 * K + K * K)
                a0 = (V + Math.sqrt(2*V) * K + K * K) * norm
                a1 = 2 * (K * K - V) * norm
                a2 = (V - Math.sqrt(2*V) * K + K * K) * norm
                b1 = 2 * (K * K - 1) * norm
                b2 = (1 - Math.SQRT2 * K + K * K) * norm
            }
            else {
                norm = 1 / (V + Math.sqrt(2*V) * K + K * K)
                a0 = (1 + Math.SQRT2 * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - Math.SQRT2 * K + K * K) * norm
                b1 = 2 * (K * K - V) * norm
                b2 = (V - Math.sqrt(2*V) * K + K * K) * norm
            }
            break
    }

    for (var i = 0; i < len; i++) {

        var w = mapToScale(frequencyHz[i], [0, Fs / 2], [0, Math.PI], -1, false),
            phi = Math.pow(Math.sin(w / 2), 2),
            y = Math.log(Math.pow(a0 + a1 + a2, 2) - 4 * (a0 * a1 + 4 * a0 * a2 + a1 * a2) * phi + 16 * a0 * a2 * phi * phi) -
                Math.log(Math.pow(1 + b1 + b2, 2) - 4 * (b1 + 4 * b2 + b1 * b2) * phi + 16 * b2 * phi *phi)

        y = y * 10 / Math.LN10
        // if (y == -Infinity) y = -200

        filterResponse[i] += y * poles

    }


}
