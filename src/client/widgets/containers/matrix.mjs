import Panel from './panel.mjs'
import parser from '../../parser.mjs'
import {deepCopy} from '../../utils.mjs'
import Session from '../../managers/session/session.mjs'
import widgetManager from '../../managers/widgets.mjs'


class Matrix extends Panel {

    static description() {

        return 'Generic matrix for creating rows/columns of widgets.'

    }

    static defaults() {

        return super.defaults().extend({
            class_specific: {
                widgetType: {type: 'string', value: 'button', help: 'Defines the type of the widgets in the matrix'},
                quantity: {type: 'number', value: 4, help: 'Defines the number of widgets in the matrix'},
                props: {type: 'object', value: {label: '#{$}'}, editor: 'javascript', syntaxChecker: false, help: [
                    'Defines a set of property to override the widgets\' defaults.',
                    'JS{} and #{} blocks in this field are resolved with an extra variable representing each widget\'s index: `$` (e.g. `#{$}`)',
                    'Advanced syntax blocks (@{}, OSC{}, JS{}, VAR{} and #{}) are resolved at the matrix\' scope (ie @{this.variables} returns the matrix\' variables property)',
                    'Advanced syntax blocks can be passed to children without being resolved at the matrix\' scope by adding an underscore before the opening bracket.',
                    'Note: unless overridden, children inherit from the matrix\' `id` and osc properties (`id` and `address` are appended with `/$`)'
                ]},
            },
            style: {
                layout: {type: 'string', value: 'horizontal', choices: ['horizontal', 'vertical', 'grid'], help: 'Defines how children are laid out.'},
                tabsPosition: null,
            }
        })

    }

