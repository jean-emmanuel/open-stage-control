import {clip} from '../utils.mjs'
import Slider from './slider.mjs'

class Knob extends Slider {

    static description() {

        return 'Rotative knob slider.'

    }

    static defaults() {

        var defaults = super.defaults(Knob).extend({
            style: {
                _separator_knob_style: 'Knob style',
                design: {type: 'string', value: 'default', choices: ['default', 'solid', 'line'], help: [
                    'Design style',
                    'Note: "solid" design uses "colorStroke" for the central knob color.'
                ]},
                colorKnob: {type: 'string', value: 'auto', help: 'Knob color'},
                pips: {type: 'boolean', value: false, help: 'Set to `true` to show the scale\'s breakpoints'},
                dashed: {type: 'boolean|array', value: false, help: 'Set to `true` to display a dashed gauge. Can be set as an `array` of two numbers : `[dash_size, gap_size]`'},
                angle: {type: 'number', value: 270, help: 'Defines the angle\'s width of the knob, in degrees'},
            },
            class_specific: {
                mode: {type: 'string', value: 'vertical', choices: ['vertical', 'circular', 'snap', 'snap-alt'], help: [
                    '- `vertical`: relative move in vertical motion',
                    '- `circular`: relative move in circular motion',
                    '- `snap`: snap to touch position',
                    '- `snap-alt`: alternative snap mode that allow jumping from `range.min` to `range.max`. `sensitivity` is ignored with this mode.',
                ]},
                spring: {type: 'boolean', value: false, help: 'When set to `true`, the widget will go back to its `default` value when released'},
                doubleTap: {type: 'boolean|string', value: false, choices: [false, true, 'script'], help: [
                    'Set to `true` to make the knob reset to its `default` value when receiving a double tap.',
                    'Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).',
                    'If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. '
                ]},
                range: {type: 'object', value: {min:0,max:1}, help: [
                    'Defines the breakpoints of the fader\'s scale:',
                    '- keys can be percentages and/or `min` / `max`',
                    '- values can be `number` or `object` if a custom label is needed',
                    'Example: (`{min:{"-inf": 0}, "50%": 0.25, max: {"+inf": 1}}`)'
                ]},
                logScale: {type: 'boolean|number', value: false, help: 'Set to `true` to use logarithmic scale. Set to `-1` for exponential scale.'},
                sensitivity: {type: 'number', value: 1, help: 'Defines the knob\'s sensitivity when `mode` is not `snap` '},
                steps: {type: 'string|number|array', value: '', help: [
                    'Restricts the widget\'s value:',
                    '- `number`: define a number of evenly spaced steps',
                    '- `array` of numbers: use arbitrary values as steps',
                    '- `auto`: use values defined in `range`'
                ]},
                origin: {type: 'number', value: 'auto', help: 'Defines the starting point\'s value of the knob\'s gauge'},
            }
        })

        defaults.scripting.onTouch = {type: 'script', value: '', editor:'javascript', help: ['Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.',]}

        return defaults

    }

    constructor(options) {

        super(options)

        this.lastOffsetX = 0
        this.lastOffsetY = 0
        this.minDimension = 0

        this.maxAngle = this.getProp('angle')

        if (this.getProp('pips')) {

            this.widget.classList.add('has-pips')
            this.pipTexts = {}
            for (var k in this.rangeKeys) {
                this.pipTexts[this.rangeKeys[k]]=this.rangeLabels[k]
            }

        }

    }

    draginitHandle(e) {

        this.percent = clip(this.percent,[0,100])

        this.lastOffsetX = e.offsetX
        this.lastOffsetY = e.offsetY

        if (this.getProp('mode') === 'snap' || this.getProp('mode') === 'snap-alt') {

            this.percent = this.angleToPercent(this.coordsToAngle(e.offsetX, e.offsetY))

            this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

        }


    }

    dragHandle(e) {

        var inertia = e.fingers  > 1 || e.ctrlKey ? 10 : e.inertia

        if ((this.getProp('mode') === 'vertical' && !e.traversing)) {
            // vertical
            this.percent = -100 * (e.movementY / inertia * this.getProp('sensitivity')) / this.minDimension + this.percent

        } else {
            // snap or circular
            var offsetX = this.lastOffsetX + e.movementX,
                offsetY = this.lastOffsetY + e.movementY

            if (this.getProp('mode') === 'snap-alt'){
                this.percent = this.angleToPercent(this.coordsToAngle(offsetX, offsetY))
            } else {
                var diff = this.angleToPercent(this.coordsToAngle(offsetX, offsetY), true) - this.angleToPercent(this.coordsToAngle(this.lastOffsetX, this.lastOffsetY), true)
                if (Math.abs(diff) < 50 && diff !== 0) this.percent += (diff * 360 / this.maxAngle) * this.getProp('sensitivity') / inertia
            }

            this.lastOffsetX = offsetX
            this.lastOffsetY = offsetY

        }


        // this.percent = clip(this.percent,[0,100])

        this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

    }

