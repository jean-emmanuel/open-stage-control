import html from 'nanohtml'
import Widget from '../common/widget.mjs'
import Canvas from '../common/canvas.mjs'
import Container from '../common/container.mjs'
import {iconify} from '../../ui/utils.mjs'
import parser from '../../parser.mjs'

class PatchBayNode extends Widget {


    static defaults() {

        return super.defaults().extend({
            style: {
                label: {type: 'string', value: ''}
            }
        })

    }

    constructor(options) {

        super({...options, html: html`<label></label>`})

        this.widget.innerHTML = iconify(this.getProp('label').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,'<br/>'))

        this.value = []

    }

    setValue(v, options={} ) {

        this.value = Array.isArray(v) ? v : v ? [v] : []

        var allowed = this.parent.outputsValues
        for (var i = this.value.length -1; i > -1; i--) {
            if (allowed.indexOf(this.value[i]) === -1) {
                this.value.splice(i, 1)
            }
        }

        if (
            (this.parent.getProp('exclusive') === true
             || this.parent.getProp('exclusive') === 'in'
             || this.parent.getProp('exclusive') === 'both')
            && this.value.length > 1
        ) {
            this.value = [this.value.pop()]
        }

        if (
            (this.parent.getProp('exclusive') === 'out' || this.parent.getProp('exclusive') === 'both')
            && this.value.length > 0
        ) {
            for (var input of this.parent.inputsWidgets) {
                if (input !== this && input.value.some(x=>this.value.includes(x))) {
                    input.setValue(input.value.filter(x=>!this.value.includes(x)), options)
                }
            }
        }



        this.parent.batchDraw()

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    toggleValue(v) {

        var index = this.value.indexOf(v)

        if (index > -1) {
            this.value.splice(index, 1)
        } else {
            this.value.push(v)
        }

        this.setValue(this.value, {sync: true, send: true})

    }


}

class PatchBay extends Container(Canvas) {

    static description() {

        return 'Connect inputs to outputs.'

    }

    static defaults() {

        var defaults = super.defaults().extend({
            class_specific: {
                inputs: {type: 'array|object', value: ['input_1', 'input_2'], help: [
                    '- `Array` of input names : `[\'input_1\', \'input_2\']`',
                    '- `Object` of `"label_1": "input_1"` pairs (example: `{"label a": "name 1", "label b": "name 2"}`). Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won\'t be kept',
                    '',
                    'Patchbay inputs can be connected to one or more outputs and will send messages of the following form when they are connected/disconnected: ',
                    '`/patchbay_address input_x output_x output_y etc`',
                    'If no output is connected to the input, the message will be `/patchbay_address input_x`',
                    'The inputs values can be consumed with the property inheritance syntax: `@{patchbay_id/input_1}` returns an array of output names connected to `input_1`.',
                    'To change connections via scripting, one must target the input nodes as follows: `set(\'patchbay_id/input_name\', [\'output_x\', \'output_y\'])`'
                ]},
                outputs: {type: 'array|object', value: ['output_1', 'output_2'], help: 'List of output values the inputs can connect to (see `inputs`).'},
                exclusive: {type: 'string', value: false, choices: [false, 'in', 'out', 'both'], help: [
                    '- `in`: allows only one connection per input',
                    '- `out`: allows only one connection per output',
                    '- `both`: allows only one connection per input and output'
                ]}
            }
        })

        defaults.style.css.help.concat(
            'The inputs/outputs width can be adjusted by using the  `.nodes` selector:',
            '`.nodes { width: 25% }`',
        )

        return defaults
    }

