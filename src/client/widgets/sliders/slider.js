var {clip, mapToScale} = require('../utils'),
    Canvas = require('../common/canvas'),
    touchstate = require('../mixins/touch_state'),
    doubleTap = require('../mixins/double_tap'),
    html = require('nanohtml/lib/browser')

class Slider extends Canvas {

    constructor(options) {

        super({...options, html: html`
            <canvas></canvas>
        `})

        this.container.classList.add('design-' + this.getProp('design'))

        this.percent = 0

        this.gaugePadding = 0

        this.rangeKeys = Object.keys(this.getProp('range')).sort((a,b)=>{
            if (a === 'min' || b === 'max') return -1
            else if (a === 'max' || b === 'min') return 1
            else return parseFloat(a) - parseFloat(b)
        })
        this.rangeVals = []
        this.rangeLabels = []

        for (var i in this.rangeKeys) {
            var k = this.rangeKeys[i],
                key = k == 'min' ? 0 : k == 'max' ? 100 : parseFloat(k),
                val = typeof this.getProp('range')[k] === 'object' && this.getProp('range')[k] !== null ?
                    this.getProp('range')[k][Object.keys(this.getProp('range')[k])[0]]:
                    this.getProp('range')[k]

            if (isNaN(val) || val === null || val === undefined) val = 0

            var label = typeof this.getProp('range')[k] === 'object' && this.getProp('range')[k] !== null ?
                    Object.keys(this.getProp('range')[k])[0]:
                    val

            if (Math.abs(label) >= 1000) label = Math.round(label / 1000) + 'k'

            this.rangeKeys[i] = key
            this.rangeVals.push(val)
            this.rangeLabels.push(label)
        }

        this.rangeValsMax = Math.max(...this.rangeVals),
        this.rangeValsMin = Math.min(...this.rangeVals)

        this.originValue = this.getProp('origin')=='auto'?
            this.rangeValsMin:
            clip(this.getProp('origin'), [this.rangeValsMin,this.rangeValsMax])

        if (this.getProp('doubleTap')) {

            if (typeof this.getProp('doubleTap') === 'string' && this.getProp('doubleTap')[0] === '/') {

                doubleTap(this, (e)=>{
                    if (!this.shouldDrag(e)) return
                    this.sendValue({v:null, address: this.getProp('doubleTap')})
                }, {element: this.widget})

            }
            if (this.getProp('doubleTap') == 'script') {

                doubleTap(this, (e)=>{
                    if (!this.shouldDrag(e)) return
                    this.scripts.onTouch.run({
                        event: {type: 'doubleTap'},
                        value: this.value
                    }, {sync: true, send: true})
                }, {element: this.widget})


            } else {

                doubleTap(this, (e)=>{
                    if (!this.shouldDrag(e)) return
                    this.setValue(this.getSpringValue(),{sync:true, send:true, fromLocal:true, doubleTap:true})
                }, {element: this.widget})

            }

        }


        touchstate(this, {element: this.widget, multitouch: options.multitouch})

        this.on('draginit', this.draginitHandleProxy.bind(this), {element:this.widget, multitouch: options.multitouch})
        this.on('drag', this.dragHandleProxy.bind(this), {element:this.widget, multitouch: options.multitouch})
        this.on('dragend', this.dragendHandleProxy.bind(this), {element:this.widget, multitouch: options.multitouch})
        this.on('wheel',this.mousewheelHandleProxy.bind(this), {element: this.widget})

        this.steps = null
        this.setSteps()

        this.setValue(this.getSpringValue())

    }

    shouldDrag(e) {

        return true

    }

    mousewheelHandleProxy() {

        this.mousewheelHandle(...arguments)

    }

    draginitHandleProxy() {

        this.draginitHandle(...arguments)

    }

    dragHandleProxy() {

        this.dragHandle(...arguments)

    }

    dragendHandleProxy() {

        this.dragendHandle(...arguments)

    }

