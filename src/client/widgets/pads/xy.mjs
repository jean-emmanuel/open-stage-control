import Pad from './pad.mjs'
import Fader from '../sliders/fader.mjs'
import doubleTap from '../mixins/double_tap.mjs'
import touchstate from '../mixins/touch_state.mjs'

var faderDefaults = Fader.defaults()._props()

export default class Xy extends Pad {

    static description() {

        return 'Two-dimensional slider.'

    }

    static defaults() {

        var defaults = super.defaults().extend({
            style: {
                _separator_xy_style: 'Xy style',
                pointSize: {type: 'integer', value: 20, help: 'Defines the points\' size (may be in %)'},
                ephemeral: {type: 'boolean', value: false, help: 'When set to `true`, the point will be drawn only while touched.'},
                pips: {type: 'boolean', value: true, help: 'Set to `false` to hide the scale'},
                label: {type: 'string', value: '', help: 'Text displayed in the handle'}
            },
            class_specific: {
                snap: {type: 'boolean', value: false, help: [
                    'By default, the points are dragged from their initial position.',
                    'If set to `true`, touching anywhere on the widget\'s surface will make them snap to the touching coordinates',
                ]},
                spring: {type: 'boolean', value: false, help: 'When set to `true`, the widget will go back to its default value when released'},
                rangeX: {type: 'object', value: {min:0,max:1}, help: 'Defines the min and max values for the x axis (see fader)'},
                rangeY: {type: 'object', value: {min:0,max:1}, help: 'Defines the min and max values for the y axis (see fader)'},
                logScaleX: {type: 'boolean|number', value: false, help: 'Set to `true` to use logarithmic scale for the x axis. Set to `-1` for exponential scale.'},
                logScaleY: {type: 'boolean|number', value: false, help: 'Set to `true` to use logarithmic scale for the y axis. Set to `-1` for exponential scale.'},
                stepsX: {type: 'number|array|string', value: false, help: 'Defines `steps` for the x axis (see fader)'},
                stepsY: {type: 'number|array|string', value: false, help: 'Defines `steps` for the x axis (see fader)'},
                axisLock: {type: 'string', value: '', choices: ['', 'x', 'y', 'auto'], help: [
                    'Restrict movements to one of the axes only unless `Shift` is held.',
                    'When left empty, holding `Shift` while dragging will lock the pad according the first movement. `auto` will do the opposite.'
                ]},
                doubleTap: {type: 'boolean|string', value: false, choices: [false, true, 'script'], help: [
                    'Set to `true` to make the knob reset to its `default` value when receiving a double tap.',
                    'Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).',
                    'If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. '
                ]},
                sensitivity: {type: 'number', value: 1, help: 'Defines the pad\'s sensitivity when `snap` is `false` '},
            }
        })

        defaults.scripting.onTouch = {type: 'script', value: '', editor:'javascript', help: ['Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.',]}

        return defaults

    }

    constructor(options) {

        super(options)

        this.preventChildrenTouchState = true

        this.faders = {
            x: new Fader({props:{
                ...faderDefaults,
                id:0,
                visible:false,
                horizontal:true,
                default:this.getProp('default').length === 2 ? this.getProp('default')[0] : '',
                snap:this.getProp('snap'),
                range:this.getProp('rangeX'),
                decimals:this.getProp('decimals'),
                logScale:this.getProp('logScaleX'),
                sensitivity: this.getProp('sensitivity'),
                steps: this.getProp('stepsX'),
            }, parent: this}),
            y: new Fader({props:{
                ...faderDefaults,
                id:1,
                visible:false,
                horizontal:false,
                default:this.getProp('default').length === 2 ? this.getProp('default')[1] : '',
                snap:this.getProp('snap'),
                range:this.getProp('rangeY'),
                decimals:this.getProp('decimals'),
                logScale:this.getProp('logScaleY'),
                sensitivity: this.getProp('sensitivity'),
                steps: this.getProp('stepsY'),
            }, parent: this}),
        }

        this.on('value-changed',(e)=>{
            if (e.widget == this) return
            e.stopPropagation = true
        })

        touchstate(this, {element: this.canvas})

        this.active = false

        this.autoAxisLock = ''

        this.on('draginit',(e)=>{
            this.active = true
            this.autoAxisLock = ''
            var axis = this.getProp('axisLock')
            if (axis !== '' && e.shiftKey) axis = ''
            if (axis !== 'y') this.faders.x.trigger('draginit', {...e, stopPropagation: true})
            if (axis !== 'x') this.faders.y.trigger('draginit', {...e, stopPropagation: true})
            this.dragHandle()
        }, {element: this.canvas})

        this.on('drag',(e)=>{
            var axis = this.getProp('axisLock')
            if (axis !== '' && e.shiftKey) axis = ''
            else if (e.shiftKey && axis === '' || !e.shiftKey && axis === 'auto') {
                if (this.autoAxisLock === '') {
                    if (Math.abs(e.movementX) > Math.abs(e.movementY)) {
                        this.autoAxisLock = 'x'
                    } else if (Math.abs(e.movementY) > Math.abs(e.movementX)) {
                        this.autoAxisLock = 'y'
                    }
                }
                axis = this.autoAxisLock
            }
            if (axis !== 'y') this.faders.x.trigger('drag', e)
            if (axis !== 'x') this.faders.y.trigger('drag', e)
            this.dragHandle()
        }, {element: this.canvas})

        this.on('dragend', (e)=>{
            this.active = false
            var axis = this.getProp('axisLock')
            if (axis !== '' && e.shiftKey) axis = ''
            if (axis !== 'y') this.faders.x.trigger('dragend', {...e, stopPropagation: true})
            if (axis !== 'x') this.faders.y.trigger('dragend', {...e, stopPropagation: true})
            if (this.getProp('spring')) {
                this.setValue([this.faders.x.getSpringValue(),this.faders.y.getSpringValue()],{sync:true, send:true, spring:true})
            } else {
                this.batchDraw()
            }
        }, {element: this.canvas})

        if (this.getProp('doubleTap')) {

            if (typeof this.getProp('doubleTap') === 'string' && this.getProp('doubleTap')[0] === '/') {

                doubleTap(this, ()=>{
                    this.sendValue({v:null, address: this.getProp('doubleTap')})
                }, {element: this.widget})

            } else if (this.getProp('doubleTap') == 'script') {

                doubleTap(this, ()=>{
                    this.scripts.onTouch.run({
                        event: {type: 'doubleTap'},
                        value: this.value
                    }, {sync: true, send: true})
                }, {element: this.widget})


            } else {

                doubleTap(this, ()=>{
                    this.setValue([this.faders.x.getSpringValue(),this.faders.y.getSpringValue()],{sync:true, send:true, spring:true, doubleTap:true})
                }, {element: this.widget})

            }

        }

        this.setValue([0,0])

    }

