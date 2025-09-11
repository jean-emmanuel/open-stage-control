import UiWidget from './ui-widget'
import {categories} from '../widgets/'
import html from 'nanohtml/lib/browser'
import raw from 'nanohtml/raw'
import {icon} from '../ui/utils'
import chroma from 'chroma-js'

class UiInspectorField extends UiWidget {

    constructor(options) {

        super(options)

        this.name = options.name
        this.widget = options.widget
        this.value = options.value
        this.default = options.default

        this.container = html`<osc-inspector-field name="${this.name}"></osc-inspector-field>`
        this.label = this.container.appendChild(html`<label>${this.name}</label>`)

        if (this.name === 'type' || this.name === 'widgetType') this.createTypeSelect()
        else this.createInput()

    }

    createTypeSelect() {


        if (this.widget.props.type == 'tab' || this.widget.props.type == 'root') {
            this.container.appendChild(html`
                <textarea tabIndex="0" class="no-keybinding" name="${this.name}" rows="1" disabled>${this.value}</textarea>
            `)
            return
        }

        this.createInput()

        var select = html`<select tabIndex="-1" class="no-keybinding" name="${this.name}"/>`

        for (let cname in categories) {

            var optGroup = html`<optgroup label="${cname}"></optgroup>`

            for (let wtype of categories[cname]) {
                optGroup.appendChild(html`<option ${wtype == this.value ? 'selected' : ''} value="${wtype}">${wtype}</option>`)
            }

            select.appendChild(optGroup)

        }

        var wrapper = html`<osc-inspector-select></osc-inspector-select>`
        wrapper.appendChild(select)
        this.container.appendChild(wrapper)

    }

    createInput() {


        var stringValue = typeof this.value !== 'string' ?
                JSON.stringify(this.value, null, '  ').replace(/\n\s\s\s\s/g, ' ').replace(/\n\s\s(\}|\])/g, ' $1') : this.value


        let input = html`<textarea tabIndex="0" class="no-keybinding" name="${this.name}" rows="${stringValue.split('\n').length}"></textarea>`

        if (this.name === 'id' && this.widget.props.type === 'root') input.disabled = true

        if (this.default.value === 'auto' && stringValue === 'auto') {
            input.placeholder = stringValue
        } else {
            input.textContent = stringValue
        }

        this.container.appendChild(input)


        if (this.default.choices) {

            let wrapper = html`<osc-inspector-select></osc-inspector-select>`,
                select = wrapper.appendChild(html`<select tabIndex="-1" class="no-keybinding" name="${this.name}"/>`)
            for (let choice of this.default.choices) {
                select.appendChild(html`<option ${choice == this.value ? 'selected' : ''} value="${choice}">${choice}</option>`)
            }

            this.container.appendChild(wrapper)

        }

        if (this.default.type.includes('boolean')) {

            let toggle = html`
               <osc-inspector-checkbox name="${this.name}" class="${this.widget.getProp(this.name) ? 'on' : ''}">
                   ${raw(icon('check'))}
               </osc-inspector-checkbox>
           `

            this.container.appendChild(toggle)

        }

        if (this.name.includes('color')) {

            let style = window.getComputedStyle(this.widget.container),
                colorData = this.widget.constructor.cssVariables.find(x=>x.js === this.name),
                val = 'transparent'

            try {
                val = chroma(style.getPropertyValue(colorData.css).trim()).hex('rgba')
            } catch(e) {}
            this.container.appendChild(html`
                <osc-inspector-color type="text" name="${this.name}" value="${val}" style="--color-picker-value: ${val}"></osc-inspector-color>
            `)


        } else if (stringValue === 'auto' && this.widget.constructor.cssVariables.some(x=>x.js === this.name)) {

            let style = window.getComputedStyle(this.widget.container),
                data = this.widget.constructor.cssVariables.find(x=>x.js === this.name),
                val = style.getPropertyValue(data.css).trim()

            if (data.toJs) val = data.toJs(val)
            this.container.appendChild(html`
                <div class="computed-value">${val}</div>
            `)



        }

    }


}

export default UiInspectorField
