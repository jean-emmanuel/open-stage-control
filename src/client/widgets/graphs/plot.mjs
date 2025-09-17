import html from 'nanohtml'
import {mapToScale} from '../utils.mjs'
import Canvas from '../common/canvas.mjs'
import StaticProperties from '../mixins/static_properties.mjs'
import {PXSCALE, JSON5} from '../../globals.mjs'

export default class Plot extends StaticProperties(Canvas, {bypass: true}) {

    static description() {

        return 'XY coordinates plot.'

    }

    static defaults() {

        return super.defaults().extend({
            widget: {
                interaction: {value: false}
            },
            style: {
                _separator_plot_style: 'Plot style',
                dots: {type: 'boolean', value: false, help: 'Draw dots on the line'},
                bars: {type: 'boolean', value: false, help: 'Set to `true` to use draw bars instead (disables `logScaleX` and forces `x axis` even spacing)'},
                pips:{type: 'boolean', value: true, help: 'Set to `false` to hide the scale'},
            },
            class_specific: {
                rangeX: {type: 'object', value: {min: 0, max: 1}, help: 'Defines the min and max values for the x axis'},
                rangeY: {type: 'object', value: {min: 0, max:1}, help: 'Defines the min and max values for the y axis'},
                logScaleX: {type: 'boolean|number', value: false, help: 'Set to `true` to use logarithmic scale for the x axis. Set to `-1` for exponential scale.'},
                logScaleY: {type: 'boolean|number', value: false, help: 'Set to `true` to use logarithmic scale for the y axis. Set to `-1` for exponential scale.'},
                origin: {type: 'number|boolean', value: 'auto', help: 'Defines the y axis origin. Set to `false` to disable it'},
            },
            value: {
                value: {type: 'array|string', value: '', help: [
                    '- `Array` of `y` values: `[y1, y2, ...]`',
                    '- `Array` of `[x, y]` `array` values: `[[x1 , y1], [x2, y2], ...]`',
                    '- `String` `array`: `"[y1, y2, ...]"` or `"[[x1 , y1], [x2, y2], ...]"`',
                    '- `String` `object` to update specific coordinates only: `"{0: y1, 1: y2}"` or `"{0: [x1, y1], 1: [x2, y2]}"`',
                ]}
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

        super({...options, html: html`
            <inner>
                <canvas></canvas>
            </inner>
        `})

        this.value = []
        this.rangeX = this.getProp('rangeX') || {min:0,max:1}
        this.rangeY = this.getProp('rangeY') || {min:0,max:1}
        this.logScaleX = this.getProp('logScaleX')
        this.logScaleY = this.getProp('logScaleY')
        this.pips = {
            x : {
                min: Math.abs(this.rangeX.min)>=1000?this.rangeX.min/1000+'k':this.rangeX.min,
                max: Math.abs(this.rangeX.max)>=1000?this.rangeX.max/1000+'k':this.rangeX.max
            },
            y : {
                min: Math.abs(this.rangeY.min)>=1000?this.rangeY.min/1000+'k':this.rangeY.min,
                max: Math.abs(this.rangeY.max)>=1000?this.rangeY.max/1000+'k':this.rangeY.max
            }
        }

    }

    draw() {

        this.ctx.clearRect(0,0,this.width,this.height)

        if (this.getProp('bars')) {
            this.draw_bars()
        } else {
            var points = this.draw_line()
            if (this.getProp('dots')) {
                this.draw_dots(points)
            }
        }

        if (this.getProp('pips')) this.draw_pips()

    }

    draw_pips() {

        this.ctx.fillStyle = this.cssVars.colorText
        this.ctx.globalAlpha = this.cssVars.alphaPips

        var margin = this.cssVars.padding + this.cssVars.lineWidth

        if (margin < this.fontSize * 1.5) return


        if (this.pips.x) {

            this.ctx.textAlign = 'center'
            this.ctx.fillText(this.pips.x.min, margin, this.height - margin / 2)
            this.ctx.fillText(this.pips.x.max, this.width - margin, this.height - margin / 2)

        }

        if (this.pips.y) {

            this.ctx.textAlign = 'right'
            this.ctx.fillText(this.pips.y.min, margin / 2 + this.fontSize / 2, this.height - margin)
            this.ctx.fillText(this.pips.y.max, margin / 2 + this.fontSize / 2, margin)

        }

    }

    draw_line() {

        var points = [],
            padding = this.cssVars.padding + this.cssVars.lineWidth,
            length = this.value.length,
            x, y, i, previousValue, nx, ny

        for (i = 0; i < length; i++) {

            if (this.value[i].length) {
                points.push(mapToScale(this.value[i][0], [this.rangeX.min, this.rangeX.max], [padding, this.width - padding], -1, this.logScaleX, true))
                points.push(mapToScale(this.value[i][1], [this.rangeY.min, this.rangeY.max], [this.height - 2 * PXSCALE - padding, 2 * PXSCALE + padding], -1, this.logScaleY, true))
            } else {

                if (i < length - 2 && this.value[i] === previousValue && this.value[i+1] === previousValue) {
                    continue
                }
                nx = mapToScale(i, [0, this.value.length - 1], [padding, this.width - padding], -1, this.logScaleX, true)
                ny = mapToScale(this.value[i], [this.rangeY.min, this.rangeY.max], [this.height - 2 * PXSCALE - padding, 2 * PXSCALE + padding], -1, this.logScaleY, true)

                if (x !== nx || y !== ny) {
                    points.push(nx)
                    points.push(ny)
                    x = nx
                    y = ny
                }

                previousValue = this.value[i]

            }

        }

        if (points.length < 4) return points

        this.ctx.beginPath()

        this.ctx.moveTo(points[0], points[1])
        for (i = 2; i < points.length - 2; i += 2) {
            this.ctx.lineTo(points[i], points[i + 1])
        }
        this.ctx.lineTo(points[i], points[i + 1])

        this.ctx.globalAlpha = 1
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.strokeStyle = this.cssVars.colorWidget
        this.ctx.stroke()

        if (this.getProp('origin') !== false) {

            var origin = mapToScale(this.getProp('origin'), [this.rangeY.min, this.rangeY.max], [this.height - padding, padding], 0, this.getProp('logScaleY'), true)

            this.ctx.globalAlpha = this.cssVars.alphaFillOn
            this.ctx.fillStyle = this.cssVars.colorFill
            this.ctx.lineTo(this.width - padding, origin)
            this.ctx.lineTo(padding, origin)
            this.ctx.closePath()
            this.ctx.fill()

        }

        return points

    }

    draw_dots(points) {

        this.ctx.globalAlpha = 1
        this.ctx.fillStyle = this.cssVars.colorWidget
        this.ctx.strokeStyle = this.cssVars.colorBackground
        this.ctx.lineWidth = 2 * PXSCALE
        for (var i = 0; i < points.length; i += 2) {
            this.ctx.beginPath()
            this.ctx.arc(points[i], points[i + 1], 2 * PXSCALE, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }

    }

    draw_bars() {

        var padding = this.cssVars.padding,
            barWidth = Math.round((this.width - padding * 2) / this.value.length),
            offset = Math.round((this.width - barWidth * this.value.length) / 2)


        var origin = mapToScale(this.getProp('origin') !== false ? this.getProp('origin') : this.rangeY.min, [this.rangeY.min, this.rangeY.max],[this.height - padding, padding], 0, this.getProp('logScaleY'), true)

        this.ctx.beginPath()

        for (let i in this.value) {
            var y = mapToScale(this.value[i].length ? this.value[i][1] : this.value[i], [this.rangeY.min, this.rangeY.max], [this.height - 2 * PXSCALE - padding, 2 * PXSCALE + padding], 0, this.logScaleY, true)
            this.ctx.rect(offset + i * barWidth, Math.min(y, origin), barWidth - PXSCALE, Math.abs(Math.min(y - origin)))

        }

        this.ctx.globalAlpha = 0.4
        this.ctx.fillStyle = this.cssVars.colorWidget
        this.ctx.fill()

    }

    setValue(v, options={}) {

        if (typeof v == 'string') {
            try {
                v = JSON5.parse(v)
            } catch(err) {}
        }

        if (typeof v == 'object' && v !== null) {

            if (Array.isArray(v)) {

                this.value = v

            } else {

                for (var i in v) {
                    if (!isNaN(i)) this.value[i] = v[i]
                }

            }

            this.batchDraw()

            if (options.sync) this.changed(options)

        }


    }

}
