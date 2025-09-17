import Panel from './panel.mjs'
import * as resize from '../../events/resize.mjs'
import {iconify} from '../../ui/utils.mjs'

class Tab extends Panel {

    static description() {

        return 'Tabbed panel widget.mjs'

    }

    static defaults() {

        return super.defaults().extend({
            geometry: null,
            style: {
                _separator_tab_style: 'Tab style',
                label: {type: 'string|boolean', value: 'auto', help: [
                    'Set to `false` to hide completely',
                    '- Insert icons using the prefix ^ followed by the icon\'s name : `^play`, `^pause`, etc (see https://fontawesome.com/icons?d=gallery&s=solid&m=free)',
                    '- Icons can be transformed with the following suffixes: `.flip-[horizontal|vertical|both]`, `.rotate-[90|180|270]`, `.spin`, `.pulse`. Example: `^play.flip-horizontal`',
                ]},
                colorStroke: null,
                alphaStroke: null,
                alphaFillOff: null,
                alphaFillOn: null,
                lineWidth: null
            }
        })

    }

    constructor(options) {

        super(options)

        this.container.classList.add('show')

        this.detached = false

        this.label = ''
        this.updateLabel()

    }

    updateLabel() {

        if (this.getProp('label') === false) {
            this.label = ''
        } else {
            this.label = this.getProp('label') == 'auto'?
                    this.getProp('id'):
                    iconify(String(this.getProp('label')).replace(/</g, '&lt;'))
        }

    }

    hide() {
        if (this.detached) return
        this.container.classList.remove('show')
        this.container.removeChild(this.widget)
        this.detached = true
        this.setVisibility()
    }

    show() {
        if (!this.detached) return
        this.container.classList.add('show')
        this.container.appendChild(this.widget)
        this.detached = false
        this.setVisibility()
        resize.check(this.widget, true)
    }

    isVisible() {

        return !this.detached && super.isVisible()

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'label':
                this.updateLabel()
                // falls through
            case 'visible':
                resize.check(this.widget, true)
                // falls through
            case 'colorText':
            case 'colorWidget':
            case 'colorFill':
            case 'colorStroke':
            case 'alphaStroke':
            case 'alphaFillOff':
            case 'alphaFillOn':
                if (this.parent.createNavigation) this.parent.createNavigation()
                return

        }

    }

}

Tab.dynamicProps = Tab.prototype.constructor.dynamicProps.concat(
    'label'
)

export default Tab