    coordsToAngle(x,y) {

        var xToCenter = x - this.width /2,
            yToCenter = y - this.height / 2,
            angle =  Math.atan2(-yToCenter, -xToCenter) * 180 / Math.PI + 90

        return angle<0?360+angle:angle

    }

    angleToPercent(angle, ignoreMaxAngle=false) {

        return ignoreMaxAngle ?
            clip(angle, [0, 360]) / 360 * 100
            : clip(angle - (360 - this.maxAngle) / 2, [0, this.maxAngle]) / this.maxAngle * 100

    }

    percentToAngle(percent) {

        percent = clip(percent, [0, 100])

        return  2 * Math.PI * percent / 100 * (this.maxAngle / 360) // angle relative to maxAngle
                + Math.PI / 2                                       // quarter circle offset
                + Math.PI * (1 - this.maxAngle / 360)               // centering offset depending on maxAngle

    }

    extraResizeHandle(event) {

        super.extraResizeHandle(event)

        this.minDimension = Math.min(this.width, this.height)

    }

    draw() {

        var percent = this.steps ? this.valueToPercent(this.value) : this.percent,
            o = this.percentToAngle(this.valueToPercent(this.originValue)),
            d = this.percentToAngle(percent),
            min = this.percentToAngle(0),
            max = this.percentToAngle(100),
            dashed = this.getProp('dashed'),
            pips = this.getProp('pips'),
            minRadius = this.minDimension / 6 - (pips ? this.fontSize * 0.75 : 0) - this.cssVars.lineWidth / 2,
            maxRadius = this.minDimension / 2 - (pips ? this.fontSize * 2 : 0) - this.cssVars.lineWidth / 2

        if (dashed) dashed = Array.isArray(dashed) ? dashed.map(x=>parseFloat(x)) : [1.5, 1.5]

        var gaugeWidth = maxRadius - minRadius,
            gaugeRadius = maxRadius - gaugeWidth / 2

        this.clear()

        if (this.getProp('design') === 'default') {

            if (this.minDimension < 40) {
                minRadius /= 2
                gaugeWidth = maxRadius - minRadius
                gaugeRadius = maxRadius - gaugeWidth / 2
            }

            // fill
            this.ctx.strokeStyle = this.cssVars.colorFill
            this.ctx.lineWidth = gaugeWidth - this.gaugePadding * 2

            if (dashed) this.ctx.setLineDash(dashed)

            if (this.cssVars.alphaFillOff) {
                this.ctx.globalAlpha = this.cssVars.alphaFillOff
                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, gaugeRadius, min, max)
                this.ctx.stroke()
            }

            if (this.cssVars.alphaFillOn) {
                this.ctx.globalAlpha = this.cssVars.alphaFillOn
                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, gaugeRadius, o, d, o > d)
                this.ctx.stroke()
            }

            if (dashed) this.ctx.setLineDash([])


