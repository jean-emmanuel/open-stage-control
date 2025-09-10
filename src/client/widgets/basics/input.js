var Canvas = require('../common/canvas'),
    {deepCopy} = require('../../utils'),
    html = require('nanohtml/lib/browser')

class Input extends Canvas {

    static description() {

        return 'Text input.'

    }

    static defaults() {

        return super.defaults().extend({
            style: {
                _separator_input_style: 'Input style',
                align: {type: 'string', value: 'center', choices: ['center', 'left', 'right'], help: 'Set to `left` or `right` to change text alignment (otherwise center)'},
                unit: {type: 'string', value: '', help: 'Unit will be appended to the displayed widget\'s value (it doesn\'t affect osc messages)'},
            },
            class_specific: {
                asYouType: {type: 'boolean', value: false, help: 'Set to `true` to make the input send its value at each keystroke'},
                numeric: {type: 'boolean|number', value: false, help: [
                    'Set to `true` to allow numeric values only and display a numeric keyboard on mobile devices',
                    'Can be a number to specify the stepping value for mousewheel interaction (only when the input is focused).']},
                validation: {type: 'string', value: '', help: [
                    'Regular expression: if the submitted value doesn\'t match the regular expression, it will be reset to the last valid value.',
                    'If leading and trailing slashes are omitted, they will be added automatically and the flag will be set to "gm"',
                    'Examples:',
                    '- `^[0-9]*$` accepts digits only, any number of them',
                    '- `/^[a-z\s]{0,10}$/i` accept between 0 and 10 alphabetic characters and spaces (case insensitive)',
                ]},
                maxLength: {type: 'number', value: '', help: ['Maximum number of characters allowed']}
            },
        })

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <canvas></canvas>
            </inner>
        `})

        this.value = ''
        this.stringValue = ''
        this.focused = false
        this.validation = null

        if (this.getProp('vertical')) this.widget.classList.add('vertical')
        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')


        if (this.getProp('interaction')) {

            this.widget.setAttribute('tabindex', 0)
            this.on('focus', this.focus.bind(this), {element: this.widget})
            this.input = html`<input class="no-keybinding"></input>`
            this.on('blur', (e)=>{
                this.blur(true)
            }, {element: this.input})

            if (this.getProp('numeric')) {
                this.input.type = 'number'
                this.input.pattern = '[0-9\.]*'
                this.input.inputMode = 'decimal'
                this.input.step = parseFloat(this.getProp('numeric')) || 1
            }

            if (this.getProp('maxLength') !== '') {
                this.maxLength = parseInt(this.getProp('maxLength'))
                this.input.maxLength = this.maxLength
            } else {
                this.maxLength = -1
            }

            var asYouType = this.getProp('asYouType')

            if (this.getProp('validation') !== '') {
                var validation = String(this.getProp('validation')),
                    flags = validation.match(/^\/.*\/.*$/) ? validation.split('/').pop() : 'gm',
                    regExpString = validation.match(/^\/.*\/.*$/) ? validation.replace(/^\/(.*)\/.*$/, '$1') : validation

                if (!regExpString.match(/^\^.*\$$/)) regExpString = '^' + regExpString + '$'

                this.validation = new RegExp(regExpString, flags)
            }

            this.input.addEventListener('keydown', (e)=>{
                if (e.key == 'Enter') this.blur()
                else if (e.key == 'Escape') this.blur(false)
                else if (asYouType) {
                    setTimeout(()=>{
                        this.inputChange()
                    })
                }
            })

        }

    }

    focus() {

        if (this.focused) return
        this.focused = true

        this.widget.setAttribute('tabindex','-1')
        this.input.value = this.stringValue
        this.widget.insertBefore(this.input, this.canvas)
        this.input.focus()
        if (!this.getProp('numeric')) this.input.setSelectionRange(0, this.input.value.length)

    }

    blur(change=true) {

        if (!this.focused) return
        this.focused = false

        if (change) this.inputChange()

        this.widget.setAttribute('tabindex','0')
        this.widget.removeChild(this.input)

    }

    inputChange() {

        this.setValue(this.input.value, {sync:true, send:true})

    }

    resizeHandle(event){

        // if (this.fontSize && event.height !== this.fontSize) {
        //     // little hack to prevent flex layout issues
        //     // alternate fix is to set css 'height: 100%;' on the canvas element
        //     // but it produces a big drawing context for just one line of text.
        //     event.height = this.fontSize
        // }

        super.resizeHandle(event)

        // if (this.getProp('vertical')){
        //
        //     var ratio = CANVAS_SCALING * this.scaling
        //
        //     this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        //     this.ctx.rotate(-Math.PI/2)
        //     this.ctx.translate(-this.height * ratio, 0)
        //
        //
        //     if (ratio != 1) this.ctx.scale(ratio, ratio)
        // }


    }

    setValue(v, options={} ) {

        if (this.validation && !this.getStringValue(v).match(this.validation)) {
            this.input.value = this.value
            return
        }

        if (this.maxLength !== -1 && this.getStringValue(v).length > this.maxLength) {
            v = this.getStringValue(v).substr(0, this.maxLength)
            this.input.value = v
        }

        try {
            this.value = JSON.parse(v)
        } catch (err) {
            this.value = v
        }

        if (this.value === '' || this.value === null) this.value = this.getProp('default')

        this.stringValue = this.getStringValue(this.value)

        this.batchDraw()

        if (options.send && !options.fromSync) this.sendValue()
        if (options.sync) this.changed(options)

    }

    draw() {

        var v = this.stringValue,
            width = this.width,
            height = this.height

        if (this.getProp('unit') && v.length) v += ' ' + this.getProp('unit')

        this.clear()

        this.ctx.fillStyle = this.cssVars.colorText

        // hack ?  prevent weird offset added for unknown reason when font size increases
        var offy = this.fontSize / 10

        if (this.textAlign == 'center') {
            this.ctx.fillText(v, Math.round(width/2), Math.round(height/2 + offy))
        } else if (this.textAlign == 'right') {
            this.ctx.fillText(v, width, Math.round(height/2 + offy))
        } else {
            this.ctx.fillText(v, 0, Math.round(height/2 + offy))
        }

        this.clearRect = [0, 0, width, height]

    }

    getStringValue(v) {
        if (v === undefined) return ''
        return typeof v != 'string' ?
            JSON.stringify(deepCopy(v, this.decimals)).replace(/,/g, ', ') :
            v
    }

}

Input.dynamicProps = Input.prototype.constructor.dynamicProps
    .filter(x=>x !== 'interaction')


module.exports = Input