    mousewheelHandle(e) {

        if (e.deltaX || this.getProp('spring') || !this.shouldDrag(e)) return

        e.preventDefault()
        e.stopPropagation()

        var direction = e.deltaY > 0 ? -1 : 1,
            increment = e.ctrlKey ? 0.25 : 1

        if (this.steps) {
            var i = this.steps.indexOf(this.value),
                val
            if (i === -1) {
                val = this.steps.reduce((a, b) => {
                    let aDiff = Math.abs(a - this.value),
                        bDiff = Math.abs(b - this.value)

                    if (aDiff == bDiff) {
                        return (direction ? a > b : b > a) ? a : b
                    } else {
                        return bDiff < aDiff && ((b - this.value) > 0  != e.deltaY > 0)? b : a
                    }
                })
            }
            else if (i < this.steps.length) {
                val = this.steps[i + direction]
            }
            if (val !== undefined) this.setValue(val, {sync: true, send: true, fromLocal: true})
        } else {
            this.percent = clip(this.percent +  Math.max(increment,10/Math.pow(10,this.decimals + 1)) * direction, [0,100])
            this.setValue(this.percentToValue(this.percent), {sync: true, send: true, dragged: true})
        }

    }

    draginitHandle(e, data, traversing) {

    }

    dragHandle(e, data, traversing) {

    }

    dragendHandle(e, data, traversing) {

        if (this.getProp('spring')) {
            this.setValue(this.getSpringValue(),{sync:true,send:true,fromLocal:true})
        }

    }

    cacheCanvasStyle(style) {

        super.cacheCanvasStyle(style)

        this.gaugePadding = this.cssVars.padding + this.cssVars.lineWidth

    }



    getSpringValue() {

        return this.getProp('default') !== '' ? this.getProp('default') :  this.originValue

    }


    percentToValue(percent) {

        var h = clip(percent,[0,100])
        for (var i=0;i<this.rangeKeys.length-1;i++) {
            if (h <= this.rangeKeys[i+1] && h >= this.rangeKeys[i]) {
                return mapToScale(h, [this.rangeKeys[i], this.rangeKeys[i + 1]], [this.rangeVals[i], this.rangeVals[i + 1]], -1, this.getProp('logScale'))
            }
        }

    }

    valueToPercent(value) {

        for (var i=0;i<this.rangeVals.length-1;i++) {
            if (
                (this.rangeVals[i+1] > this.rangeVals[i] && value <= this.rangeVals[i+1] && value >= this.rangeVals[i]) ||
                (this.rangeVals[i+1] < this.rangeVals[i] && value >= this.rangeVals[i+1] && value <= this.rangeVals[i])
            ) {
                return mapToScale(value, [this.rangeVals[i], this.rangeVals[i + 1]], [this.rangeKeys[i], this.rangeKeys[i + 1]], -1, this.getProp('logScale'), true)
            }
        }

    }

    setValue(v,options={}) {

        if (typeof v != 'number') return
        if (
            this.touched &&
            !options.dragged &&
            !options.doubleTap &&
            options.fromScript !== this.hash
        ) return this.setValueTouchedQueue = [v, options]

        var value = clip(v,[this.rangeValsMin,this.rangeValsMax])

        if ((options.dragged || options.fromLocal) && this.value.toFixed(this.decimals) == value.toFixed(this.decimals)) options.send = false

        this.value = value

        if (this.steps) {

            var diff = this.steps.map(x => Math.abs(x - this.value)),
                index = diff.indexOf(Math.min(...diff)),
                val = this.steps[index]

            if (!isNaN(val)) this.value = clip(val, [this.rangeValsMin,this.rangeValsMax])

        }

        if (!options.dragged || options.fromScript) this.percent = this.valueToPercent(this.value)

        this.batchDraw()

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    setSteps() {

        if (this.getProp('steps')) {
            var steps = this.getProp('steps')
            if (steps === 'auto') {
                this.steps = this.rangeVals
            } else if (typeof steps === 'number' && Math.round(steps) > 0) {
                steps = Math.round(steps)
                this.steps = Array(steps).fill(0).map((x, i) => i / (steps - 1) * (this.rangeValsMax - this.rangeValsMin) + this.rangeValsMin)
            } else if (Array.isArray(steps) && steps.every(x=>typeof x === 'number')) {
                this.steps = steps
            } else {
                this.steps = null
            }
        } else {
            this.steps = null
        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'steps':
                this.setSteps()
                return
            case 'spring':
                if (this.getProp('spring') && !this.touched) this.setValue(this.getSpringValue(), {...options})
                return
            case 'colorKnob':
            case 'knobSize':
                this.setCssVariables()
                return

        }

    }

    onRemove() {

        super.onRemove()

    }

}

Slider.dynamicProps = Slider.prototype.constructor.dynamicProps
    .concat([
        'steps',
        'spring',
        'sensitivity',
        'default',
        'colorKnob',
        'knobSize'
    ])

module.exports = Slider