    static normalizeArrayObject(obj) {

        if (typeof obj !== 'object' || obj === null) {
            return PatchBay.normalizeArrayObject([obj])
        } else if (Array.isArray(obj)) {
            var ret = {},
                k, i
            for (i = 0; i < obj.length; i++) {
                k = typeof obj[i] === 'string' ? obj[i] : JSON.stringify(obj[i])
                ret[k] = obj[i]
            }
            return ret
        } else {
            return obj
        }

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <div class="nodes inputs"></div>
                <canvas></canvas>
                <div class="nodes outputs"></div>
            </inner>
        `})

        this.inputs = PatchBay.normalizeArrayObject(this.getProp('inputs'))
        this.outputs = PatchBay.normalizeArrayObject(this.getProp('outputs'))
        this.inputsValues = Object.values(this.inputs)
        this.outputsValues = Object.values(this.outputs)

        this.inputsWidgets = []
        this.inputNodes = []
        this.outputNodes = []

        this.value = {}

        for (let k in this.inputs) {
            let w = parser.parse({
                data: {
                    type: 'patchbaynode',
                    comments: this.inputs[k], // TODO: using comment prop to smuggle input identifier, ok but could be more elegant
                    id: this.getProp('id') + '/' + this.inputs[k],
                    address: '#{@{parent.address} == "auto" ? "/" + @{parent.id} : @{parent.address}}',
                    target: '@{parent.target}',
                    ignoreDefaults: '@{parent.ignoreDefaults}',
                    preArgs: '#{@{parent.preArgs} == "" ? @{this.comments} : Array.isArray(@{parent.preArgs}) ? @{parent.preArgs}.concat(@{this.comments}) : [@{parent.preArgs}, @{this.comments}]}',
                    bypass: '@{parent.bypass}',
                    label: k
                },
                parentNode: DOM.get(this.widget, '.inputs')[0],
                parent: this
            })
            w.container.classList.add('not-editable')
            w._not_editable = true
            this.inputsWidgets.push(w)
            this.inputNodes.push(w.container)
            this.value[k] = []
        }

        var outputs = DOM.get(this.widget, '.outputs')[0]
        for (let k in this.outputs) {
            var node = html`
                <div class="widget patchbaynode-container">
                    <label>${k}</label>
                </div>
            `
            outputs.appendChild(node)
            this.outputNodes.push(node)
        }


        this.connecting = []

        this.on('fast-click', (e)=>{
            this.toggleConnection(e.target)
            e.stopPropagation()
        }, {element: this.widget})


        this.mousePosition = []
        this.on('drag', (e)=>{
            if (!this.connecting.length) {
                this.toggleConnection(e.target)
            }
            if (e.target === this.canvas) {
                this.mousePosition = [e.offsetX, e.offsetY]
            } else if (this.mousePosition.length) {
                this.mousePosition[0] += e.movementX
                this.mousePosition[1] += e.movementY
            }
            this.batchDraw()
        }, {element: this.widget})
        this.on('dragend', (e)=>{
            if (this.mousePosition.length) {
                this.mousePosition = []
                this.toggleConnection(e.target)
            }
        }, {element: this.widget})


        this.on('value-changed',(e)=>{

            if (e.widget === this || e.widget.parent !== this) return

            var k  = e.widget.getProp('label')
            this.value[k] = e.widget.getValue()

            this.changed(e.options)

        })

    }

    toggleConnection(node) {

        var input = this.inputNodes.indexOf(node),
            output = this.outputNodes.indexOf(node)

        if (input > -1 && input !== this.connecting[0]) {
            this.connecting[0] = input
        } else if (output > -1 && output !== this.connecting[1]) {
            this.connecting[1] = output
        } else {
            this.connecting = []
        }

        if (this.connecting[0] !== undefined && this.connecting[1] !== undefined) {
            this.inputsWidgets[this.connecting[0]].toggleValue(this.outputsValues[this.connecting[1]])
            this.connecting = []
        } else {
            this.batchDraw()
        }

    }

    draw() {

        this.clear()

        var x1 = 0,
            x2 = this.width,
            y1, y2,
            connections,
            i, j

        var lines = [],
            strongLines = []

        for (i = 0; i < this.inputsWidgets.length; i++) {

            connections = this.inputsWidgets[i].getValue()

            if (connections.length) {

                y1 = this.height / this.inputsValues.length * (i + 0.5)

                for (j = 0; j < connections.length; j++) {

                    if (this.outputsValues.indexOf(connections[j]) > -1) {

                        y2 = this.height / this.outputsValues.length * (this.outputsValues.indexOf(connections[j]) + 0.5)

                        var line = [[x1, y1], [this.width / 2, y1, this.width / 2, y2 ,x2, y2]]

                        if (this.connecting[0] === i || this.connecting[1] === this.outputsValues.indexOf(connections[j])) {
                            strongLines.push(line)
                        } else {
                            lines.push(line)
                        }

                    }

                }


            }

        }

        if (this.connecting.length) {

            this.ctx.beginPath()
            this.ctx.fillStyle = this.cssVars.colorFill
            this.ctx.globalAlpha = this.cssVars.alphaFillOn

            var side = this.connecting[0] !== undefined ? 0 : 1,
                cx = side === 0 ? 0 : this.width,
                cy = this.height / (side === 0 ? this.inputsValues : this.outputsValues).length * (this.connecting[side] + 0.5)

            this.ctx.arc(cx, cy, 8 * PXSCALE, Math.PI * 2, false)
            this.ctx.fill()
            strongLines.push(null)


            if (this.mousePosition.length) {
                var [x3, y3] = this.mousePosition,
                    centerx = Math.abs(cx - x3) / 2,
                    bz1 = side ? cx - centerx : cx + centerx,
                    bz2 = side ? x3 + centerx : x3 - centerx

                strongLines.push([[cx, cy], [bz1, cy, bz2, y3 ,x3, y3]])

            }

        }


        this.ctx.strokeStyle = this.cssVars.colorFill
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.globalAlpha = strongLines.length ? this.cssVars.alphaFillOff : this.cssVars.alphaFillOn

        this.ctx.beginPath()
        for (i in lines) {
            this.ctx.moveTo(...lines[i][0])
            this.ctx.bezierCurveTo(...lines[i][1])
        }
        this.ctx.stroke()

        if (strongLines.length) {

            this.ctx.globalAlpha = this.cssVars.alphaFillOn
            this.ctx.beginPath()
            for (i in strongLines) {
                if (strongLines[i] === null) continue
                this.ctx.moveTo(...strongLines[i][0])
                this.ctx.bezierCurveTo(...strongLines[i][1])
            }
            this.ctx.stroke()

        }


    }

}

export {
    PatchBay,
    PatchBayNode
}
