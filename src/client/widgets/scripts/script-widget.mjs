import Widget from '../common/widget.mjs'
import keyboardJS from 'keyboardjs/dist/keyboard.min.js'
import Script from './script.mjs'

class ScriptWidget extends Widget {

    static description() {

        return 'Scripting widget utility with keyboard bindings.mjs'

    }

    static defaults() {

        var defaults = super.defaults()
        delete defaults.widget.visible
        delete defaults.widget.interaction
        delete defaults.geometry
        delete defaults.style
        defaults.scripting = {
            onCreate: {type: 'script', value: '', editor: 'javascript', help: ['Script executed when the widget is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
            onValue: {type: 'script', value: '', editor: 'javascript', help: ['Script executed when the widget\'s value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
            onKeyboard: {type: 'script', value: '', editor:'javascript', help: 'Script executed whenever the widget receives a keyboard event if `keyBinding` is set). See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.'},

            _separator: 'Keyboard events',

            keyBinding: {type: 'string|array', value: '', help: [
                'Key combo `string` or `array` of strings (see <a href="https://github.com/RobertWHurst/KeyboardJS">KeyboardJS</a> documentation).',
                'If the editor is enabled, some keys / combos will not work.',
                'To process all keystroke events, write `[\'\']`'
            ]},
            keyRepeat: {type: 'boolean', value: true, help: 'Set to `false` to prevent keydown repeats when holding the key combo pressed'},
            keyType: {type: 'string', value: 'keydown', choices: ['keydown', 'keyup', 'both'], help: 'Determines which key event trigger the script\'s execution'},

        }
        return defaults

    }

    constructor(options) {

        super({...options, html: null})

        this.noValueState = true


        if (this.getProp('onKeyboard') && this.getProp('keyBinding')) {

            this.keyCb = this.keyboardCallback.bind(this)

            keyboardJS.withContext('global', ()=>{

                keyboardJS.bind(this.getProp('keyBinding'), this.keyCb, this.keyCb)

            })

            this.scripts.onKeyboard = new Script({
                widget: this,
                property: 'onKeyboard',
                code: this.getProp('onKeyboard'),
                context: {
                    type: '',
                    key: '',
                    code: 0,
                    ctrl: false,
                    shift: false,
                    alt: false,
                    meta: false,
                }
            })

        }

    }

    setValue(v, options={}) {

        this.value = v

        if (options.sync) this.changed(options)

    }

    keyboardCallback(e) {

        if (e.catchedByEditor) return

        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return

        if (this.getProp('keyType') !== 'both' && e.type !== this.getProp('keyType')) return

        if (e.type === 'keydown' && !this.getProp('keyRepeat')) e.preventRepeat()

        if (e.preventDefault) e.preventDefault()

        this.scripts.onKeyboard.run({
            type: e.type,
            key: e.key,
            code: e.code,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            meta: e.metaKey
        }, {send: true, sync: true})

    }

    onRemove() {


        if (this.getProp('onKeyboard') && this.getProp('keyBinding')) {

            keyboardJS.withContext('global', ()=>{

                keyboardJS.unbind(this.getProp('keyBinding'), this.keyCb, this.keyCb)

            })

        }

        super.onRemove()

    }

}

export default ScriptWidget
