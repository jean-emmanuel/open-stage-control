import Panel from './panel'
import Widget from '../common/widget'
import parser from '../../parser'
import {mapToScale} from '../utils'


class Keyboard extends Panel {

    static description() {

        return 'Piano keyboard.'

    }

    static defaults() {

        return Widget.defaults().extend({
            style: {
                _separator_keyboard_style: 'Keyboard style',
                colorWhite: {type: 'string', value: 'auto', help: 'White keys color.'},
                colorBlack: {type: 'string', value: 'auto', help: 'Black keys color.'},
            },
            class_specific: {
                keys: {type: 'number', value: 25, help: 'Defines the number keys'},
                start: {type: 'number', value: 48, help: [
                    'MIDI note number to start with (default is C4)',
                    'Standard keyboards settings are: `[25, 48]`, `[49, 36]`, `[61, 36]`, `[88, 21]`'
                ]},
                traversing: {type: 'boolean', value: true, help: 'Set to `false` to disable traversing gestures'},
                on: {type: '*', value: 1, help: [
                    'Set to `null` to send send no argument in the osc message',
                ]},
                off: {type: '*', value: 0, help: [
                    'Set to `null` to send send no argument in the osc message',
                ]},
                velocity: {type: 'boolean', value: false, help: [
                    'Set to `true` to map the touch coordinates between `off` (top) and `on` (bottom). Requires `on` and `off` to be numbers',
                ]},
                mode: {type: 'string', value: 'push', choices: ['push', 'toggle', 'tap'], help: [
                    'Interaction mode:',
                    '- `push` (press & release)',
                    '- `toggle` (on/off switches)',
                    '- `tap` (no release)'
                ]},
            },
            value: {
                value: {type: 'array', value: '', help: [
                    'The keyboard widget accepts the following values:',
                    '- a `[note, value]` array to set the value of a single key where `note` is the note number and `value` depends on the `on` and `off` properties (any value different from `off` will be interpreted as `on`).',
                    '- an array of values with one item per key in the keyboard'
                ]}
            },
        })

    }

    constructor(options) {

        super(options)

        this.childrenType = undefined
        this.value = []
        this.keyHeight = 100

        this.on('resize', (e)=>{
            this.keyHeight = e.height
        }, {element: this.widget})


        this.on('value-changed',(e)=>{

            var widget = e.widget

            if (widget === this) return


            var value
            if (widget.getValue()) {
                if (this.getProp('velocity')) {
                    var height = widget._black ? this.keyHeight * 0.65 : this.keyHeight
                    value = mapToScale(e.options.y, [0, height * 0.9], [this.getProp('off'), this.getProp('on')], this.decimals)
                } else {
                    value = this.getProp('on')
                }
            } else {
                value = this.getProp('off')
            }

            this.value[widget._index] = value

            if (e.options.send) {
                var start = parseInt(this.getProp('start'))
                this.sendValue({
                    v: [e.widget._index + start, value]
                })
            }

            this.changed({
                ...e.options,
                id: widget.getProp('id')
            })


        })

        var start = parseInt(this.getProp('start')),
            keys = parseInt(this.getProp('keys'))

        var pattern = 'wbwbwwbwbwbw',
            whiteKeys = 0, whiteKeys2 = 0, i

        for (i = start; i < keys + start && i < 128; i++) {
            if (pattern[i % 12] == 'w') whiteKeys++
        }

        this.container.style.setProperty('--nkeys', whiteKeys)

        for (i = start; i < keys + start && i < 128; i++) {

            var data = {
                top: 'auto',
                left: 'auto',
                height: 'auto',
                width: 'auto',
                type: 'button',
                mode: this.getProp('mode'),
                id: this.getProp('id') + '/' + i,
                label: false,
                css: '',
                bypass: true,
                on: 1,
                off: 0,
            }

            var key = parser.parse({
                data: data,
                parentNode: this.widget,
                parent: this
            })

            key._index = i - start
            key.container.classList.add('not-editable')
            key._not_editable = true
            key.container.classList.add('key')

            if (pattern[i % 12] == 'w') {
                key.container.classList.add('white')
                whiteKeys2++
            } else {
                key.container.classList.add('black')
                key.container.style.setProperty('--rank', whiteKeys2)
                key._black = true
            }

            this.value[i - start] = this.getProp('off')

        }

    }

    setValue(v, options={}) {

        if (!Array.isArray(v)) return

        if (v.length === this.children.length) {
            for (var i = 0; i < this.children.length; i++){
                this.children[i].setValue(v[i] !== this.getProp('off') ? 1 : 0, options)
            }
        }

        else if (
            v.length === 2 &&
            v[0] >= parseInt(this.getProp('start')) && v[0] < 128
        ) {
            var index = v[0] - parseInt(this.getProp('start'))
            if (this.children[index]) {
                this.children[index].setValue(v[1] !== this.getProp('off') ? 1 : 0, options)
            }
        }

    }

}


Keyboard.dynamicProps = Keyboard.prototype.constructor.dynamicProps.concat(
    'on',
    'off',
)

Keyboard.cssVariables = Keyboard.prototype.constructor.cssVariables.concat(
    {js: 'colorWhite', css: '--color-white-key'},
    {js: 'colorBlack', css: '--color-black-key'}
)

export default Keyboard
