import {clip} from '../utils'
import Fader from './fader'
import html from 'nanohtml/lib/browser'

var faderDefaults = Fader.defaults()._props()

var rangePassedProps = ['horizontal', 'snap', 'steps', 'spring', 'range', 'decimals', 'logScale', 'sensitivity']

class SubFader extends Fader {

    getProp(propName) {

        if (rangePassedProps.includes(propName)) {

            return this.parent.getProp(propName)

        } else {

            return super.getProp(propName)

        }

    }

}

class Range extends Fader {

    static description() {

        return 'A fader with two heads for setting a range.'

    }

    static defaults() {

        return super.defaults(Fader).extend({
            class_specific: {
                origin: null,
            }
        })
    }

    constructor(options) {

        options.multitouch = true

        super({...options, value: [], html: html`
            <canvas></canvas>
        `})

        this.preventChildrenTouchState = true

        this.faders = [
            new SubFader({props:{
                ...faderDefaults,
                pips:false,
                visible: false,
                default:this.getProp('default').length === 2 ? this.getProp('default')[0] : this.getProp('range').min,
                origin:this.getProp('default').length === 2 ? this.getProp('default')[0] : this.getProp('range').min,
            }, parent: this}),
            new SubFader({props:{
                ...faderDefaults,
                pips:false,
                visible: false,
                default:this.getProp('default').length === 2 ? this.getProp('default')[1] : this.getProp('range').max,
                origin:this.getProp('default').length === 2 ? this.getProp('default')[1] : this.getProp('range').max,
            }, parent: this})
        ]


        this.on('value-changed',(e)=>{

            if (e.widget == this) return

            e.stopPropagation = true

            var v = [
                this.faders[0].getValue(),
                this.faders[1].getValue()
            ]

            this.setValue(v, e.options)

        })

        this.touchMap = {}


        this.originValue = this.faders.map(f => f.originValue)
        this.setValue(this.getSpringValue())

    }

    extraResizeHandle(event){

        super.extraResizeHandle(event)

        for (var f of this.faders) {
            f.width = this.width
            f.height = this.height
            f.gaugePadding = this.gaugePadding
        }

    }

    draginitHandle(e) {

        var id

        if (!this.touchMap[e.pointerId]) {

            var ndiff, diff = -1

            for (var i in this.faders) {

                if (Object.values(this.touchMap).indexOf(i) != -1) continue

                var coord = this.faders[i].percentToCoord(this.faders[i].valueToPercent(this.faders[i].value)) - (this.getProp('horizontal') ? -1 : 1) * (i == 0 ? -20 : 20)

                ndiff = this.getProp('horizontal')?
                    Math.abs(e.offsetX - coord) :
                    Math.abs(e.offsetY - coord)

                if (diff == -1 || ndiff < diff) {
                    id = i
                    diff = ndiff
                }

            }

            this.touchMap[e.pointerId] = id


        } else if (e.traversing) {

            id = this.touchMap[e.pointerId]

        }

        if (!id) return

        this.trigger('touch', {stopPropagation: true, touch: [parseInt(id), 1]})

        for (var f of this.faders) {
            f.percent = clip(f.percent,[
                f.valueToPercent(f.rangeValsMin),
                f.valueToPercent(f.rangeValsMax)
            ])
        }


        e.stopPropagation = true
        this.faders[id].trigger('draginit', e)
        this.faders[id].touched = 1

    }

    dragHandle(e) {

        var i = this.touchMap[e.pointerId]

        if (!i) return

        e.fingers = 1 // cancel multifinger inertia

        if (e.shiftKey) {
            this.faders[0].trigger('drag', e)
            this.faders[1].trigger('drag', e)
        } else {
            this.faders[i].trigger('drag', e)
        }

    }

    dragendHandle(e) {

        var i = this.touchMap[e.pointerId]

        if (!i) return

        e.stopPropagation = true
        this.faders[i].touched = 0
        this.faders[i].trigger('dragend', e)


        this.trigger('touch', {stopPropagation: true, touch: [parseInt(i), 0]})

        delete this.touchMap[e.pointerId]

    }

    setValue(v, options={}) {

        if (!this.faders) return // prevent Fader.constructor
        if (!v || !v.length || v.length!=2) return

        this.faders[0].rangeValsMax = v[1]
        this.faders[1].rangeValsMin = v[0]

        if (!options.dragged || options.fromScript) {
            var opt = {
                ...options,
                send: false,
                sync: false
            }
            this.faders[0].setValue(v[0], opt)
            this.faders[1].setValue(v[1], opt)
        }
        this.value = [
            this.faders[0].getValue(),
            this.faders[1].getValue()
        ]


        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

        this.batchDraw()

    }

