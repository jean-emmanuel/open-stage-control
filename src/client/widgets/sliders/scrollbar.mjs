import fastdom from 'fastdom'
import Fader from './fader.mjs'
import StaticProperties from '../mixins/static_properties.mjs'
import {clip} from '../utils.mjs'
import widgetManager from '../../managers/widgets.mjs'
import {PXSCALE} from '../../globals.mjs'

export default class Scrollbar extends StaticProperties(Fader, {
    range: {min: 0, max: 1},
    touchZone: 'all',
    snap: false,
    design: 'compact'
}) {

    static defaults() {

        return super.defaults().extend({
            style: {
                _separator_fader_style: 'Scrollbar style',
                design: null,
                knobSize: null,
                // colorKnob: null,
                pips: null,
                dashed: null,
                gradient: null,
            },
            class_specific: {
                snap: null,
                touchZone: null,
                spring: null,
                doubleTap: null,
                range: null,
                logScale: null,
                steps: null,
                origin: null,
                widgetId: {type: 'string', value: '', help: '`id` of the container widget to control'},
            }
        })

    }

    constructor(options) {

        super(options)

        this.scrollTarget = null
        this.thumbSize = 1

        if (!this.getProp('horizontal')) {
            this.rangeVals[0] = 1
            this.rangeVals[1] = 0
        }

        widgetManager.on('widget-created', (e)=>{

            if (this.scrollTarget) return

            var {id, widget} = e

            if (id === this.getProp('widgetId') && widget.getProp('scroll')) {
                this.unbindTarget()
                this.bindTarget(widget)
            }

        }, {context: this})

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
        for (var widget of widgets) {
            if (widget.getProp('scroll')) {
                this.unbindTarget()
                this.bindTarget(widget)
                break
            }
        }
    }


    draginitHandle(e) {

        // super.draginitHandle(...arguments)

        if (!e.traversing && !this.shouldDrag(e)) {
            e.cancelDragEvent = true
            return
        }

        this.percent = clip(this.percent,[0,100])

        // snap when not touching the knob zone
        if (this.shouldDrag(e, 'knob')) return

        this.percent = this.getProp('horizontal')?
            (e.offsetX - this.gaugePadding) / (this.width - this.gaugePadding * 2) * 100:
            (this.height - e.offsetY - this.gaugePadding) / (this.height - this.gaugePadding * 2) * 100

        this.setValue(this.percentToValue(this.percent), {send: true, sync: true, dragged: true})

    }


    mousewheelHandle(e) {

        e.preventDefault()
        e.stopPropagation()

        var increment
        if (this.getProp('horizontal')) {
            increment = e.deltaY / this.scrollTarget.scrollWidth * 100
        } else {
            increment = -e.deltaY / this.scrollTarget.scrollHeight * 100
        }

        this.percent = clip(this.percent + increment, [0,100])
        this.setValue(this.percentToValue(this.percent), {sync: true, send: true, dragged: true})

    }

    cacheCanvasStyle(style){

        super.cacheCanvasStyle(style)

        var size = this.getProp('horizontal') ? this.width : this.height
        this.cssVars.knobSize = Math.max(this.thumbSize * size, 30)
        this.cssVars.alphaKnob = 0.25

    }


    unbindTarget() {

        if (!this.scrollTarget) return

        this.scrollTarget.off(undefined, undefined, this)

        this.scrollTarget = null
    }

    bindTarget(target) {

        if (!target) return

        this.scrollTarget = target

        this.scrollTarget.on('widget-removed', (e)=>{
            if (this.scrollTarget === e.widget) {
                this.unbindTarget()
            }
        }, {context: this})
        var onScroll = (e, init)=>{

            if (!this.scrollTarget || e.locked) return

            var index = this.getProp('horizontal') ? 0 : 1,
                size = this.getProp('horizontal') ? this.width : this.height

            this.thumbSize = this.scrollTarget.scrollThumb[index]
            this.cssVars.knobSize = Math.max(this.thumbSize * size, 30)

            if (init && this.value) {
                // panel (re)createed: restore scroll state
                this.setValue(this.value, {fromScrollEvent: false, send: false, sync: false})
            } else if (this.scrollTarget.scroll[index] != this.value) {
                // panel scrolling: update scroll state
                this.setValue(this.scrollTarget.scroll[index], {fromScrollEvent: true, send: !init, sync: !init})
            }

        }

        fastdom.measure(()=>{
            this.scrollTarget.on('scroll', onScroll)
            onScroll({}, true)
        })

    }

    setValue(v, options={}) {

        super.setValue(v, options)

        if (!options.fromScrollEvent && this.scrollTarget) {
            var scroll = this.scrollTarget.getScroll()
            if (this.getProp('horizontal')) {
                this.scrollTarget.setScroll(this.value, undefined, true)
            } else {
                this.scrollTarget.setScroll(undefined, this.value, true)
            }
        }

    }

    draw() {

        var width = this.getProp('horizontal') ? this.height : this.width,
            height = !this.getProp('horizontal') ? this.height : this.width

        var percent = this.steps ? this.valueToPercent(this.value) : this.percent,
            d = Math.round(this.percentToCoord(percent)),
            o = Math.round(this.percentToCoord(this.valueToPercent(this.originValue))),
            m = this.getProp('horizontal') ? this.height / 2 : this.width / 2,
            dashed = this.dashed,
            knobHeight = this.cssVars.knobSize

        this.clear()

        // sharp border trick
        if (width % 2 && parseInt(m) === m) m -= 0.5


        this.ctx.strokeStyle = this.gaugeGradient || this.cssVars.colorFill

        this.ctx.lineWidth = Math.round(width - this.gaugePadding * 2)


        if (dashed) this.ctx.setLineDash([PXSCALE * dashed[0], PXSCALE * dashed[1]])


        if (this.cssVars.alphaFillOff) {
            // gaugo off
            this.ctx.globalAlpha = this.cssVars.alphaFillOff
            this.ctx.beginPath()
            this.ctx.moveTo(m, height - this.gaugePadding)
            this.ctx.lineTo(m, this.gaugePadding)
            this.ctx.stroke()
        }


        if (dashed) this.ctx.setLineDash([])

        // flat knob

        this.ctx.globalAlpha = this.cssVars.alphaFillOn
        this.ctx.fillStyle = this.cssVars.colorKnob

        this.ctx.beginPath()
        d = d / (height - this.gaugePadding) * (height-this.gaugePadding - knobHeight)
        if (this.ctx.roundRect) {
            this.ctx.roundRect(this.gaugePadding, d, width - this.gaugePadding * 2, knobHeight, PXSCALE * this.cssVars.borderRadius)
        } else {
            this.ctx.rect(this.gaugePadding, d, width - this.gaugePadding * 2, knobHeight)
        }
        this.ctx.fill()

        let x, y, w, h,
            rad =  PXSCALE * this.cssVars.borderRadius

        // border radius: clip gauge & knob
        if (rad > 0) {
            rad = Math.min(Math.min(height, width) / 2, rad)
            x = this.gaugePadding
            y = this.gaugePadding
            w = width - this.gaugePadding * 2
            h = height - this.gaugePadding * 2
            this.ctx.beginPath()
            this.ctx.moveTo(x + rad, y)
            this.ctx.arcTo(x + w, y, x + w, y + h, rad)
            this.ctx.arcTo(x + w, y + h, x, y + h, rad)
            this.ctx.arcTo(x, y + h, x, y, rad)
            this.ctx.arcTo(x, y, x + w, y, rad)
            this.ctx.closePath()

            var tmpOp = this.ctx.globalCompositeOperation
            this.ctx.globalCompositeOperation = 'destination-in'
            this.ctx.fillStyle = '#ffffff'
            this.ctx.globalAlpha = 1
            this.ctx.fill()
            this.ctx.globalCompositeOperation = tmpOp
        }

        // stroke
        if (this.cssVars.lineWidth) {

            this.ctx.globalAlpha = this.cssVars.alphaStroke
            this.ctx.strokeStyle = this.cssVars.colorStroke

            // draw stroke
            x = 0.5 * this.cssVars.lineWidth
            y = 0.5 * this.cssVars.lineWidth
            w = width - this.cssVars.lineWidth
            h = height - this.cssVars.lineWidth

            this.ctx.beginPath()
            if (rad > 0) {
                this.ctx.moveTo(x + rad, y)
                this.ctx.arcTo(x + w, y, x + w, y + h, rad)
                this.ctx.arcTo(x + w, y + h, x, y + h, rad)
                this.ctx.arcTo(x, y + h, x, y, rad)
                this.ctx.arcTo(x, y, x + w, y, rad)
            } else {
                this.ctx.moveTo(x, y)
                this.ctx.lineTo(x + w, y)
                this.ctx.lineTo(x + w, y + h)
                this.ctx.lineTo(x, y + h)
            }

            this.ctx.closePath()
            this.ctx.lineWidth = this.cssVars.lineWidth
            this.ctx.stroke()

        }



        this.clearRect = [0, 0, width, height]


    }

    onRemove(){

        this.unbindTarget()
        super.onRemove()

    }

}
