var MenuBase = require('./menu-base'),
    html = require('nanohtml'),
    iOS = require('../../ui/ios')

class Dropdown extends MenuBase {

    static description() {

        return 'Native dropdown menu.'

    }


    static defaults() {

        return super.defaults().extend({
            style: {
                _separator_dropdown_style: 'Dropdown style',
                label: {type: 'string|boolean', value: 'auto', help: 'Displayed text (defaults to current value). Keywords `%key` and `%value` will be replaced by the widget\'s selected key/value.'},
                icon: {type: 'boolean', value: 'true', help: 'Set to `false` to hide the dropdown icon'},
                align: {type: 'string', value: 'center', choices: ['center', 'left', 'right'], help: 'Set to `left` or `right` to change text alignment (otherwise center)'},
            },
            class_specific: {
                values: {type: 'array|object', value: {'Value 1':1,'Value 2':2}, help: [
                    '`Array` of possible values to switch between : `[1,2,3]`',
                    '`Object` of label:value pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won\'t be kept',
                    '`{"labels": [], "values": []}` `object` where `labels` and `values` arrays must be of the same length. This syntax allows using the same label for different values.',
                ]}
            }
        })

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <div class="text"></div>
            </inner>

        `})

        if (this.getProp('icon')) {
            this.widget.appendChild(html`<div class="icon"></div>`)
        } else {
            this.container.classList.add('no-icon')
        }

        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')

        this.select = this.widget.appendChild(html`<select class="no-keybinding"></select>`)
        this.text = DOM.get(this.widget, '.text')[0]

        this.parseValues()

        this.on('change', (e)=>{
            this.setValue(this.values[this.select.selectedIndex], {sync:true, send:true, fromLocal:true})
        }, {element: this.select})

        this.on('fast-click', (e)=>{
            // allow resubmitting same value
            this.select.selectedIndex = -1
        }, {element: this.select})


        this.select.selectedIndex = -1
        this.selected = -1
        this.container.classList.add('noselect')

    }

    parseValues() {

        super.parseValues()

        this.select.innerHTML = ''
        for (var i = 0; i < this.values.length; i++) {
            this.select.appendChild(html`
                <option value="${i}">
                    ${this.keys[i]}
                </option>
            `)
        }

        this.setValue(this.value)

    }

    setValue(v,options={}) {

        var i = this.getIndex(v)

        this.value = this.values[i]

        this.select.selectedIndex = i
        this.selected = i

        this.setLabel()

        if (document.activeElement === this.select && iOS) {
            // force menu close on ios
            this.select.blur()
        }

        for (var j = 0; j < this.select.options.length; j++) {
            this.select.options[j].classList.toggle('on', i === j)
        }

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    onPropChanged(propName, options, oldPropValue) {

        var ret = super.onPropChanged(...arguments)

        switch (propName) {

            case 'values':
                this.parseValues()
                this.setValue(this.value)
                return
            case 'label':
                this.setLabel()
                return
        }

        return ret

    }

}

Dropdown.dynamicProps = Dropdown.prototype.constructor.dynamicProps.concat(
    'values',
    'label'
)


module.exports = Dropdown
