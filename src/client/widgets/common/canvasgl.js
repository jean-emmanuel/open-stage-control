var Widget = require('./widget'),
    resize = require('../../events/resize'),
    canvasQueue = require('./queue'),
    html = require('nanohtml'),
    fastdom = require('fastdom')


class CanvasGL extends Widget {

    static defaults() {

        var defaults = super.defaults(CanvasGL)
        defaults.style.css.help.push(
            'Canvas-based widget have their computed width and height available as css variables (read-only):',
            '- `--widget-width`',
            '- `--widget-height`',
        )
        defaults.scripting.onValue.help.push(
            'Canvas-based widget have their computed width and height available as local variables:',
            '- `locals.width`',
            '- `locals.height`',
        )
        return defaults

    }

    constructor(options) {

        super(options)

        this.canvas = DOM.get(this.container, 'canvas')[0]

        this.gl = this.canvas.getContext('webgl2',{
            desynchronized: !ELECTRON_NOGPU && ENV.desynccanvas ? true : false,
            alpha: true
        })

        this.height = undefined
        this.width = undefined
        this.scaling = 1

        this.hasSize = false

        this.colors = {}
        this.cssVars = {}

        this.on('resize', this.resizeHandleProxy.bind(this), {element: this.canvas})

    }

    resizeHandleProxy() {

        fastdom.measure(()=>{
            this.resizeHandle(...arguments)
        })

    }

    resizeHandle(event){

        var {width, height, style} = event,
            ratio = CANVAS_SCALING * this.scaling

        this.height = height
        this.width = width

        this.parsersLocalScope.height = this.height
        this.parsersLocalScope.width = this.width

        this.cacheCanvasStyle(style)

        fastdom.mutate(()=>{

            this.canvas.setAttribute('width', width * ratio)
            this.canvas.setAttribute('height', height * ratio)
            this.container.style.setProperty('--widget-height', this.height + 'rem')
            this.container.style.setProperty('--widget-width', this.width + 'rem')

            // this.gl.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily
            // this.gl.textBaseline = 'middle'
            // this.gl.textAlign = this.textAlign

            // if (ratio != 1) {
            //     this.gl.setTransform(1, 0, 0, 1, 0, 0)
            //     this.gl.scale(ratio, ratio)
            // }

            this.extraResizeHandle(event)

            if (!this.hasSize) {
                this.hasSize = true
                this.setVisibility()
            }

            if (this.width > 0 && this.height > 0 && this.visible) {
                this.draw()
            }

        })

    }

    extraResizeHandle(event) {

        // to be overridden if subclass needs additional actions
        // before redraw

    }

    setVisibility(){

        var visible = this.visible
        super.setVisibility()
        if (!visible && this.visible) this.batchDraw()

    }

    cacheCanvasStyle(style){

        style = style || window.getComputedStyle(this.canvas)

        for (var data of this.constructor.cssVariables) {

            var val = style.getPropertyValue(data.css).trim()

            if (typeof val === 'string' && val.match(/(var|calc)\(/)) {
                // property not computed because of calc() or var() in user style
                // -> attempt to force calculation
                var dummy = html`<div style="position:absolute;width:var(${data.css})"></div>`
                this.container.appendChild(dummy)
                let s = window.getComputedStyle(dummy)
                val = parseInt(s.getPropertyValue('width'))
                this.container.removeChild(dummy)
            }

            this.cssVars[data.js] = data.toJs ? data.toJs(val) : val


        }

        this.fontFamily = style.getPropertyValue('font-family').trim()
        this.textAlign = style.getPropertyValue('text-align').trim()
        this.fontSize = parseFloat(style.getPropertyValue('font-size').trim())
        this.fontWeight = parseFloat(style.getPropertyValue('font-weight').trim())

    }

    batchDraw() {

        if (this.hasSize && this.visible) canvasQueue.push(this)

    }

    draw(){
        throw new Error('Calling unimplemented draw() method')
    }

    onPropChanged(propName, options, oldPropValue) {

        var ret = super.onPropChanged(...arguments)

        switch (propName) {

            case 'colorText':
            case 'colorWidget':
            case 'colorFill':
            case 'colorStroke':
            case 'colorKnob':
            case 'alphaStroke':
            case 'alphaFillOff':
            case 'alphaFillOn':
            case 'colorBg':
            case 'pointSize':
            case 'knobSize':
                fastdom.measure(()=>{
                    this.cacheCanvasStyle()
                    fastdom.mutate(()=>{
                        this.batchDraw()
                    })
                })
                return
            case 'css':
                if (!/\/\*\s*noresize\s*\*\//.test(this.getProp('css'))) resize.check(this.canvas, true)
                fastdom.measure(()=>{
                    this.cacheCanvasStyle()
                    fastdom.mutate(()=>{
                        this.batchDraw()
                    })
                })
            case 'lineWidth':
            case 'padding':
                resize.check(this.canvas, true)
                fastdom.measure(()=>{
                    this.cacheCanvasStyle()
                    fastdom.mutate(()=>{
                        this.batchDraw()
                    })
                })
                return
        }

        return ret


    }

    onRemove() {
        this.off('resize')
        this.canvas.width = 0
        this.canvas.height = 0
        super.onRemove()
    }

}

CanvasGL.cssVariables = CanvasGL.prototype.constructor.cssVariables.concat(
    {js: 'alphaPips', css: '--alpha-pips', toCss: x=>parseFloat(x), toJs: x=>parseFloat(x)},
    {js: 'alphaPipsText', css: '--alpha-pips-text', toCss: x=>parseFloat(x), toJs: x=>parseFloat(x)}
)

module.exports = CanvasGL
