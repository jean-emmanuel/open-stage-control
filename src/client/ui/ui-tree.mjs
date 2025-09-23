import UiWidget from './ui-widget'
import html from 'nanohtml'
import doubleClick from '../events/double-click'
import Sortable from 'sortablejs'
import morph from 'nanomorph'
import locales from '../locales'
import raw from 'nanohtml/raw'
import {icon} from './utils.mjs'
import {widgets, categories} from '../widgets/index.mjs'
import {DOM} from '../globals.mjs'

var Root, Panel, Matrix, Keyboard, widgetManager
;(async()=>{
    Root = (await import('../widgets/containers/root.mjs')).default
    Panel = (await import('../widgets/containers/panel.mjs')).default
    Matrix = (await import('../widgets/containers/matrix.mjs')).default
    Keyboard = (await import('../widgets/containers/keyboard.mjs')).default
    widgetManager = (await import('../managers/widgets.mjs')).default
})()


var widgetIcons = {
    root: 'bookmark',
    tab: 'window-maximize',
    folder: 'folder',
    menu: 'list',
    dropdown: 'list',
    switch: 'list',
    input: 'i-cursor',
    file: 'file-import',
    modal: 'window-restore',
    clone: 'cube',
    fragment: 'cube',
    patchbay: 'project-diagram',
    frame: 'globe'

}

var categoryIcons = {
    'Basics': 'toggle-on',
    'Containers': 'table-list',
    'Frames': 'images',
    'Graphs': 'chart-area',
    'Indicators': 'info-circle',
    'Pads': 'crosshairs',
    'Sliders': 'sliders-h.rotate-90',
    'Scripts': 'code',
}

for (var type in widgets) {
    if (widgetIcons[type]) continue
    for (var cat in categoryIcons) {
        if (categories[cat].includes(type)) {
            widgetIcons[type] = categoryIcons[cat]
        }
    }
}


class UiTree extends UiWidget {

    constructor(options) {

        super(options)

        this.mounted = false
        this.fragment = this.container.appendChild(html`<div class="fragment-mode-warning" title="${locales('fragment_mode_explanation')}">${locales('fragment_mode_warning')}</div>`)
        this.filter = this.container.appendChild(html`<input class="filter" type="text" placeholder="${locales('tree_filter')}..."/>`)
        this.wrapper = this.container.appendChild(html`<div class="tree"></div>`)
        this.list = this.wrapper.appendChild(html`<ol style="--depth: 1"></ol`)
        this.dragDummy = html`<span></span>`
        this.deferredUpdateTimeout = null


        this.expanded = {}
        this.init = false

        this.container.addEventListener('fast-click', (event)=>{

            var node = event.target
            if (node.classList.contains('toggle')) {
                var exp = node.parentNode.classList.toggle('expanded')
                if (exp) {
                    this.expanded[node.parentNode.getAttribute('data-widget')] = true
                } else {
                    delete this.expanded[node.parentNode.getAttribute('data-widget')]
                }
            }


        })

        doubleClick(this.container, (event)=>{

            var node = event.target
            if (node.classList.contains('container')) {
                var exp = node.classList.toggle('expanded')
                if (exp) {
                    this.expanded[node.getAttribute('data-widget')] = true
                } else {
                    delete this.expanded[node.getAttribute('data-widget')]
                }
            }

        }, {ignoreEditorCapture: true})


        this.sortables = []
        this.sortCallback = (event)=>{

            var from = widgetManager.widgets[event.from.getAttribute('data-hash')],
                to = widgetManager.widgets[event.to.getAttribute('data-hash')]

            if (!to || (from === to && event.oldIndex === event.newIndex)) return

            this.trigger('sorted', {
                oldIndex: event.oldIndex,
                newIndex: event.newIndex,
                from: from,
                to: to
            })

        }

        this.filter.addEventListener('change', ()=>{
            this.applyFilter()
        })
        var filterTypeTimeout = null
        this.filter.addEventListener('keydown', ()=>{
            clearTimeout(filterTypeTimeout)
            filterTypeTimeout = setTimeout(()=>{
                this.applyFilter()
            }, 100)
        })

    }

    clear() {

        this.list.innerHTML = ''
        this.init = false
        this.mounted = false
        for (var s of this.sortables) {
            s.destroy()
        }
        this.sortables = []

    }

    updateTree(selectedWidgets) {

        if (this.parent.minimized || this.parent.disabled) {
            clearTimeout(this.deferredUpdateTimeout)
            this.deferredUpdateTimeout = setTimeout(()=>{
                this.deferredUpdateTree(selectedWidgets)
            })
        } else {
            this.deferredUpdateTree(selectedWidgets)
        }

    }

    deferredUpdateTree(selectedWidgets) {

        this.deferredUpdateTimeout = null

        for (var s of this.sortables) {
            s.destroy()
        }
        this.sortables = []

        var content = this.parseWidgets(widgetManager.getWidgetById('root')[0], selectedWidgets)

        if (!content) return

        // morph DOM
        if (this.mounted) {
            morph(this.list.firstChild, content)
        } else {
            this.list.appendChild(content)
        }


        // sortable lists
        DOM.each(this.list, 'ol', (el)=>{
            let placeholder = null
            this.sortables.push(new Sortable(el, {
                group: {
                    name: 'group',
                    pull: (to, from)=>from.el.dataset.childrenType === to.el.dataset.childrenType || to.el.dataset.childrenType === '',
                    put: (to, from)=>from.el.dataset.childrenType === to.el.dataset.childrenType || to.el.dataset.childrenType === '',
                },
                onEnd: (e)=>{
                    e.from.removeChild(placeholder)
                    placeholder = null
                    if (e.from === e.to && e.newIndex > e.oldIndex) e.newIndex--
                    this.sortCallback(e)
                },
                setData: (dataTransfer)=>{
                    dataTransfer.setDragImage(this.dragDummy, 0, 0)
                },
                onStart: (event)=>{
                    placeholder = event.from.insertBefore(event.clone.cloneNode(true), event.from.childNodes[event.oldIndex])
                    placeholder.style.display = 'block'
                },
            }))
        })

        this.mounted = true
        this.applyFilter()

    }

