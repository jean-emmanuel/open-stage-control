var CanvasGL = require('../common/canvasgl'),
    Script = require('../scripts/script'),
    widgetManager = require('../../managers/widgets'),
    html = require('nanohtml')

class CanvasGLWidget extends CanvasGL {

    static description() {

        return 'Multitouch canvas widget with user-defined drawing functions and touch reactions.'

    }

    static defaults() {

        var defaults = super.defaults().extend({
            class_specific: {
                valueLength: {type: 'number', value: 1, help:[
                    'Defines the number of values accepted by the widget (minimum 1). Incoming messages that don\'t comply will be ignored',
                    'When calling `set()` from a script, submitted value should be an array only if `valueLength` is greater than 1.'
                ]},
                continuous: {type: 'boolean|number', value: false, help: [
                    'If set to `true`, `onDraw` will be called at each frame, otherwise it will be called only when the widget is touched and when it receives a value.',
                    'Can be a number between 1 and 60 to specify the framerate (default: 30 fps).'
                ]},
            }
        })
        defaults.scripting = {
            onCreate: {type: 'script', value: '', editor: 'javascript', help: ['Script executed when the widget is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
            onValue: {type: 'script', value: '', editor: 'javascript', help: ['Script executed whenever the widget\'s value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
            onTouch: {type: 'script', value: '', editor:'javascript', help: ['Script executed when the widget is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>.',]},
            onDraw: {type: 'script', value: '', editor:'javascript', help: ['Script executed when the widget is redrawn. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>.']},
            onResize: {type: 'script', value: '', editor:'javascript', help: ['Script executed when the widget is resized. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>.']},
        }
        return defaults

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <canvas></canvas>
            </inner>
        `})

        this.valueLength = Math.max(1, parseInt(this.getProp('valueLength')) || 1)
        this.value = this.valueLength > 1 ? Array(this.valueLength).fill(0) : 0

        if (this.getProp('onResize')) {
            this.scripts.onResize = new Script({
                widget: this,
                property: 'onResize',
                code: this.getProp('onResize'),
                context: {
                    value: 0,
                    width: 100,
                    height: 100,
                    cssVars: {}
                }
            })
        }

        if (this.getProp('onDraw')) {
            this.scripts.onDraw = new Script({
                widget: this,
                property: 'onDraw',
                code: this.getProp('onDraw'),
                context: {
                    value: 0,
                    width: 100,
                    height: 100,
                    gl: {},
                    cssVars: {}
                }
            })
        }

        if (this.getProp('onTouch')) {

            this.scripts.onTouch = new Script({
                widget: this,
                property: 'onTouch',
                code: this.getProp('onTouch'),
                context: {
                    value: 0,
                    width: 100,
                    height: 100,
                    event: {}
                }
            })

            this.on('draginit',(e)=>this.onTouch(e, 'start'), {element: this.container, multitouch: true})
            this.on('drag',(e)=>this.onTouch(e, 'move'), {element: this.container, multitouch: true})
            this.on('dragend',(e)=>this.onTouch(e, 'stop'), {element: this.container, multitouch: true})

        }

        if (this.getProp('continuous')) {
            var freq = parseInt(this.getProp('continuous')) || 30
            freq = Math.max(Math.min(60, freq), 1)
            this.drawInterval = setInterval(()=>{
                this.batchDraw()
            }, 1000/freq)
        }

    }

    onTouch(e, name) {

        var event = {...e}
        delete event.firstTarget

        event.targetName = event.target ? event.target.getAttribute('name') : ''
        event.targetTagName = event.target ? event.target.tagName : ''

        var w = widgetManager.getWidgetByElement(event.target)
        if (w) event.target = w === this ? 'this' : w.getProp('id')
        else event.target = null

        event.type = name

        this.scripts.onTouch.run({
            value: this.value,
            width: this.width,
            height: this.height,
            event: event,
        }, {sync: true, send: true})

        this.batchDraw()

    }

    setValue(v, options={}) {

        if (Array.isArray(v)) {
            if (v.length !== this.valueLength) return
        } else if (this.valueLength > 1) return

        this.value = v

        this.batchDraw()

        if (options.sync) this.changed(options)
        if (options.send) this.sendValue()
        if (options.defaultInit && this.script) this.script.setValue(this.value, {id: this.getProp('id')})

    }


    draw() {

        if (!this.getProp('onDraw')) return

        this.scripts.onDraw.run({
            value: this.value,
            gl: this.gl,
            width: this.width,
            height: this.height,
            cssVars: this.cssVars
        }, {sync: false, send: false})

    }

    extraResizeHandle(event) {

        if (!this.getProp('onResize')) return

        this.scripts.onResize.run({
            value: this.value,
            width: this.width,
            height: this.height,
            cssVars: this.cssVars
        }, {sync: false, send: false})

    }

    onRemove() {

        clearInterval(this.drawInterval)

        super.onRemove()

    }

}

CanvasGLWidget.dynamicProps = CanvasGLWidget.prototype.constructor.dynamicProps.concat([
])

module.exports = CanvasGLWidget
