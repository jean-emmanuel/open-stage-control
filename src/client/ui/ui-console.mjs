import html from 'nanohtml'
import raw from 'nanohtml/raw'
import UiSidePanel from './ui-sidepanel.mjs'
import locales from '../locales/index.mjs'
import {icon} from './utils.mjs'
import Script from '../widgets/scripts/script.mjs'
import Widget from '../widgets/common/widget.mjs'
import widgetManager from '../managers/widgets.mjs'

class UiConsole extends UiSidePanel {

    constructor(options) {

        super(options)

        this.header = DOM.get(this.container, 'osc-panel-header')[0]

        this.header.appendChild(html`<label>${locales('console')}</label>`)
        this.messages = this.content.appendChild(html`<osc-console></osc-console>`)

        this.inputWrapper = this.content.appendChild(html`<osc-console-input></osc-console-inpu>`)
        this.input = this.inputWrapper.appendChild(html`<textarea rows="1"></textarea>`)

        this.actions = this.header.appendChild(html`<div class="actions"></div>`)
        this.clearBtn = this.actions.appendChild(html`<div class="clear" title="${locales('console_clear')}">${raw(icon('trash'))}</div>`)
        this.clearBtn.addEventListener('click', ()=>{
            this.clear()
        })

        this.length = 0
        this.maxLength = ENV.consolelength || 300

        this.history = ['']
        this.cursor = 0


        var _this = this

        console._log = console.log
        console.log = function(message){
            for (let arg of arguments) {
                _this.log('log', arg)
            }
            console._log(...arguments)
        }

        console._error = console.error
        console.error = function(message){
            for (let arg of arguments) {
                _this.log('error', arg)
            }
            console._error(...arguments)
        }

        console._clear = console.clear
        console.clear = function(){
            _this.clear()
            console._clear()
        }

        this.widget = new Widget({props: {id: 'CONSOLE'}, parent: widgetManager})
        this.script = new Script({
            widget: this.widget,
            property: '',
            code: 'var navigator; return eval(input_code)',
            context: {input_code: ''}
        })
        this.widget._not_editable = true
        this.widget.hash = 'CONSOLE'

        this.input.addEventListener('keydown', (event)=>{
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                this.inputValidate()
            } else if (event.key == 'ArrowUp') {
                if (this.cursor < this.history.length - 1) {

                    if (this.input.value.substr(0, this.input.selectionStart).split('\n').length !== 1) return

                    this.cursor += 1
                    this.input.value = this.history[this.cursor]
                    event.preventDefault()
                }
            } else if (event.key == 'ArrowDown') {
                if (this.cursor > 0) {
                    var nLines = this.input.value.split('\n').length
                    if (this.input.value.substr(0, this.input.selectionStart).split('\n').length !== nLines) return

                    this.cursor -= 1
                    this.input.value = this.history[this.cursor]
                    event.preventDefault()
                }
            } else if (event.key == 'DOM_VK_TAB' && this.input.value !== '') {
                var cur = this.input.selectionStart,
                    val = this.input.value
                this.input.value = val.slice(0, cur) + '  ' + val.slice(cur)
                event.preventDefault()
            }

            this.inputSize()

        })

        this.input.addEventListener('input', (event)=>{
            this.inputSize()
        })

        if (!READ_ONLY) this.enable()

    }

    inputSize() {
        this.input.setAttribute('rows',0)
        this.input.setAttribute('rows', this.input.value.split('\n').length)
    }

    inputValidate() {

        if (this.input.value == '') return

        this.log('input', `${this.input.value}`)

        var returnValue = this.script.run({input_code: this.input.value}, {sync: true, send: true})
        if (returnValue === undefined) {
            this.log('output undefined', 'undefined')
        } else {
            this.log('output value', returnValue)
        }

        if (this.input.value !== this.history[1]) {
            this.history.splice(1, 0, this.input.value)
            if (this.history.length > 50) this.history.pop()
        }

        this.input.value = ''
        this.cursor = 0

    }

    log(type, message, as_html) {
        var msg =html`
            <osc-console-message class="${type}">

            </osc-console-message>
        `

        var node = this.messages.appendChild(msg)
        if (typeof message === 'object') {
            if (!(message instanceof Error)) {
                try {
                    message = JSON.stringify(message)
                } catch (_) {}
            } else {
                message = String(message) + message.stack
            }
        }

        if (as_html) {
            node.innerHTML = message
        } else {
            node.textContent = message
        }

        node.scrollIntoView()

        if (++this.length > this.maxLength) this.purge()


    }

    purge() {

        var children = [...this.messages.children]
        for (var i = 0; i < this.maxLength / 2; i++) {
            this.messages.removeChild(children[i])
        }
        this.length = this.maxLength / 2 + 1

    }

    clear() {

        this.messages.innerHTML = ''
        this.length = 0
        this.script.onRemove()

    }

}

export default new UiConsole({selector: '#osc-console', minSize: 40, size: 200, minimized: true})