    draw() {


        var width = this.getProp('horizontal') ? this.height : this.width,
            height = !this.getProp('horizontal') ? this.height : this.width,
            fader = this.faders[0]

        var d = Math.round(fader.percentToCoord(fader.valueToPercent(this.faders[this.getProp('horizontal')?0:1].value))),
            d2 = Math.round(fader.percentToCoord(fader.valueToPercent(this.faders[this.getProp('horizontal')?1:0].value))),
            m = this.getProp('horizontal') ? this.height / 2 : this.width / 2,
            dashed = this.dashed,
            compact = this.getProp('design') === 'compact',
            knobHeight = this.cssVars.knobSize, knobWidth = knobHeight * .6

        this.clear()

        if (this.getProp('pips') && !compact) m -= 10 * PXSCALE

        // sharp border trick
        if (compact) {
            if (width % 2 && parseInt(m) === m) m -= 0.5
        } else {
            if (width % 2 && parseInt(m) !== m) m -= 0.5
        }


        this.ctx.strokeStyle = this.gaugeGradient || this.cssVars.colorFill

        if (compact) {
            this.ctx.lineWidth = Math.round(width - this.gaugePadding * 2)
        } else {
            this.ctx.lineWidth = this.cssVars.lineWidth
        }


        if (dashed) this.ctx.setLineDash([PXSCALE * dashed[0], PXSCALE * dashed[1]])


        if (this.cssVars.alphaFillOff) {
            // gaugo off
            this.ctx.globalAlpha = this.cssVars.alphaFillOff
            this.ctx.beginPath()
            this.ctx.moveTo(m, height - this.gaugePadding)
            this.ctx.lineTo(m, this.gaugePadding)
            this.ctx.stroke()
        }


        if (this.cssVars.alphaFillOn) {
            // gaugo on
            this.ctx.globalAlpha = this.cssVars.alphaFillOn
            this.ctx.beginPath()
            this.ctx.moveTo(m, d)
            this.ctx.lineTo(m, d2)
            this.ctx.stroke()
        }

        if (dashed) this.ctx.setLineDash([])

        if (compact) {

            // stroke

            this.ctx.globalAlpha = this.cssVars.alphaStroke
            this.ctx.strokeStyle = this.cssVars.colorStroke

            this.ctx.beginPath()
            this.ctx.moveTo(0, 0)
            this.ctx.lineTo(width, 0)
            this.ctx.lineTo(width, height)
            this.ctx.lineTo(0, height)
            this.ctx.closePath()
            this.ctx.lineWidth = 2 * this.cssVars.lineWidth
            this.ctx.stroke()


            // flat knob

            this.ctx.globalAlpha = 1
            this.ctx.fillStyle = this.cssVars.colorKnob
            var compactAdjust = 1 / (height - this.gaugePadding) * (height-this.gaugePadding - knobHeight)

            this.ctx.beginPath()
            d *= compactAdjust
            this.ctx.rect(this.gaugePadding, d, width - this.gaugePadding * 2, knobHeight)
            this.ctx.fill()

            // extra knob
            this.ctx.beginPath()
            d2 *= compactAdjust
            this.ctx.rect(this.gaugePadding, d2, width - this.gaugePadding * 2, knobHeight)
            this.ctx.fill()


            this.clearRect = [0, 0, width, height]


        } else if (this.getProp('design') === 'default') {

            for (let _d of [d, d2]) {

                if (this.cssVars.alphaStroke) {

                    this.ctx.globalAlpha = 1
                    this.ctx.fillStyle = this.cssVars.colorBg

                    this.ctx.beginPath()
                    this.ctx.rect(m - knobWidth / 2, _d - knobHeight / 2, knobWidth, knobHeight)
                    this.ctx.fill()

                    this.ctx.globalAlpha = this.cssVars.alphaStroke
                    this.ctx.strokeStyle = this.cssVars.colorKnob
                    this.ctx.lineWidth = PXSCALE

                    this.ctx.beginPath()
                    this.ctx.rect(m - knobWidth / 2 + 0.5 * PXSCALE, _d - knobHeight / 2  + 0.5 * PXSCALE, knobWidth - PXSCALE, knobHeight - PXSCALE)
                    this.ctx.stroke()

                }

                this.ctx.globalAlpha = 1
                this.ctx.fillStyle = this.cssVars.colorKnob

                this.ctx.beginPath()
                this.ctx.rect(m - knobWidth / 6, _d, knobWidth / 3, PXSCALE)
                this.ctx.fill()

            }

            this.clearRect = [m - knobWidth / 2 - PXSCALE, this.gaugePadding - knobHeight / 2  - PXSCALE, knobWidth + 2 * PXSCALE, height - 2 * this.gaugePadding + knobHeight + 2 * PXSCALE]

        } else {

            this.ctx.globalAlpha = 1
            this.ctx.fillStyle = this.cssVars.colorKnob

            this.ctx.beginPath()
            this.ctx.arc(m, d, knobHeight / 6, 0, 2 * Math.PI)
            this.ctx.fill()

            // extra knob
            this.ctx.beginPath()
            this.ctx.arc(m, d2, knobHeight / 6, 0, 2 * Math.PI)
            this.ctx.fill()


            if (this.cssVars.alphaStroke) {
                this.ctx.globalAlpha = this.cssVars.alphaStroke
                this.ctx.fillStyle = this.cssVars.colorKnob

                this.ctx.beginPath()
                this.ctx.arc(m, d, knobHeight / 2, 0, 2 * Math.PI)
                this.ctx.fill()

                // extra knob
                this.ctx.beginPath()
                this.ctx.arc(m, d2, knobHeight / 2, 0, 2 * Math.PI)
                this.ctx.fill()
            }

            this.clearRect = [m - knobHeight / 2 - PXSCALE, this.gaugePadding - knobHeight / 2 - PXSCALE, knobHeight + 2 * PXSCALE, height - 2 * this.gaugePadding + knobHeight + 2 * PXSCALE]

        }

        if (this.shouldDrawPips) {
            this.drawPips()
            this.shouldDrawPips = false
        }

        if (this.pips && this.pips.width && this.pips.height) {
            this.ctx.globalAlpha = 1
            this.ctx.drawImage(this.pips, 0, 0)
            if (!compact) this.clearRect = [this.clearRect, [m + knobWidth / 2, 0, 12 * PXSCALE + this.pipsTextSize, height]]
        }


    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        if (rangePassedProps.includes(propName)) {
            for (var f of this.faders) {
                f.onPropChanged(...arguments)
            }
        }

    }

    onRemove() {

        this.faders[0].onRemove()
        this.faders[1].onRemove()
        super.onRemove()

    }

}

export default Range
