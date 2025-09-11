import Widget from '../common/widget'
import StaticProperties from '../mixins/static_properties'

export default class Variable extends StaticProperties(Widget, {interaction: false, visible: false}) {

    static description() {

        return 'Receives / stores a value, to be used in scripts (using the get function) or in properties (using the @{} syntax).'

    }

    static defaults() {

        return super.defaults().extend({
            widget: {
                visible: null,
                interaction: null
            },
            geometry: null,
            style: null,
        })

    }

    constructor(options) {

        super({...options, html: null})

    }


    setValue(v, options={}) {

        this.value = v

        if (options.sync) this.changed(options)
        if (options.send) this.sendValue(null, {syncOnly: true})

    }

}
