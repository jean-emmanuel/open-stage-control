import Pad from './pad.mjs'
import Xy from './xy.mjs'
import {clip} from '../utils.mjs'
import doubleTap from '../mixins/double_tap.mjs'
import touchstate from '../mixins/touch_state.mjs'
import {PXSCALE} from '../../globals.mjs'


var xyDefaults = Xy.defaults()._props()


class MultiXy extends Pad {

    static description() {

        return 'Multi-point XY pad.'

    }

    static defaults() {


        var defaults = super.defaults().extend({
            style: {
                _separator_xy_style: 'Xy style',
                pointSize: {type: 'integer', value: 20, help: 'Defines the points\' default size (may be in %)'},
                ephemeral: {type: 'boolean', value: false, help: 'When set to `true`, the points will be drawn only while touched.'},
                pips: {type: 'boolean', value: true, help: 'Set to `false` to hide the scale'},
            },
            class_specific: {
                points: {type: 'integer|array', value: 2, help: [
                    'Defines the number of points on the pad',
                    'Can be an array of strings that will be used as labels for the points (ex: `[\'A\', \'B\']`)'
                ]},
                pointsAttr: {type: 'object', value: [], help: [
                    'Defines per-point properties that are otherwise inherited from the multixy. Must be an array of objects (one per point) that may contain the following keys:',
                    '- visible (visibility and interactability)',
                    '- colorFill (background color)',
                    '- colorStroke (outline color)',
                    '- colorText (label color)',
                    '- color (shorthand for colorFill and colorStroke)',
                    '- alphaFillOn (background opacity)',
                    '- pointSize',
                    '- label'
                ]},
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
                    'Restrict movements to one of the axes only.',
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

        this.npoints = Array.isArray(this.getProp('points')) ? this.getProp('points').length : parseInt(this.getProp('points'))

        if (isNaN(this.npoints) || this.npoints < 1) this.npoints = 1

        this.preventChildrenTouchState = true
        this.pads = []

        for (let i = 0; i < this.npoints; i++) {
            this.pads[i] = new Xy({props:{
                ...xyDefaults,
                snap:this.getProp('snap'),
                spring:this.getProp('spring'),
                ephemeral:this.getProp('ephemeral'),
                default:this.getProp('default').length === this.npoints * 2 ? [this.getProp('default')[i*2], this.getProp('default')[i*2 + 1]] : '',
                rangeX:this.getProp('rangeX'),
                rangeY:this.getProp('rangeY'),
                decimals:this.getProp('decimals'),
                logScaleX:this.getProp('logScaleX'),
                logScaleY:this.getProp('logScaleY'),
                stepsX:this.getProp('stepsX'),
                stepsY:this.getProp('stepsY'),
                axisLock:this.getProp('axisLock'),
                pointSize: 'auto',
                pips: false,
                sensitivity: this.getProp('sensitivity'),
                input:false
            }, parent: this})
            this.pads[i].canvas.classList.add('pad-' + i)
            this.widget.append(this.pads[i].canvas)

        }

        // tiny hack for pips until there's a proper range refactoring
        this.faders = this.pads[0].faders

        this.pointsAttr = []
        this.updatePadsAttr()

        this.padsCoords = []
        this.touchMap = {}

        this.on('dragend',(e)=>{

            var i = this.touchMap[e.pointerId]

            if (!i) return

            this.pads[i].touched = 0
            this.pads[i].trigger('dragend', e)

            this.trigger('touch', {stopPropagation: true, touch: [parseInt(this.touchMap[e.pointerId]), 0]})

            delete this.touchMap[e.pointerId]

        }, {element: this.widget, multitouch: true})

        touchstate(this, {element: this.widget, multitouch: true})

        this.on('draginit',(e)=>{

            var id

            if (!this.touchMap[e.pointerId]) {

                id = this.getPadIdFromCoords(e.offsetX, e.offsetY)

                this.touchMap[e.pointerId] = id

            }

            if (!id) return

            this.trigger('touch', {stopPropagation: true, touch: [parseInt(id), 1]})

            this.pads[id].trigger('draginit', e)
            this.pads[id].touched = 1

        }, {element: this.widget, multitouch: true})

        this.on('drag',(e)=>{

            var i = this.touchMap[e.pointerId]

            if (!i) return

            e.fingers = 1 // cancel mutlifinger inertia

            this.pads[i].trigger('drag', e)

        }, {element: this.widget, multitouch: true})

        this.on('value-changed',(e)=>{
            if (e.widget == this) return
            e.stopPropagation = true
            if (e.options.spring) e.options.dragged = true
            this.setValue(this.getValue(), e.options)
        })

        if (this.getProp('doubleTap')) {

            if (typeof this.getProp('doubleTap') === 'string' && this.getProp('doubleTap')[0] === '/') {

                doubleTap(this, ()=>{
                    this.sendValue({v:null, address: this.getProp('doubleTap')})
                }, {element: this.widget})

            } else {

                doubleTap(this, (e) => {
                    var id, ndiff, diff = Infinity

                    for (var i in this.pads) {
                        ndiff = Math.abs(e.offsetX - this.padsCoords[i][0]) + Math.abs(e.offsetY - (this.padsCoords[i][1] + this.height))
                        if (ndiff < diff) {
                            id = i
                            diff = ndiff
                        }
                    }

                    var pad = this.pads[id]

                    if (this.getProp('doubleTap') == 'script') {
                        this.scripts.onTouch.run({
                            event: {type: 'doubleTap', handle: id},
                            value: this.value
                        }, {sync: true, send: true})
                    } else {
                        pad.setValue([pad.faders.x.getSpringValue(), pad.faders.y.getSpringValue()], { sync: true, send: true, spring: true, doubleTap: true })
                    }

                }, { element: this.widget})

            }

        }

        var v = []
        for (let i = 0; i < this.npoints * 2; i = i + 2) {
            [v[i],v[i+1]]  = this.pads[i/2].getValue()
        }

        this.setValue(v)

    }

    getPadIdFromCoords(x, y) {

        var ndiff, diff = -1,
            id

        for (var i in this.pads) {

            if (Object.values(this.touchMap).indexOf(i) != -1) continue
            if (!this.pads[i].getProp('visible')) continue

            ndiff = Math.abs(x -  this.padsCoords[i][0]) + Math.abs(y - (this.padsCoords[i][1] + this.height))

            if (diff == -1 || ndiff < diff) {
                id = i
                diff = ndiff
            }

        }

        return id

    }

    extraResizeHandle(event){

        super.extraResizeHandle(event)

        for (var k in this.pads) {
            this.pads[k].width = this.width
            this.pads[k].height = this.height
            this.pads[k].padPadding = this.padPadding
        }

        this.updateHandlesPosition()


    }

    cacheCanvasStyle(style) {

        super.cacheCanvasStyle(style)
        for (var k in this.pads) {
            this.pads[k].cacheCanvasStyle()
            this.pads[k].batchDraw()
        }
        this.batchDraw()

    }

    setVisibility() {

        super.setVisibility()
        for (var k in this.pads) {
            this.pads[k].setVisibility()
        }
        this.batchDraw()

    }

    updateHandlesPosition() {

        for (var i=0;i<this.npoints;i++) {
            var pointSize = this.pads[i].pointSize
            this.padsCoords[i] = [clip(this.pads[i].faders.x.percent,[0,100]) / 100 * (this.width - (pointSize * 2 + 2) * PXSCALE) + (pointSize + 1) * PXSCALE
                ,- clip(this.pads[i].faders.y.percent,[0,100]) / 100 * (this.height - (pointSize * 2 + 2) * PXSCALE) - (pointSize + 1) * PXSCALE]

        }

    }

    draw() {

        this.clear()

        if (this.getProp('pips')) this.drawPips()

    }

    getValue(withdecimals) {

        var v = []
        for (var i=0;i<this.pads.length * 2;i=i+2) {
            [v[i],v[i+1]] = this.pads[i/2].getValue(withdecimals)
        }
        return v

    }

    setValue(v, options={}) {

        if (!v || !v.length || v.length!=this.npoints * 2) return
        if (
            this.touched &&
            !options.dragged &&
            !options.doubleTap &&
            options.fromScript !== this.hash
        ) return this.setValueTouchedQueue = [v, options]

        for (let i=0;i<this.npoints;i++) {
            if (!options.dragged) {
                this.pads[i].setValue([v[i*2], v[i*2+1]], { doubleTap: options.doubleTap })
            }
        }

        this.updateHandlesPosition()

        for (let i=0;i<this.npoints * 2;i=i+2) {
            [this.value[i],this.value[i+1]]  = this.pads[i/2].getValue()
        }

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    updatePadsAttr(options) {

        var attrs = this.getProp('pointsAttr')
        if (!Array.isArray(attrs)) attrs = []

        this.pointsAttr = []

        var legacyLabels =  Array.isArray(this.getProp('points'))

        for (var i = 0; i < this.npoints; i++) {

            var a = attrs[i] || {}
            this.pointsAttr[i] = {}

            // color alias
            if (a.color !== undefined) {
                if (a.colorFill === undefined) a.colorFill = a.color
                if (a.colorStroke === undefined) a.colorStroke = a.color
            }

            if (a.label === undefined) {
                a.label = legacyLabels ? this.getProp('points')[i] : String(i)
            }

            for (var n of ['visible', 'axisLock', 'spring', 'colorFill', 'colorStroke', 'colorText', 'alphaFillOn', 'pointSize', 'label']) {
                this.pointsAttr[i][n] = a[n] === undefined ? this.getProp(n) : a[n]

                if (this.pads[i].cachedProps[n] !==  this.pointsAttr[i][n]) {
                    this.pads[i].cachedProps[n] = this.pointsAttr[i][n]
                    this.pads[i].onPropChanged(n, options)

                    var cssVar = this.constructor.cssVariables.find(x=>x.js==n)
                    if (cssVar) {
                        this.pads[i].canvas.style.setProperty(cssVar.css, this.pointsAttr[i][n] == 'auto' ? '' : this.pointsAttr[i][n])
                    }

                    if (n == 'visible') {
                        this.pads[i].canvas.style.setProperty('opacity', this.pointsAttr[i][n] ? 1 : 0)
                    }

                }
            }
        }


    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'padding':
                for (let w of this.pads) {
                    w.onPropChanged(propName)
                }
                return

            case 'colorText':
            case 'colorWidget':
            case 'colorFill':
            case 'colorStroke':
            case 'alphaStroke':
            case 'alphaFillOff':
            case 'alphaFillOn':
            case 'pointsAttr':
            case 'spring':
            case 'pointSize':
            case 'axisLock':
                this.updatePadsAttr(options)
                return
        }

    }

    onRemove() {
        for (var i in this.pads) {
            this.pads[i].onRemove()
        }
        super.onRemove()
    }

}


MultiXy.dynamicProps = MultiXy.prototype.constructor.dynamicProps.filter(n => n !== 'decimals').concat([
    'pointsAttr',
])

export default MultiXy
