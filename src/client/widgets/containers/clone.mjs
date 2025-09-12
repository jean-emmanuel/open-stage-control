import Container from '../common/container'
import widgetManager from '../../managers/widgets'
import * as resize from '../../events/resize'
import parser from '../../parser'
import {deepCopy, deepEqual} from '../../utils'
import {diff, diffToWidget} from '../../editor/diff'
import html from 'nanohtml/lib/browser'
import Session from '../../managers/session/session'

var excludedCloneClasses =  ['widget', 'absolute-position', 'not-editable', 'editing', 'flex-expand', 'no-interaction']

class Clone extends Container() {

    static description() {

        return 'Widget replication with overridable properties.'

    }

    static defaults() {

        var defaults = super.defaults().extend({

            class_specific: {
                widgetId: {type: 'string', value: '', help: '`id` of the widget to clone'},
                props: {type: 'object', value: {}, editor: 'javascript', syntaxChecker: false, help: 'Cloned widget\'s properties to override'},
            },
            value: null,
            osc: null,
            scripting: null
        })

        defaults.style = {css: defaults.style.css}

        return defaults

    }

    constructor(options) {

        options.props.address = 'auto'
        options.props.variables = '@{parent.variables}'

        super({...options, html: html`<div class="clone"></div>`})

        this.noValueState = true

        this.cloneLock = false
        this.cloneTarget = null
        this.cloneClass = []

        this.modalBreakout = 0

        this.container.classList.add('empty')

        var parent = this.parent
        while (parent !== widgetManager) {
            if (parent.getProp('id') === this.getProp('widgetId')) {
                this.errorProp('widgetId', 'circular reference', 'cannot create clone: target widget is a parent of this clone.')
                return
            }
            parent = parent.parent
        }

        this.bindTarget(this.getCloneTarget())
        if (this.cloneTarget) this.createClone(true)

        // global listener to catch cloneTarget's creation if no target is locked
        widgetManager.on('widget-created', (e)=>{

            if (this.cloneTarget) return

            var {id, widget} = e

            if (id === this.getProp('widgetId') && this.isValidCloneTarget(widget)) {

                var clone = this.children[0]

                this.unbindTarget()

                if (!clone) {

                    this.updateContainer(false)
                    this.bindTarget(widget)
                    this.createClone()

                } else {

                    this.bindTarget(widget)
                    this.updateClone()

                }

            }

        }, {context: this})

        var onPropChanged = (e)=>{
            // watch for prop changes initiated by the editor
            // Other changes (from advanced syntaxes) are already
            // handled by standard widget mechanicsé

            if (!this.cloneTarget) return
            if (!e.options || !e.options.fromEditor) return

            if (e.widget === this.cloneTarget || this.cloneTarget.contains(e.widget)) {

                this.updateClone(e.options)

            }

        }

        widgetManager.on('prop-changed', onPropChanged, {context: this})

        // see common/widget.js @ updateProps()
        widgetManager.on('prop-changed-maybe', onPropChanged, {context: this})

        this.on('widget-created', (e)=>{

            if (e.widget !== this) {
                e.widget.container.classList.add('not-editable')
                e.widget._not_editable = true
            }

        })

    }

    getCloneTarget() {

        // attempt to acquire a cloneTarget if 'widget-created' event has not been caught
        // (the target might have been created before the clone itself)

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
                                   .filter(el=>this.isValidCloneTarget(el))

        if (widgets.length === 0) return null
        if (widgets.length === 1) {
            return widgets[0]
        }

        // when duplicating clones pointing to an object with a static id,
        // each clone will recreate an object with the same id internally
        // we try to get the original one if there is more than 2 clone pointing to the same id (avoiding cloning the clone)

        function isCreatedByAClone(wi){
            var parent = wi.parent
            return parent && parent.getProp('type') === 'clone'
        }

        var target = widgets[0]
        for (var w of widgets) {
            if (!isCreatedByAClone(w)) {
                target = w
                break
            }
        }

        return target

    }

    isValidCloneTarget(widget) {

        return !(widget.contains(this) || this.contains(widget))

    }

    createClone(init) {

        if (this.cloneLock) return

        this.cloneLock = true

        var data = {...deepCopy(this.cloneTarget.props), ...this.getProp('props')}

        Session.converters['1.13.2'].widget(data)

        parser.parse({
            data: data,
            parentNode: this.widget,
            parent: this
        })

        this.updateContainer(!init)

        this.cloneLock = false

    }

    unbindTarget() {

        if (!this.cloneTarget) return

        this.cloneTarget.off(undefined, undefined, this)

        this.cloneTarget = null

    }

    bindTarget(target) {

        if (!target) return

        this.cloneTarget = target

        // listen for cloneTarget's deletion
        // if it is just edited, its recreation will be caught by the global 'widget-created' event handler
        this.cloneTarget.on('widget-removed', (e)=>{
            if (this.cloneTarget === e.widget) {
                this.unbindTarget()
            }
        }, {context: this})

        // listen for cloneTarget's content updates
        this.cloneTarget.on('widget-created', (e)=>{

            var {widget} = e,
                parent = widget.parent

            while (parent !== this.cloneTarget && parent !== widgetManager) {
                // if updated widget is in a nested clone, ignore it:
                // it will be handled by the nested clone that targets it
                if (parent.getProp('type') === 'clone') return
                parent = parent.parent
            }

            this.updateClone()

        }, {context: this})

    }

    updateClone(options) {

        if (this.cloneLock) return

        this.cloneLock = true

        var data = {...deepCopy(this.cloneTarget.props), ...this.getProp('props')},
            clone = this.children[0]

        Session.converters['1.13.2'].widget(data)

        var delta = diff.diff(clone.props, data) || {},
            [widget, patch] = diffToWidget(clone, delta),
            changedProps = Object.keys(patch)

        if (changedProps.length) {

            diff.patch(widget.props, patch)


            if (changedProps.some(x => !widget.isDynamicProp(x))) {

                clone.reCreateWidget({reuseChildren: false})
                this.updateContainer(false)

            } else {

                widget.updateProps(changedProps, this, options)
                this.updateContainer(true)

            }

        }



        this.cloneLock = false

    }

    updateContainer(checkResize) {


        if (this.cloneTarget) {

            var classes = [...this.cloneTarget.container.classList].filter(i=>excludedCloneClasses.indexOf(i) === -1)

            if (!deepEqual(classes, this.cloneClass)) {
                this.container.classList.remove(...this.cloneClass)
                this.cloneClass = classes
                this.container.classList.add(...this.cloneClass)
            }

            this.container.classList.remove('empty')

            for (var w of this.getAllChildren()) {
                w.container.classList.add('not-editable')
            }

            if (checkResize) resize.check(this.widget)

        } else if (this.cloneClass.length) {

            this.container.classList.remove(...this.cloneClass)
            this.container.classList.add('empty')
            this.cloneClass = []
            this.widget.innerHTML = ''
            widgetManager.removeWidgets(this.getAllChildren())

        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'widgetId':
                this.unbindTarget()
                this.updateContainer(false)
                this.bindTarget(this.getCloneTarget())
                if (this.cloneTarget) this.createClone()
                return
            case 'props':
                if (this.children[0]) this.updateClone()
                return

        }

    }

    onRemove(){

        this.unbindTarget()
        super.onRemove()

    }

}

Clone.dynamicProps = Clone.prototype.constructor.dynamicProps.concat(
    'widgetId',
    'props'
)

export default Clone
