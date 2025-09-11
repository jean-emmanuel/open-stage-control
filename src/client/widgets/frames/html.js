import Widget from '../common/widget'
import morph from 'nanomorph'
import html from 'nanohtml/lib/browser'
import StaticProperties from '../mixins/static_properties'

class Html extends StaticProperties(Widget, {bypass: true}) {

    static description() {

        return 'Simple HTML parser.'

    }


    static defaults() {

        return super.defaults().extend({
            osc: {
                decimals: null,
                typeTags: null,
                bypass: null,
                ignoreDefaults: null
            }
        })

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <div class="frame html"></div>
            </inner>
        `})

        this.noValueState = true

        if (!this.getProp('border')) this.container.classList.add('noborder')
        this.frame = DOM.get(this.widget, '.frame')[0]

        if (this.getProp('html') !== '') this.updateHtmlLegacy()

    }

    updateHtml(){}

    updateHtmlLegacy(){

        var newHtml = this.frame.cloneNode(false)

        newHtml.innerHTML = this.getProp('html')

        morph(this.frame, newHtml)

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'html':
                this.updateHtmlLegacy()
                return

        }

    }


}

export default Html