    dragHandle(){

        var x = this.faders.x.value,
            y = this.faders.y.value


        if (x != this.value[0] || y != this.value[1]) {
            this.setValue([x, y],{send:true,sync:true,dragged:true})
        } else {
            this.batchDraw()
        }

    }

    extraResizeHandle(event){

        super.extraResizeHandle(event)

        for (var k in this.faders) {
            this.faders[k].width = this.width
            this.faders[k].height = this.height
            this.faders[k].gaugePadding = this.padPadding
        }

    }


    setValue(v, options={}) {

        if (!v || !v.length || v.length!=2) return
        if (this.touched && !options.dragged && !options.doubleTap) return this.setValueTouchedQueue = [v, options]

        if (!options.dragged) {
            this.faders.x.setValue(v[0], {sync: false, send:false, dragged:false, doubleTap: options.doubleTap})
            this.faders.y.setValue(v[1], {sync: false, send:false, dragged:false, doubleTap: options.doubleTap})
        }

        this.value = [
            this.faders.x.value,
            this.faders.y.value
        ]

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

        this.batchDraw()

    }

    draw() {

        if (!this.visible) return

        var pointSize = this.pointSize,
            x = this.faders.x.percentToCoord(this.faders.x.valueToPercent(this.faders.x.value)),
            y = this.faders.y.percentToCoord(this.faders.y.valueToPercent(this.faders.y.value)),
            ephemeral = this.getProp('ephemeral')

        this.clear()

        if (!ephemeral || this.active) {
            this.ctx.fillStyle = this.cssVars.colorFill
            this.ctx.globalAlpha = this.cssVars.alphaFillOn
            this.ctx.beginPath()
            this.ctx.arc(x, y, pointSize - 3 * PXSCALE, Math.PI * 2, false)
            this.ctx.fill()
        }



        if (this.getProp('pips'))  this.drawPips()
        else {
            this.clearRect = [[x - pointSize - 2 * PXSCALE, y - pointSize - 2 * PXSCALE, (pointSize + 2 * PXSCALE) * 2, (pointSize + 2 * PXSCALE) * 2]]
        }

        if (!ephemeral || this.active) {
            this.ctx.strokeStyle = this.cssVars.colorStroke
            this.ctx.globalAlpha = this.active ? 1 : 0.75
            this.ctx.lineWidth = 1.5 * PXSCALE
            this.ctx.beginPath()
            this.ctx.arc(x, y, pointSize, Math.PI * 2, false)
            this.ctx.stroke()

            var t = this.getProp('label')
            if (t) {
                this.ctx.fillStyle = this.cssVars.colorText
                this.ctx.globalAlpha = 1
                this.ctx.textAlign = 'center'
                this.ctx.fillText(t, x + 0.5 * PXSCALE, y + PXSCALE)

                if (!this.getProp('pips'))  {
                    var length = this.fontSize * t.length
                    this.clearRect.push([x - length / 2, y - this.fontSize / 2, length, this.fontSize + 2 * PXSCALE])
                }

            }
        }



    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'label':
                this.batchDraw()
                return
            case 'spring':
                if (this.getProp('spring') && !this.touched) {
                    var x = this.faders.x.getSpringValue(),
                        y = this.faders.y.getSpringValue()
                    if (x !== this.value[0] || y !== this.value[1]) this.setValue([x, y], {...options})
                }
                return

        }

    }


    onRemove() {

        this.faders.x.onRemove()
        this.faders.y.onRemove()
        super.onRemove()

    }

}
