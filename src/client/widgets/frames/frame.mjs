import Widget from '../common/widget'
import html from 'nanohtml/lib/browser'
import locales from '../../locales'
import StaticProperties from '../mixins/static_properties'

class Frame extends StaticProperties(Widget, {bypass: true}) {

    static description() {

        return 'Embed a web page in a frame. Note: some websites do not allow this.'

    }

    static defaults() {

        return super.defaults().extend({
            class_specific: {
                allow: {type: 'string', value: '', help: [
                    'Content for the iframe element\'s <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/allow">allow</a> attribute',
                ]},
            },
            value: {
                value: {type: 'string', value: '', help: [
                    'External web page URL.',
                ]}
            },
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
                <iframe class="frame" src="" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
            </inner>`
        })

        if (!this.getProp('border')) this.container.classList.add('noborder')

        this.frame = DOM.get(this.widget, '.frame')[0]

        if (this.getProp('allow')) this.frame.setAttribute('allow', this.getProp('allow'))

        this.errorText = html`<span>${locales('iframe_unauthorized')}<span>`
        this.errorTextMounted = false


    }

    setValue(v, options={}) {

        this.value = v

        if (this.value) {
            this.frame.setAttribute('src', this.value)
            this.widget.classList.remove('error')
            if (this.errorTextMounted) {
                this.widget.removeChild(this.errorText)
                this.errorTextMounted = false
            }
        } else {
            this.frame.setAttribute('src', '')
            this.widget.classList.add('error')
            this.widget.appendChild(this.errorText)
            this.errorTextMounted = true
        }

        if (options.sync) this.changed(options)

    }


}

export default Frame
