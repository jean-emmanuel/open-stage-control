import Panel from './panel.mjs'

class Folder extends Panel {

    static description() {

        return 'Flat container that doesn\'t affect layout. Mostly useful for grouping widgets in the tree.'

    }

    static defaults() {

        var defaults = super.defaults().extend({
            class_specific: {
                traversing: null
            },
            style: {

            },
            geometry: null,
            osc: null,
            scripting: null,
            value: null,
            children: {
                widgets: {type: 'array', value: [], help: 'Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously.'},
            }
        })

        defaults.style = {
            colorText: defaults.style.colorText,
            colorWidget: defaults.style.colorWidget,
            css: defaults.style.css,
        }

        return defaults

    }

    constructor(options) {

        super(options)

    }

    getProp(propName) {

        if (propName === 'layout') {
            return this.parent.getProp('layout')
        } else {
            return super.getProp(propName)
        }

    }


}



export default Folder
