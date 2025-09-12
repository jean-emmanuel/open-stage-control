import html from 'nanohtml'
import Widget from '../common/widget.mjs'

class TextArea extends Widget {

    static description() {

        return 'Text area (multi line input). Tip: hit shift + enter for new lines.'

    }

    static defaults() {

        return super.defaults().extend({
            style: {
                // _separator_input_style: 'Textarea style',
            },
            class_specific: {

            },
        })

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <textarea></textarea>
            </inner>
        `})

        this.value = ''
        this.stringValue = ''
        this.focused = false
        this.validation = null
        this.input = DOM.get(this.widget, 'textarea')[0]

        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')


        if (this.getProp('interaction')) {

            this.input.setAttribute('tabindex', 0)
            this.on('focus', this.onFocus.bind(this), {element: this.input})
            this.on('blur', (e)=>{
                this.blur(true)
            }, {element: this.input})

            this.input.addEventListener('keydown', (e)=>{
                if (e.key == 'Enter' && !e.shiftKey) {
                    // enter
                    e.preventDefault()
                    this.blur()
                }
                else if (e.key == 'Escape') {
                    // esc
                    this.blur(false)
                    this.input.value = this.value
                }
            })

        }

    }

    onFocus() {

        if (this.focused) return
        this.focused = true

    }

    focus() {

        this.input.focus()

    }

    blur(change=true) {

        if (!this.focused) return
        this.focused = false

        this.input.blur()

        if (change) this.inputChange()

    }

    inputChange() {

        this.setValue(this.input.value, {sync:true, send:true})

    }


    setValue(v, options={} ) {

        this.value = v === '' || v === null ? this.getProp('default') : String(v)

        if (this.value === '') this.value = this.getProp('default')

        if (this.input.value !== this.value) this.input.value = this.value

        if (options.send && !options.fromSync) this.sendValue()
        if (options.sync) this.changed(options)

    }

}

TextArea.dynamicProps = TextArea.prototype.constructor.dynamicProps
    .filter(x=>x !== 'interaction')


export default TextArea
