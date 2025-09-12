import morph from 'nanomorph'
import html from 'nanohtml'
import Widget from '../common/widget.mjs'
import StaticProperties from '../mixins/static_properties.mjs'


class Svg extends StaticProperties(Widget, {bypass: true}) {

    static description() {

        return 'Svg parser.'

    }

    static defaults() {

        return super.defaults().extend({
            class_specific: {
                svg: {type: 'string', value: '', help: [
                    'Svg xml definition (will be wrapped in a `< svg />` element)',
                ]},
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
                <svg class="frame"></svg>
            </inner>
        `})

        this.noValueState = true

        this.frame = DOM.get(this.widget, '.frame')[0]

        this.height = undefined
        this.width = undefined

        this.on('resize', this.resizeHandleProxy.bind(this), {element: this.widget})

        if (!this.getProp('border')) this.container.classList.add('noborder')

    }

    updateSvg(force){

        if (!this.width || !this.height) return

        var svg = this.getProp('svg')

        this.frame.setAttribute('width', this.width)
        this.frame .setAttribute('height', this.height)

        var node = this.frame.cloneNode(false)

        node.innerHTML = svg

        if (force) {
            this.frame.innerHTML = node.innerHTML
        } else {
            morph(this.frame, node)
        }

    }

    resizeHandleProxy() {

        this.resizeHandle(...arguments)

    }

    resizeHandle(event){

        var {width, height} = event

        this.height = height
        this.width = width

        this.updateSvg(true)

    }


    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'svg':
                this.updateSvg()
                return

        }

    }


}

Svg.dynamicProps = Svg.prototype.constructor.dynamicProps.concat(
    'svg'
)

export default Svg