    showWidget(widget) {

        var node = DOM.get(this.list, `[data-widget="${widget.hash}"]`)
        if (node) {
            node = node[0]
            var parent = node.parentNode
            while (parent !== this.list) {
                if (parent.classList.contains('container')) {
                    parent.classList.add('expanded')
                    this.expanded[parent.getAttribute('data-widget')] = true
                }
                parent = parent.parentNode
            }
            var nodeRect = node.classList.contains('container') ? node.firstChild.getBoundingClientRect() : node.getBoundingClientRect(),
                treeRect = this.wrapper.getBoundingClientRect()

            if (nodeRect.top < treeRect.top) {
                node.scrollIntoView({block: 'start'});
            } else if (nodeRect.bottom > treeRect.bottom) {
                node.scrollIntoView({block: 'nearest'});
            }
            this.wrapper.scrollLeft = (node.depth - 1) * 20
        }

        if (this.parent.minimized) this.parent.restore()

    }

    blinkSelected() {

        DOM.each(this.list, '.editing', (el)=>{
            el.classList.add('editor-blink')
            this.wrapper.scrollLeft = (el.depth - 1) * 20
            setTimeout(()=>{
                el.classList.remove('editor-blink')
            }, 800)
        })

    }

    showWidgetInSession(widget) {

        var parent = widget
        while (parent !== widgetManager) {
            if (parent.getProp('type') === 'tab') parent.parent.setValue(parent.parent.children.indexOf(parent), {sync: true, send: true})
            else if (parent.getProp('type') === 'modal') parent.setValue(1, {sync: true, send: true})
            parent = parent.parent
        }
        widget.container.classList.add('editor-blink')
        widget.container.scrollIntoView({block: 'center'})
        setTimeout(()=>{
            widget.container.classList.remove('editor-blink')
        }, 800)

    }

    select() {

        // hint selection in folded containers
        DOM.each(this.list, '.contains-editing', (element)=>{
            element.classList.remove('contains-editing')
        })
        var selected = DOM.get(this.list, '.editing')[0]
        if (selected) {
            var node = selected.parentNode
            while (node && node !== this.list) {
                if (node.classList.contains('container')) {
                    node.classList.add('contains-editing')
                }
                node = node.parentNode
            }
        }
    }

    parseWidgets(widget, selectedWidgets, depth = 1) {

        if (!widget) return

        var selected = selectedWidgets.includes(widget),
            id = widget.getProp('id'),
            node = html`<li class="${selected ? 'editing' : ''} ${!widget.getProp('visible') ? 'invisible' : ''}"
                            data-widget="${widget.hash}" data-type="${widget.getProp('type')}">
                        ${raw(icon(widgetIcons[widget.getProp('type')] || 'root'))}${id}${widget.getProp('lock')? raw(icon('lock')) :''}</li>`


        node.depth = depth

        if (widget instanceof Panel && !(widget instanceof Matrix || widget instanceof Keyboard)) {
            node.insertBefore(html`<span class="toggle no-widget-select"></span>`, node.childNodes[0])
            node.classList.add('container')
            if (this.expanded[widget.hash]) node.classList.add('expanded')
            if (!this.init && widget instanceof Root) {
                node.classList.add('expanded')
                this.expanded[widget.hash] = true
                this.init = true
            }
            var sublist = node.appendChild(html`<ol data-hash="${widget.hash}" data-children-type="${widget.childrenType}" style="--depth:${++depth};"></ol>`)
            for (let child of widget.children) {
                if (child) sublist.appendChild(this.parseWidgets(child, selectedWidgets, depth))
            }

        }

        for (var h in this.expanded) {
            if (!widgetManager.widgets[h]) delete this.expanded[h]
        }

        return node

    }

    applyFilter() {

        var filter = this.filter.value.replace(/type\:[^\s]+/g, '').trim(),
            types = this.filter.value.match(/type\:([^\s]+)/g)

        if (types) types = types.map(x=>x.split(':')[1])

        if (!filter && !types) {
            this.list.classList.remove('filter-active')
        } else {
            this.list.classList.add('filter-active')

            var show = []
            DOM.each(this.list, 'li', (element)=>{
                var match = element.innerText.includes(filter)
                if (types && !types.includes(element.dataset.type)) match = false
                element.classList.toggle('filter-hide', !match)
                if (match) show.push(element)
            })

            DOM.each(this.list, '.container.filter-hide', (element)=>{
                if (show.some(el=>element.contains(el))) element.classList.remove('filter-hide')
            })

        }

    }

    updateVisibility(widget) {

        if (!this.parent.disabled) {

            var w = DOM.get(this.list, '[data-widget="' + widget.hash + '"]')[0]

            if (w) {
                w.classList.toggle('invisible', !widget.getProp('visible'))
            }

        }

    }

}

export default UiTree