    constructor(options) {

        super(options)

        this.childrenType = undefined

        this.value = []

        this.resolveLock = false

        this.on('value-changed',(e)=>{

            if (e.widget === this) return

            var widget = this.getProp('widgetType') === 'clone' ? e.widget.parent : e.widget

            if (widget.parent !== this) return

            this.value[widget._index] = e.widget.getValue()

            this.changed({
                ...e.options,
                id: widget.getProp('id')
            })

        })

        if (parser.widgets[this.getProp('widgetType')]) {

            var quantity = Math.max(parseInt(this.getProp('quantity')) || 0, 0)

            for (let i = 0; i < quantity; i++) {

                var props = deepCopy(this.getProp('props')[i])
                var data = this.defaultProps(i)

                if (typeof props === 'object' && props !== null) {
                    Object.assign(data, props)
                }

                data = JSON.parse(JSON.stringify(data).replace(/(JS|#|OSC|@|VAR)_\{/g, '$1{'))

                Session.converters['1.13.2'].widget(data)

                var widget = parser.parse({
                    data: data,
                    parentNode: this.widget,
                    parent: this
                })

                widget._index = i
                widget.container.classList.add('not-editable')
                widget._not_editable = true

                this.value[i] = widget.getValue()

            }

        } else {

            this.errors.widgetType = this.getProp('widgetType') + ' is not a valid widget type'

        }



    }

    defaultProps(i) {

        return {
            type: this.getProp('widgetType'),
            id: '@{parent.id}/' + i,
            address: '#{@{parent.address} == "auto" ? "/" + @{parent.id} : @{parent.address}}/' + i,
            preArgs: '@{parent.preArgs}',
            target: '@{parent.target}',
            decimals: '@{parent.decimals}',
            bypass: '@{parent.bypass}',
            top: 'auto',
            left: 'auto',
            height: 'auto',
            width: 'auto'
        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'quantity':

                var quantity = Math.max(parseInt(this.getProp('quantity')) || 0, 0)
                oldPropValue = Math.max(parseInt(oldPropValue) || 0, 0)

                if (oldPropValue > quantity) {

                    for (let i = oldPropValue - 1; i >= quantity; i--) {
                        if (this.widget.contains(this.children[i].container)) {
                            this.widget.removeChild(this.children[i].container)
                        }
                        widgetManager.removeWidgets(this.children[i].getAllChildren().concat(this.children[i]))
                    }

                } else {

                    this.cachedProps.props = this.resolveProp('props', undefined, true)

                    for (let i = oldPropValue; i < quantity; i++) {

                        var props = deepCopy(this.getProp('props')[i])
                        var data = this.defaultProps(i)

                        if (typeof props === 'object' && props !== null) {
                            Object.assign(data, props)
                        }

                        data = JSON.parse(JSON.stringify(data).replace(/(JS|#|OSC|@|VAR)_\{/g, '$1{'))

                        Session.converters['1.13.2'].widget(data)

                        var widget = parser.parse({
                            data: data,
                            parentNode: this.widget,
                            parent: this
                        })

                        widget._index = i
                        widget.container.classList.add('not-editable')
                        widget._not_editable = true

                    }

                }


                return

            case 'props':

                for (let i = this.children.length - 1; i >= 0; i--) {

                    let data = deepCopy(this.getProp('props')[i])

                    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                        data = {}
                    }

                    data = JSON.parse(JSON.stringify(data).replace(/(JS|#|OSC|@|VAR)_\{/g, '$1{'))

                    Session.converters['1.13.2'].widget(data)

                    if (typeof oldPropValue[i] === 'object' && oldPropValue[i] !== null) {
                        // if an overridden default props is removed, set it back to default
                        let overriddenDefaults,
                            widgetDefaults
                        for (var k in oldPropValue[i]) {
                            if (data[k] === undefined) {
                                if (Matrix.overriddenDefaults.indexOf(k) !== -1) {
                                    overriddenDefaults = overriddenDefaults || this.defaultProps(i)
                                    data[k] = overriddenDefaults[k]
                                } else {
                                    widgetDefaults = widgetDefaults || parser.defaults[data.type || this.getProp('widgetType')]
                                    data[k] = deepCopy(widgetDefaults[k])
                                }
                            }
                        }
                    }

                    Object.assign(this.children[i].props, data)

                    this.children[i].updateProps(Object.keys(data), this, options)
                    // this.children[i] might have been recreated
                    this.children[i].container.classList.add('not-editable')
                    this.children[i]._not_editable = true

                }

                return

        }

    }

    resolveProp(propName, propValue, storeLinks, originalWidget, originalPropName, context) {

        if (propName === 'props' && !this.resolveLock) {

            this.resolveLock = true

            propValue = propValue !== undefined ? propValue : this.props[propName]

            var data = [],
                quantity = Math.max(parseInt(this.resolveProp('quantity', undefined, false, false, false)) || 0, 0)

            if (typeof propValue === 'object' && propValue !== null && !Array.isArray(propValue)) {
                for (let i = 0; i < quantity; i++) {
                    data[i] = {}
                    for (var k in propValue) {
                        data[i][k] = super.resolveProp(propName, deepCopy(propValue[k]), i === 0 ? storeLinks : false, originalWidget, originalPropName, {$: i})
                    }
                }

            } else {

                for (let i = 0; i < quantity; i++) {
                    data[i] = super.resolveProp(propName, deepCopy(propValue), i === 0 ? storeLinks : false, originalWidget, originalPropName, {$: i})
                }

            }


            this.resolveLock = false

            return data

        } else {

            return super.resolveProp(propName, propValue, storeLinks, originalWidget, originalPropName, context)

        }

    }
}



Matrix.overriddenDefaults = [
    'type', 'id', 'address', 'preArgs', 'target', 'decimals', 'bypass',
    'label', 'top', 'left', 'height', 'width'
]

Matrix.parsersContexts.props = {
    $: 0
}

Matrix.dynamicProps = Matrix.prototype.constructor.dynamicProps.concat(
    'quantity',
    'props'
)

export default Matrix
