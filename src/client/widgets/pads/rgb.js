var Widget = require('../common/widget'),
    Xy = require('./xy'),
    Fader = require('../sliders/fader'),
    {clip, mapToScale, hsbToRgb, rgbToHsb} = require('../utils'),
    html = require('nanohtml'),
    touchstate = require('../mixins/touch_state')

var faderDefaults = Fader.defaults()._props(),
    xyDefaults = Xy.defaults()._props()


module.exports = class Rgb extends Widget {

    static description() {

        return 'Color picker with optional alpha slider.'

    }

    static defaults() {

        var defaults = super.defaults().extend({
            class_specific: {
                snap: {type: 'boolean', value: false, help: [
                    'By default, the points are dragged from their initial position.',
                    'If set to `true`, touching anywhere on the widget\'s surface will make them snap to the touching coordinates',
                ]},
                spring: {type: 'boolean', value: false, help: 'When set to `true`, the widget will go back to its default value when released'},
                range: {type: 'object', value: {min: 0, max: 255}, help: 'Defines the widget\'s output scale.'},
                alpha:{type: 'boolean', value: false, help: 'Set to `true` to enable alpha channel'},
                rangeAlpha: {type: 'object', value: {min: 0, max: 1}, help: 'Defines the widget\'s output scale for the alpha channel.'},
            }
        })

        defaults.scripting.onTouch = {type: 'script', value: '', editor:'javascript', help: ['Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.',]}

        return defaults

    }

    constructor(options) {

        super({...options, value: [], html: html`<inner></inner>`})

        this.container.classList.toggle('contains-alpha', this.getProp('alpha'))

        this.preventChildrenTouchState = true

        this.pad = new Xy({props:{
            ...xyDefaults,
            type: 'xy',
            label: false,
            snap:this.getProp('snap'),
            rangeX:{min:0,max:100},
            rangeY:{min:0,max:100},
            decimals:2,
            pointSize: 10,
            pips: false,
        }, parent: this})
        this.pad.sendValue = ()=>{}
        this.pad.container.classList.add('not-editable', 'pad')
        this.widget.appendChild(this.pad.container)
        this.pad.on('value-changed',(e)=>{
            e.stopPropagation = true
            this.dragHandle()
        })

        this.hue = new HueFader({props:{
            ...faderDefaults,
            type: 'fader',
            design: 'compact',
            label: false,
            pips:false,
            horizontal:false,
            snap:this.getProp('snap'),
            range:{min:0,max:360},
            decimals:2
        }, parent: this})
        this.hue.container.classList.add('not-editable', 'hue')
        this.widget.appendChild(this.hue.container)
        this.hue.on('value-changed',(e)=>{
            e.stopPropagation = true
            this.dragHandle(true)
        })

        if (this.getProp('alpha')) {
            this.alpha = new Fader({props:{
                ...faderDefaults,
                type: 'fader',
                design: 'compact',
                label:false,
                pips:false,
                horizontal:true,
                snap:this.getProp('snap'),
                range: this.getProp('rangeAlpha'),
                default: 255,
                input:false,
                decimals:2
            }, parent: this})
            this.alpha.container.classList.add('not-editable', 'alpha')
            this.widget.appendChild(this.alpha.container)
            this.alpha.on('value-changed',(e)=>{
                e.stopPropagation = true
                this.dragAlphaHandle()
            })
        }

        var initValue = Array.isArray(this.getProp('default')) && this.getProp('default').length >= 3 ? this.getProp('default') : Array(3).fill(this.getProp('range').min)
        if (this.getProp('alpha') && initValue.length < 4) {
            initValue[3] = this.getProp('rangeAlpha').min
        }

        if (this.getProp('spring')) {

            this.on('dragend', (e)=>{

                e.stopPropagation = true
                this.setValue(initValue, {sync:true,send:true})

            }, {element: this.widget, ignoreCustomBindings: true})

        }

        touchstate(this, {element: this.widget, multitouch: true, ignoreCustomBindings: false})

        this.hsb = {h:0,s:0,b:0}

        this.setValue(initValue)

    }

    dragHandle(hue) {
        var h = this.hue.value,
            s = this.pad.value[0],
            b = this.pad.value[1]

        if (h != this.hsb.h ||s != this.hsb.s || b != this.hsb.b) {

            this.hsb.h = this.hue.value
            this.hsb.s = this.pad.value[0]
            this.hsb.b = this.pad.value[1]

            this.update({nohue:!hue})

            var rgb = hsbToRgb(this.hsb)
            for (var k in rgb) {
                rgb[k] = mapToScale(rgb[k], [0, 255], [this.getProp('range').min, this.getProp('range').max], -1)
            }

            if (rgb.r != this.value[0] || rgb.g != this.value[1] || rgb.b != this.value[2]) {
                this.setValue([rgb.r, rgb.g, rgb.b], {
                    send: true,
                    sync: true,
                    dragged: true,
                    nohue: !hue
                })
            }
        }

    }

    dragAlphaHandle() {

        var alpha = this.alpha.value
        if (alpha !== this.value[3]) {
            this.setValue([this.value[0], this.value[1], this.value[2], alpha], {
                send: true,
                sync: true,
                dragged: true,
                nohue: true
            })
        }


    }

    setValue(v, options={}) {

        if (!v || v.length < 3) return
        if (this.touched && !options.dragged) return this.setValueTouchedQueue = [v, options]

        var value = Array(this.getProp('alpha') ? 4 : 3)

        for (var i = 0; i < 3; i++) {
            value[i] = clip(v[i], [this.getProp('range').min, this.getProp('range').max])
        }

        if (value.length === 4) {
            value[3] = v[3] === undefined ? this.alpha.value : clip(v[3], [this.getProp('rangeAlpha').min, this.getProp('rangeAlpha').max])
        }

        var hsb = rgbToHsb({
            r: mapToScale(value[0], [this.getProp('range').min, this.getProp('range').max], [0, 255], -1),
            g: mapToScale(value[1], [this.getProp('range').min, this.getProp('range').max], [0, 255], -1),
            b: mapToScale(value[2], [this.getProp('range').min, this.getProp('range').max], [0, 255], -1)
        })

        if (!options.dragged) {
            this.pad.setValue([hsb.s, hsb.b])
            if (value.length === 4) this.alpha.setValue(value[3])
        }

        this.hsb = hsb
        this.value = value


        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

        this.update({dragged:options.dragged, nohue:options.nohue || (v[0]==v[1]&&v[1]==v[2])})

    }

    update(options={}) {

        if (!options.nohue && !options.dragged) {
            var hue = hsbToRgb({h:this.hsb.h,s:100,b:100}),
                hueStr = `rgb(${Math.round(hue.r)},${Math.round(hue.g)},${Math.round(hue.b)})`
            this.pad.container.setAttribute('style',`background-color:${hueStr}`)
            this.hue.setValue(this.hsb.h, {sync: false, send:false, dragged:false})
        }

    }


    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'colorText':
            case 'colorWidget':
            case 'colorFill':
            case 'colorStroke':
            case 'alphaStroke':
            case 'alphaFillOff':
            case 'alphaFillOn':
                for (var w of [this.hue, this.pad]) {
                    w.onPropChanged(propName)
                }
                if (this.alpha) this.alpha.onPropChanged(propName)
                return

        }

    }

    setVisibility() {

        super.setVisibility()

        for (var w of [this.hue, this.pad]) {
            if (w) w.setVisibility()
        }
        if (this.alpha) this.alpha.setVisibility()

    }

    onRemove() {
        this.hue.onRemove()
        this.pad.onRemove()
        if (this.alpha) this.alpha.onRemove()
        super.onRemove()
    }

}

class HueFader extends Fader {

    draw() {

        var width = this.getProp('horizontal') ? this.height : this.width,
            height = !this.getProp('horizontal') ? this.height : this.width

        var percent = this.getProp('steps') ? this.valueToPercent(this.value) : this.percent,
            d = Math.round(this.percentToCoord(percent)),
            m = this.getProp('horizontal') ? this.height / 2 : this.width / 2,
            flat = this.getProp('mode') === 'flat'

        // sharp border trick
        if (width % 2 && parseInt(m) === m) m -= 0.5

        this.clear()


        this.ctx.strokeStyle = this.gaugeGradient || this.cssVars.colorFill

        if (flat) {
            this.ctx.lineWidth = Math.round(width - this.gaugePadding * 2)
        } else {
            this.ctx.lineWidth = 2 * PXSCALE
        }


        // flat knob

        this.ctx.globalAlpha = 1
        this.ctx.fillStyle = this.cssVars.colorFill

        this.ctx.beginPath()
        this.ctx.rect(this.gaugePadding, Math.min(d, height - 2 * PXSCALE), width - this.gaugePadding * 2, 2 * PXSCALE)
        this.ctx.fill()

        this.clearRect = [0, 0, width, height]

    }

}
