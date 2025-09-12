import html from 'nanohtml'
import raw from 'nanohtml/raw'
import MenuBase from './menu-base.mjs'
import {iconify} from '../../ui/utils'

class Switch extends MenuBase {

    static description() {

        return 'Value selector button.'

    }

    static defaults() {

        return super.defaults(Switch).extend({
            style: {
                _separator_switch_style: 'Switch style',
                colorTextOn: {type: 'string', value: 'auto', help: 'Defines the widget\'s text color when active.'},
                layout: {type: 'string', value: 'vertical', choices: ['vertical', 'horizontal', 'grid'], help:'Defines how items should be laid out'},
                gridTemplate: {type: 'string|number', value: '', help:'If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template".'},
                wrap: {type: 'boolean|string', value: false, choices: [false, true, 'soft'], help: [
                    'Set to `true` to wrap long lines automatically. Set to `soft` to avoid breaking words.',
                ]},
            },
            class_specific: {
                values: {type: 'array|object', value: {'Value 1':1,'Value 2':2}, help: [
                    '`Array` of possible values to switch between : `[1,2,3]`',
                    '`Object` of `"label":value` pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won\'t be kept',
                    '`{"labels": [], "values": []}` `object` where `labels` and `values` arrays must be of the same length. This syntax allows using the same label for different values.',
                ]},
                mode: {type: 'string', value: 'tap', choices: ['tap', 'slide', 'click', 'flip'], help: [
                    'Interaction mode:',
                    '- `tap`: activates when the pointer is down but prevents further scrolling',
                    '- `slide`: same as `tap` but allows sliding between values',
                    '- `click`: activates upon click only and allows further scrolling',
                    '- `flip`: selects the next value upon click regardless of where the widget is touched',
                ]},
            }
        })

    }

    constructor(options) {

        super({...options, html: html`<inner></inner>`})

        this.container.classList.add('layout-' + this.getProp('layout'))
        if (this.getProp('wrap')) this.container.classList.add('wrap')
        if (this.getProp('wrap') === 'soft') this.container.classList.add('wrap-soft')

        if (this.getProp('layout') === 'grid') {
            var template = this.getProp('gridTemplate') || 2
            this.widget.style.gridTemplate = template === parseInt(template) ? `none / repeat(${template}, 1fr)` : template
        }

        this.parseValues()


        var dragCallback = (e, slide)=>{

            var index = 0,
                node = e.target

            if (e.target === this.widget && e.traversing === true && e.firstTarget) {
                node = e.firstTarget
            }

            if (slide && e.isTouch) {
                // special traversing touch fix
                node = document.elementFromPoint(e.clientX, e.clientY)
            }

            if (node === this.widget || !this.widget.contains(node)) return

            while ((node = node.previousSibling)) {
                if (node.nodeType != 3) {
                    index++
                }
            }

            var value = this.values[index]

            if (slide && value === this.value) return

            this.setValue(value, {sync: true, send: true})

        }

        if (this.getProp('mode') === 'tap' || this.getProp('mode') === 'slide') {
            this.on('draginit', dragCallback , {element: this.widget})
            this.on('drag', (e)=>{
                if (this.getProp('mode') === 'slide' || e.traversing) dragCallback(e, true)
            } , {element: this.widget})
        } else if (this.getProp('mode') === 'click') {
            this.on('click', dragCallback, {element: this.widget})
        } else if (this.getProp('mode') === 'flip') {
            this.on('click', ()=>{
                var i = (this.getIndex(this.value) + 1) % this.values.length
                this.setValue(this.values[i], {sync: true, send: true})
            }, {element: this.widget})
        }

    }

    parseValues() {

        super.parseValues()

        for (var i = 0; i < this.values.length; i++) {

            this.widget.appendChild(html`
                <value>${raw(iconify(this.keys[i]))}</value>
            `)

        }

    }

    setValue(v, options={}) {

        var i = this.getIndex(v)

        this.value = this.values[i]

        DOM.each(this.widget, '.on', (el)=>{el.classList.remove('on')})

        if (i !== -1) {
            DOM.get(this.widget, 'value')[i].classList.add('on')
        }

        if (options.send) this.sendValue(this.value)
        if (options.sync) this.changed(options)

    }

    setCssVariables() {

        super.setCssVariables()

        this.container.classList.toggle('padding-0', this.getProp('padding') === -1)

    }
}

Switch.cssVariables = Switch.prototype.constructor.cssVariables.concat(
    {js: 'colorTextOn', css: '--color-text-on'}
)

export default Switch
