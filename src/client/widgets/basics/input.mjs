import html from 'nanohtml'
import Canvas from '../common/canvas.mjs'
import {deepCopy} from '../../utils.mjs'

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
                noCanvas: {type: 'boolean', value: false, help: [
                    'Set to `true` to not a use a canvas for rendering the value when not focused.',
                    'Use this if the text renders blurry (less effecient when updating the value frequently).'
                ]},
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
        this.useCanvas = !this.getProp('noCanvas')

        if (this.getProp('vertical')) this.widget.classList.add('vertical')
        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')

        this.input = html`<input class="no-keybinding"></input>`

        if (!this.useCanvas) {
            this.widget.insertBefore(this.input, this.canvas)
        }

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

        if (this.getProp('interaction')) {

            if (this.useCanvas) {
                this.widget.setAttribute('tabindex', 0)
            }

            this.on('focus', this.focus.bind(this), {element: this.widget})
            this.on('blur', (e)=>{
                this.blur(true)
            }, {element: this.input})
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

        if (this.useCanvas) {
            this.widget.insertBefore(this.input, this.canvas)
            this.widget.setAttribute('tabindex','-1')
            this.input.value = this.stringValue
            this.input.focus()
        }


        setTimeout(()=>{
            this.input.select()
        })

    }

    blur(change=true) {

        if (!this.focused) return
        this.focused = false

        if (change) this.inputChange()

        if (this.useCanvas) {
            this.widget.removeChild(this.input)
            this.widget.setAttribute('tabindex','0')
        } else {
            this.input.blur()
        }
    }

    inputChange() {

        this.setValue(this.input.value, {sync:true, send:true})

    }


    cacheCanvasStyle(style){

        if (!this.useCanvas) return

        super.cacheCanvasStyle(style)

    }


    resizeHandle(event){

        if (!this.useCanvas) return

        super.resizeHandle(event)

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

        if (this.useCanvas) {
            this.batchDraw()
        } else {
            this.input.value = this.stringValue
        }

        if (options.send && !options.fromSync) this.sendValue()
        if (options.sync) this.changed(options)

    }

    draw() {

        if (!this.useCanvas) return

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


export default Input