            // stroke
            if (this.cssVars.lineWidth) {
                this.ctx.globalAlpha = this.cssVars.alphaStroke
                this.ctx.strokeStyle = this.cssVars.colorStroke
                this.ctx.lineWidth = this.cssVars.lineWidth

                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, maxRadius, 0, 2 * Math.PI)
                this.ctx.stroke()
            }


            // knob

            this.ctx.globalAlpha = 1
            this.ctx.strokeStyle = this.cssVars.colorKnob
            this.ctx.lineWidth = this.cssVars.lineWidth + .5 * PXSCALE

            let r1 = minRadius + this.gaugePadding,
                r2 = maxRadius - this.gaugePadding,
                a  = 2 * Math.PI - d

            this.ctx.beginPath()
            this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
            this.ctx.lineTo(r2 * Math.cos(a) + this.width / 2, this.height / 2 - r2 * Math.sin(a))
            this.ctx.stroke()

        } else if (this.getProp('design') === 'solid') {

            // center

            this.ctx.globalAlpha = this.cssVars.alphaStroke
            this.ctx.fillStyle = this.cssVars.colorKnob

            this.ctx.beginPath()
            this.ctx.arc(this.width / 2, this.height / 2, maxRadius / 1.25, 0, 2 * Math.PI)
            this.ctx.fill()

            // fill
            this.ctx.strokeStyle = this.cssVars.colorFill
            this.ctx.lineWidth = this.cssVars.lineWidth

            if (dashed) this.ctx.setLineDash(dashed)

            if (this.cssVars.alphaFillOff) {
                this.ctx.globalAlpha = this.cssVars.alphaFillOff
                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, maxRadius, min, max)
                this.ctx.stroke()
            }

            if (this.cssVars.alphaFillOn) {
                this.ctx.globalAlpha = this.cssVars.alphaFillOn
                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, maxRadius, o, d, o > d)
                this.ctx.stroke()
            }

            if (dashed) this.ctx.setLineDash([])

            // knob

            this.ctx.globalAlpha = 1
            this.ctx.strokeStyle = this.cssVars.colorBg
            this.ctx.lineWidth = this.cssVars.lineWidth + .5 * PXSCALE

            let r1 = minRadius,
                r2 = maxRadius / 1.25 + PXSCALE ,
                a  = 2 * Math.PI - d

            this.ctx.beginPath()
            this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
            this.ctx.lineTo(r2 * Math.cos(a) + this.width / 2, this.height / 2 - r2 * Math.sin(a))
            this.ctx.stroke()



        } else {

            // fill
            this.ctx.strokeStyle = this.cssVars.colorFill
            this.ctx.lineWidth = this.cssVars.lineWidth

            if (dashed) this.ctx.setLineDash(dashed)

            if (this.cssVars.alphaFillOff) {
                this.ctx.globalAlpha = this.cssVars.alphaFillOff
                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, maxRadius, min, max)
                this.ctx.stroke()
            }

            if (this.cssVars.alphaFillOn) {
                this.ctx.globalAlpha = this.cssVars.alphaFillOn
                this.ctx.beginPath()
                this.ctx.arc(this.width / 2, this.height / 2, maxRadius, o, d, o > d)
                this.ctx.stroke()
            }

            if (dashed) this.ctx.setLineDash([])

            // knob

            this.ctx.globalAlpha = 1
            this.ctx.strokeStyle = this.cssVars.colorKnob
            this.ctx.lineWidth = this.cssVars.lineWidth

            let r1 = minRadius * 1.5,
                r2 = maxRadius + this.cssVars.lineWidth / 2 - 0.5 * PXSCALE,
                a  = 2 * Math.PI - d

            this.ctx.beginPath()
            this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
            this.ctx.lineTo(r2 * Math.cos(a) + this.width / 2, this.height / 2 - r2 * Math.sin(a))
            this.ctx.stroke()

        }


        // pips

        if (pips) {

            this.ctx.lineWidth = this.fontSize / 11 * 1.5
            this.ctx.strokeStyle = this.cssVars.colorStroke
            this.ctx.globalAlpha = this.cssVars.alphaPips

            for (var pip of this.rangeKeys) {

                let r1 = maxRadius + this.cssVars.lineWidth / 2 + 2 * PXSCALE,
                    r2 = r1 + 4 * PXSCALE,
                    a = 2 * Math.PI - this.percentToAngle(pip)


                this.ctx.beginPath()
                this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
                this.ctx.lineTo(r2 * Math.cos(a) + this.width / 2, this.height / 2 - r2 * Math.sin(a))
                this.ctx.stroke()

            }
            var radius = maxRadius + (this.fontSize + this.cssVars.lineWidth / 2 + 2 * PXSCALE)
            this.ctx.fillStyle = this.cssVars.colorText
            this.ctx.globalAlpha = this.cssVars.alphaPipsText
            for (var p in this.pipTexts) {
                if (this.pipTexts[p] === undefined || (this.maxAngle === 360 && p === '100')) continue
                var angle = this.percentToAngle(p),
                    size = this.ctx.measureText(this.pipTexts[p]),
                    x = this.width / 2 + radius * Math.cos(angle) - size.width / 2,
                    y = this.height / 2 + radius * Math.sin(angle)
                this.ctx.fillText(this.pipTexts[p], x, y)
            }

        }

    }

}

Knob.cssVariables = Knob.prototype.constructor.cssVariables.concat(
    {js: 'colorKnob', css: '--color-knob'}
)

export default Knob
