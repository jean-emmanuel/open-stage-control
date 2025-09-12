import keyboardJS from 'keyboardjs/dist/keyboard.min.js'
import {updateWidget, incrementWidget} from './data-workers.mjs'
import {diff, diffToWidget} from './diff.mjs'
import widgetManager from '../managers/widgets.mjs'
import {deepCopy} from '../utils.mjs'
import {defaults} from '../widgets/index.mjs'
import UiSelectArea from '../ui/ui-selectarea.mjs'
import UiInspector from '../ui/ui-inspector.mjs'
import UiTree from '../ui/ui-tree.mjs'
import UiDragResize from '../ui/ui-dragresize.mjs'
import uiConsole from '../ui/ui-console.mjs'
import notifications from '../ui/notifications.mjs'
import locales from '../locales/index.mjs'
import {leftUiSidePanel, rightUiSidePanel} from '../ui/index.mjs'
import ipc from '../ipc/index.mjs'

var sessionManager
;(async()=>{
    sessionManager = (await import('../managers/session/index.mjs')).default
    await import('./context-menu.mjs')
})()

const macOs = (navigator.platform || '').match('Mac')
const HISTORY_SIZE = 50

class Editor {

    constructor() {

        this.inspector = new UiInspector({selector: '#osc-inspector'})
        this.inspector.on('update', (event)=>{

            var {propName, value, preventHistory} = event,
                newWidgets = [],
                error = false

            if (this.selectedWidgets.some(w=>w.getProp('lock')) && propName !== 'lock') {
                this.select(this.selectedWidgets)
                return
            }

            for (var w of this.selectedWidgets) {

                let previousValue = w.props[propName]

                if ((propName === 'label' || propName === 'popupLabel') && value === true) {
                    w.props[propName] = 'auto'
                } else {
                    w.props[propName] = value !== '' ? value : deepCopy(defaults[w.props.type]._props()[propName])
                }

                try {

                    newWidgets.push(updateWidget(w, {changedProps: [propName], preventSelect: this.selectedWidgets.length > 1}))

                } catch (e) {

                    w.props[propName] = previousValue
                    updateWidget(w, {changedProps: [propName], preventSelect: this.selectedWidgets.length > 1})

                    if (uiConsole.minimized) notifications.add({
                        class: 'error',
                        message: locales('inspector_error'),
                        duration: 7000
                    })
                    console.error(
                        `Error while setting ${propName} to: ${JSON.stringify(value)}.\n` +
                        'It\'s probably a bug, please open a new bug ticket with the following informations at' +
                        'https://github.com/jean-emmanuel/open-stage-control/issues'
                    )
                    throw e
                    // console.error(e)
                    // error = true
                }
            }

            if (error) return

            if (!preventHistory) this.pushHistory()

            if (newWidgets.length > 1) this.select(newWidgets)

        })


        this.widgetTree = new UiTree({selector: '#osc-tree', parent: leftUiSidePanel})
        this.widgetTree.on('sorted', (event)=>{

            var {oldIndex, newIndex, from, to} = event,
                propName = from.childrenType + 's',
                container

            if (from === to) {

                if (to.props[propName].length < 2) return

                to.props[propName].splice(newIndex, 0, to.props[propName].splice(oldIndex, 1)[0])

                var indices = [newIndex, oldIndex]
                if (Math.abs(oldIndex - newIndex) > 1) {
                    for (var i = Math.min(newIndex, oldIndex) + 1; i < Math.max(newIndex, oldIndex); i++) {
                        indices.push(i)
                    }
                }

                container = updateWidget(to, {removedIndexes: indices, addedIndexes: indices, preventSelect: true})

                this.pushHistory({removedIndexes: indices, addedIndexes: indices})
                this.select(container.children[newIndex])

            } else {

                to.props[propName].splice(newIndex, 0, from.props[propName][oldIndex])
                from.props[propName].splice(oldIndex, 1)

                updateWidget(from, {removedIndexes: [oldIndex], preventSelect: true})
                container = updateWidget(to, {addedIndexes: [newIndex], preventSelect: true})

                this.pushHistory()
                this.select(container.children[newIndex])

            }

            if (!event.ignoreTree) this.widgetTree.showWidget(container.children[newIndex])


        })

        this.oscContainer = DOM.get('#osc-container')[0]



        this.widgetDragResize = new UiDragResize({})
        this.widgetDragResize.on('move', (e)=>{
            var left  =  Math.round(e.left / GRIDWIDTH) * GRIDWIDTH,
                top  =  Math.round(e.top / GRIDWIDTH) * GRIDWIDTH

            if (e.copying) {
                this.duplicateWidget(left, top, e.shiftKey)
            } else {
                var dX = left - e.initLeft,
                    dY = top - e.initTop
                this.moveWidget(dX, dY)
            }
        })
        this.widgetDragResize.on('drag-resize', (e)=>{
            var width  =  Math.round(e.width / GRIDWIDTH) * GRIDWIDTH,
                height  =  Math.round(e.height / GRIDWIDTH) * GRIDWIDTH
            var dX = width - e.initWidth,
                dY = height - e.initHeight
            this.resizeWidget(dX, dY)
        })

        this.selectedWidgets = []

        this.clipboard = null
        this.tmpClipboard = null
        this.idClipboard = null
        ipc.on('clipboard', (data)=>{
            this.clipboard = data.clipboard
            this.idClipboard = data.idClipboard
        })

        this.usePercents = !!ENV.usepercents

        this.enabled = false
        this.grid = true

        this.unsavedSession = false
        window.onbeforeunload = ()=>{
            if (editor.unsavedSession) return true
        }

        this.history = []
        this.historyState = -1
        this.historySession = null

        this.mousePosition = {}
        this.mouveMoveHandler = this.mouseMove.bind(this)
        this.mouveLeaveHandler = this.mouseLeave.bind(this)

        keyboardJS.withContext('editing', ()=>{

            var combos = [
                'mod + z',
                'mod + y',
                'mod + shift + z',
                'mod + c',
                'mod + x',
                'mod + v',
                'mod + shift + v',
                'mod + d',
                'mod + shift + d',
                macOs ? 'backspace' : 'delete',
                'alt + up',
                'alt + down',
                'alt + right',
                'alt + left',
                'up',
                'down',
                'right',
                'left',
                'mod + shift + a',
                'mod + a',
                'mod + up',
                'mod + down',
                'mod + left',
                'mod + right',
                'pageup',
                'pagedown',
                'home',
                'end',
                't',
                'y',
                'f2',
                'h',
                'mod + f'
            ]

            for (let c of combos) {
                keyboardJS.bind(c, (e)=>{
                    e.catchedByEditor = true
                    this.handleKeydown(c, e)
                }, (e)=>{
                    e.catchedByEditor = true
                    this.handleKeyup(c, e)
                })
            }

        })

        this.selectarea = new UiSelectArea('[data-widget]:not(.not-editable)', (elements, e)=>{

            var widgets = elements.map(e => widgetManager.getWidgetByElement(e, ':not(.not-editable)')).filter(e => e)

            if (e.ctrlKey) {

                // only add siblings to current selection

                for (var i in widgets) {
                    this.select(widgets[i], {multi:true, fromLasso:true, lassoEnd: i == widgets.length - 1})
                }

            } else {

                // select the largest group of siblings in area

                var groups = {}
                for (var w of widgets) {
                    var g = w.parent.hash
                    if (!g) continue
                    if (!groups[g]) groups[g] = []
                    if (!groups[g].includes(w)) groups[g].push(w)
                }

                groups = Object.values(groups)

                // if the event started from a container widget (but not in the project tree)
                // remove groups that are more than one level away from that container
                if (e.target.tagName !== 'LI' && this.selectedWidgets[0].childrenType !== undefined) {
                    groups = groups.filter(g=>g[0].parent === this.selectedWidgets[0] || g[0].parent === this.selectedWidgets[0].parent)
                }

                var lengths = groups.map(g=>g.length),
                    selection = groups[lengths.lastIndexOf(Math.max(...lengths))]

                if (selection) this.select(selection)
            }



        })


    }

    handleKeydown(combo, e){

        if (
            this.inspector.helpModalOpened ||
            e && e.target && e.target.tagName.match(/INPUT|TEXTAREA|SELECT/)
        ) return

        if (e) e.preventDefault()

        switch (combo) {

            case 'mod + z':
                this.undo()
                break

            case 'mod + y':
            case 'mod + shift + z':
                this.redo()
                break

            case 'mod + c':
                if (!window.getSelection().toString().length) this.copyWidget()
                break

            case 'mod + x':
                if (!window.getSelection().toString().length) this.cutWidget()
                break

            case 'mod + v':
                if (!window.getSelection().toString().length) this.pasteWidget(this.mousePosition.x, this.mousePosition.y, false)
                break

            case 'mod + shift + v':
                this.pasteWidget(this.mousePosition.x, this.mousePosition.y, true)
                break

            case 'mod + d':
                this.duplicateWidget(this.mousePosition.x, this.mousePosition.y, false)
                break

            case 'mod + shift + d':
                this.duplicateWidget(this.mousePosition.x, this.mousePosition.y, true)
                break

            case 'backspace':
            case 'delete':
                this.deleteWidget()
                break

            case 'alt + up':
            case 'alt + down':
            case 'alt + right':
            case 'alt + left':
                if (!this.selectedWidgets.length || this.selectedWidgets[0].parent === widgetManager) return

                if (this.selectedWidgets[0].props.height === undefined && e.key.match(/Arrow(Up|Down)/)) return
                if (this.selectedWidgets[0].props.width === undefined && e.key.match(/Arrow(Left|Right)/)) return

                var deltaW = e.key === 'ArrowLeft' ? -GRIDWIDTH : e.key === 'ArrowRight' ? GRIDWIDTH : 0,
                    deltaH = e.key === 'ArrowUp' ? -GRIDWIDTH : e.key === 'ArrowDown' ? GRIDWIDTH : 0

                if (e.shiftKey) {
                    deltaW *= 5
                    deltaH *= 5
                }

                this.resizeWidget(deltaW, deltaH)

                break

            case 'mod + up':
            case 'mod + down':
            case 'mod + right':
            case 'mod + left':
                if (!this.selectedWidgets.length) return

                if (this.selectedWidgets[0].props.top === undefined && e.key.match(/Arrow(Up|Down)/)) return
                if (this.selectedWidgets[0].props.left === undefined && e.key.match(/Arrow(Left|Right)/)) return

                var deltaX = e.key === 'ArrowLeft' ? -GRIDWIDTH : e.key === 'ArrowRight' ? GRIDWIDTH : 0,
                    deltaY = e.key === 'ArrowUp' ? -GRIDWIDTH : e.key === 'ArrowDown' ? GRIDWIDTH : 0

                if (e.shiftKey) {
                    deltaX *= 5
                    deltaY *= 5
                }

                this.moveWidget(deltaX, deltaY)

                break

            case 'mod + shift + a':
                if (!this.selectedWidgets.length) return
                this.unselect()
                this.selectedWidgets = []
                this.inspector.clear()
                break

            case 'mod + a':
                if (!this.selectedWidgets.length) return

                var curWidget1 = this.selectedWidgets[0]

                if (curWidget1.parent !== widgetManager) {
                    this.select([...curWidget1.parent.children])
                }
                break

            case 'up':
            case 'down':
            case 'right':
            case 'left':
                if (!this.selectedWidgets.length) return

                var curWidget = this.selectedWidgets[0],
                    toSelect = null

                if (e.key === 'ArrowLeft' && curWidget.parent !== widgetManager) {

                    toSelect = curWidget.parent

                } else if (e.key === 'ArrowRight') {

                    if (curWidget.children[0] && !curWidget.children[0]._not_editable) {
                        toSelect = curWidget.children[0]
                    }

                } else if((e.key == 'ArrowUp') || (e.key == 'ArrowDown')){

                    if (curWidget.parent === widgetManager) return

                    let toSelectList = [...curWidget.parent.children]

                    if (toSelectList && toSelectList.length) {
                        toSelectList.sort((a,b) => a.container.offsetLeft > b.container.offsetLeft)
                        var idx = toSelectList.indexOf(curWidget)
                        if (idx >= 0) {
                            var nextIdx = (idx + (e.key === 'ArrowUp' ? -1 : 1 ) + toSelectList.length) % toSelectList.length
                            toSelect = toSelectList[nextIdx]
                        }
                    }
                }

                if (toSelect) {
                    this.select(toSelect)
                }

                break

            case 'pagedown':
            case 'pageup':
            case 'home':
            case 'end':
                if (this.selectedWidgets.length !== 1 || this.selectedWidgets[0].parent.children.length <= 1) return

                var curWidget2 = this.selectedWidgets[0],
                    index = curWidget2.parent.children.indexOf(curWidget2),
                    maxIndex = curWidget2.parent.children.length - 1,
                    newIndex

                if (combo === 'pagedown') newIndex = Math.min(index + 1, maxIndex)
                else if (combo === 'pageup') newIndex = Math.max(index - 1, 0)
                else if (combo === 'end') newIndex = maxIndex
                else if (combo === 'home') newIndex = 0

                if (index !== newIndex) {
                    this.widgetTree.trigger('sorted', {
                        from: curWidget2.parent,
                        to: curWidget2.parent,
                        oldIndex: index,
                        newIndex: newIndex,
                        ignoreTree: true
                    })
                }
                break

            case 't':
                if (!this.selectedWidgets.length) return
                this.widgetTree.showWidget(editor.selectedWidgets[0])
                this.widgetTree.blinkSelected()
                break
            case 'y':
                if (!this.selectedWidgets.length) return
                for (let w of editor.selectedWidgets) {
                    this.widgetTree.showWidgetInSession(w)
                }
                this.widgetTree.showWidget(editor.selectedWidgets[0])
                break
            case 'f2':
                if (!this.selectedWidgets.length) return
                if (this.selectedWidgets[0].props.label === undefined && this.selectedWidgets[0].props.html === undefined) return
                if (!this.inspector.expandedCategories.includes('style')) {
                    var header = DOM.get(this.inspector.container, '.category-header[data-name="style"]')[0]
                    if (header) {
                        header.parentNode.classList.add('expanded')
                        this.inspector.expandedCategories.push('style')
                    }
                }
                var labelProp = this.selectedWidgets[0].props.label === undefined ? 'html' : 'label'
                var input = DOM.get(this.inspector.container, `textarea[name="${labelProp}"]`)[0]
                if (input) {
                    if (input._ace_input) {
                        input._ace_input.focus()
                    } else {
                        input.focus()
                        input.setSelectionRange(0, input.value.length)
                        input.scrollIntoView({block: 'center'})
                    }
                }
                break
            case 'h':
                document.body.classList.add('editor-hide-selection')
                break
            case 'mod + f':
                if (this.widgetTree.parent.minimized) this.widgetTree.parent.restore()
                this.widgetTree.filter.focus()
                break

        }


    }

    handleKeyup(combo, e){

        if (
            this.inspector.helpModalOpened ||
            (e && e.target && e.target.tagName && e.target.tagName.match(/INPUT|TEXTAREA|SELECT/))
        ) return

        if (e) e.preventDefault()

        switch (combo) {

            case 'h':
                document.body.classList.remove('editor-hide-selection')
                break

        }
    }

    toggleGrid() {

        this.grid = !this.grid

        GRIDWIDTH = this.grid ? GRIDWIDTH_CSS : 1

        document.body.style.setProperty('--grid-width', GRIDWIDTH)
        document.body.classList.toggle('no-grid', GRIDWIDTH == 1)

    }

    enable() {

        if (READ_ONLY || sessionManager.session === null) return

        this.enabled = true

        document.body.classList.add('editor-enabled')
        document.body.classList.remove('editor-disabled')

        this.widgetTree.updateTree(this.selectedWidgets)

        leftUiSidePanel.enable()
        rightUiSidePanel.enable()


        // keyboardJS hack: prevent releaseAllKeys when switching context
        var locale = keyboardJS._locale
        keyboardJS._locale = null
        keyboardJS.setContext('editing')
        keyboardJS._locale = locale

        this.oscContainer.addEventListener('mousemove', this.mouveMoveHandler)
        this.oscContainer.addEventListener('mouseleave', this.mouveLeaveHandler)

        this.selectarea.enable()

    }

    disable() {

        this.unselect()
        this.selectedWidgets = []

        document.body.classList.add('editor-disabled')
        document.body.classList.remove('editor-enabled')

        // keyboardJS hack: prevent releaseAllKeys when switching context
        var locale = keyboardJS._locale
        keyboardJS._locale = null
        keyboardJS.setContext('global')
        keyboardJS._locale = locale

        this.oscContainer.removeEventListener('mousemove', this.mouveMoveHandler)
        this.oscContainer.removeEventListener('mouseleave', this.mouveLeaveHandler)

        leftUiSidePanel.disable()
        rightUiSidePanel.disable()
        this.widgetTree.clear()
        this.inspector.clear()

        this.selectarea.disable()

        this.enabled = false

    }


    unselect() {

        this.widgetDragResize.clear()
        this.inspector.clear()

        DOM.each(document, '.editing', (element)=>{
            element.classList.remove('editing')
        })

        this.widgetTree.select([])

    }

    select(widget, options={}){

        if (!this.enabled) return

        if (Array.isArray(widget)) {

            this.selectedWidgets = widget

        } else if (options.multi) {

            var sameLevel = false

            while (!sameLevel && widget.parent !== widgetManager) {
                let test = true
                if (this.selectedWidgets.length && this.selectedWidgets[0].parent !== widget.parent) test = false
                sameLevel = test
                if (!sameLevel) widget = widget.parent
            }

            if (!this.selectedWidgets.includes(widget) && sameLevel) {

                this.selectedWidgets.push(widget)

            } else if (sameLevel && !options.fromLasso){

                this.selectedWidgets.splice(this.selectedWidgets.indexOf(widget), 1)

            }

        } else {

            this.selectedWidgets = [widget]

        }

        if (this.selectedWidgets.length) {
            var parent = this.selectedWidgets[0].parent
            while (parent !== widgetManager) {
                if (parent.getProp('lock')) {
                    this.selectedWidgets = [parent]
                }
                parent = parent.parent
            }
        }

        if (options.fromLasso && !options.lassoEnd) return

        this.unselect()

        if (this.selectedWidgets.length > 0) {

            this.inspector.inspect(this.selectedWidgets)
            this.createSelectionBlock()

        } else {

            this.inspector.clear()

        }

    }


    createSelectionBlock(){

        for (let widget of this.selectedWidgets) {
            DOM.each(document, `[data-widget="${widget.hash}"]`, (item)=>{
                item.classList.add('editing')
            })
        }
        this.widgetTree.select(this.selectedWidgets)
        this.widgetDragResize.create(this.selectedWidgets)

    }

    mouseMove(e) {

        this.mousePosition.x = Math.round((e.offsetX + e.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
        this.mousePosition.y = Math.round((e.offsetY + e.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH

    }

    mouseLeave(e) {

        this.mousePosition = {}

    }

    copyWidget(tmp) {

        if (!this.selectedWidgets.length) return
        if (this.selectedWidgets[0].getProp('type') === 'root') return

        this.clipboard = deepCopy(this.selectedWidgets.map((w)=>w.props))
        this.idClipboard = this.selectedWidgets[0].getProp('id')

        ipc.send('clipboard', {
            clipboard: this.clipboard,
            idClipboard: this.idClipboard
        })

    }

    duplicateWidget(x, y, increment) {

        if (!this.selectedWidgets.length) return
        if (this.selectedWidgets[0].getProp('type') === 'root') return

        this.tmpClipboard = deepCopy(this.selectedWidgets.map((w)=>w.props))
        var index = Math.max(...this.selectedWidgets.map(w=>w.parent.children.indexOf(w)))
        this.select(this.selectedWidgets[0].parent)
        this.pasteWidget(x, y, increment, index + 1, true)
        this.select(this.selectedWidgets[0].children[index + 1])

    }

    cutWidget() {

        this.copyWidget()
        this.deleteWidget()

    }

    pasteWidget(x, y, increment, index, tmp) {

        if (!this.selectedWidgets.length) return

        var clipboard = tmp ? this.tmpClipboard : this.clipboard

        if (clipboard === null) return

        if (
            this.selectedWidgets[0].childrenType === undefined ||
            clipboard[0].type === 'tab' && this.selectedWidgets[0].childrenType === 'widget' ||
            clipboard[0].type !== 'tab' && this.selectedWidgets[0].childrenType === 'tab'
        ) return

        var pastedData = deepCopy(clipboard),
            minTop = Infinity,
            minLeft = Infinity

        if (increment) {
            pastedData = incrementWidget(pastedData)
        }


        if (x !== undefined) {

            for (let i in pastedData) {

                let top = pastedData[i].top,
                    left = pastedData[i].left

                if (typeof top === 'string' && top.includes('%')) {
                    top = parseFloat(top) / 100 * this.selectedWidgets[0].widget.offsetHeight
                    pastedData[i]._atop = top
                    pastedData[i]._ptop = true
                }

                if (typeof left === 'string' && left.includes('%')) {
                    left = parseFloat(left) / 100 * this.selectedWidgets[0].widget.offsetWidth
                    pastedData[i]._aleft = left
                    pastedData[i]._pleft = true
                }


                if (top < minTop) minTop = top
                if (left < minLeft) minLeft = left

            }

            for (let i in pastedData) {

                if (!String(pastedData[i].left).match(/\{/)) {

                    if (pastedData[i]._pleft) {
                        pastedData[i].left = ((pastedData[i]._aleft - minLeft + x) * 100 / this.selectedWidgets[0].widget.offsetWidth).toFixed(2).replace(/\.?0+$/, '') + '%'
                    } else {
                        pastedData[i].left += - minLeft + x
                    }

                }

                if (!String(pastedData[i].top).match(/\{/)) {

                    if (pastedData[i]._ptop) {
                        pastedData[i].top = ((pastedData[i]._atop - minTop + y) * 100 / this.selectedWidgets[0].widget.offsetHeight).toFixed(2).replace(/\.?0+$/, '') + '%'
                    } else {
                        pastedData[i].top += - minTop + y
                    }

                }


            }

        }


        // paste data

        var store = clipboard[0].type === 'tab' ? 'tabs' : 'widgets'

        this.selectedWidgets[0].props[store] = this.selectedWidgets[0].props[store] || []

        var indexes = {addedIndexes: []},
            start = index || this.selectedWidgets[0].props[store].length

        this.selectedWidgets[0].props[store].splice(start, 0, ...pastedData)

        for (let i = 0; i < pastedData.length; i++) {
            indexes.addedIndexes.push(start + pastedData.length - 1 - i )
        }

        if (index)indexes.reuseChildren=false

        updateWidget(this.selectedWidgets[0], indexes)

        this.pushHistory(indexes)

        if (!leftUiSidePanel.minimized) this.widgetTree.showWidget(this.selectedWidgets[0].children[0])

    }

    pasteWidgetAsClone(x, y) {

        if (!this.selectedWidgets.length || this.clipboard === null) return
        if (!this.idClipboard || !widgetManager.getWidgetById(this.idClipboard).length) return

        if (
            this.selectedWidgets[0].childrenType === undefined ||
            this.clipboard[0].type === 'tab' ||
            this.clipboard[0].type !== 'tab' && this.selectedWidgets[0].childrenType === 'tab'
        ) return

        var clone = {type: 'clone', widgetId: this.idClipboard},
            pastedData = deepCopy(this.clipboard)

        clone.width = pastedData[0].width
        clone.height = pastedData[0].height


        if (x !== undefined) {

            clone.left = x
            clone.top  = y

            if (this.usePercents) {
                clone.top = (100 * y / editor.selectedWidgets[0].widget.offsetHeight).toFixed(2).replace(/\.?0+$/, '') + '%'
                clone.left= (100 * x / editor.selectedWidgets[0].widget.offsetWidth).toFixed(2).replace(/\.?0+$/, '') + '%'
            }


        }

        this.selectedWidgets[0].props.widgets = this.selectedWidgets[0].props.widgets || []
        this.selectedWidgets[0].props.widgets.push(clone)

        var indexes = {addedIndexes: [this.selectedWidgets[0].props.widgets.length -1]}

        updateWidget(this.selectedWidgets[0], indexes)

        this.pushHistory(indexes)

        if (!leftUiSidePanel.minimized) this.widgetTree.showWidget(this.selectedWidgets[0].children[0])


    }


    deleteWidget() {

        if (!this.selectedWidgets.length) return
        if (this.selectedWidgets[0].getProp('type') === 'root') return

        var type = this.selectedWidgets[0].props.type == 'tab' ? 'tab' : 'widget',
            parent = this.selectedWidgets[0].parent,
            index = this.selectedWidgets.map(w => parent.children.indexOf(w)).sort((a,b)=>{return b-a}),
            removedIndexes = []

        if (type === 'widget') {
            for (let i of index) {
                removedIndexes.push(i)
                parent.props.widgets.splice(i,1)
            }
        } else {
            for (let i of index) {
                removedIndexes.push(i)
                parent.props.tabs.splice(i,1)
            }
        }

        var container = updateWidget(parent, {preventSelect: true, removedIndexes})
        if (container.children.length) {
            this.select(container.children[Math.min(index.pop(), container.children.length - 1)])
        } else {
            this.select(container)
        }
        this.pushHistory({removedIndexes})

    }

    resizeWidget(deltaW, deltaH) {

        if (!this.selectedWidgets.length) return

        if (this.selectedWidgets.some(w=>w.getProp('lock'))) {
            this.createSelectionBlock()
            return
        }

        var newWidgets = [],
            area = this.widgetDragResize,
            changedProps = []

        for (var i = 0; i < this.selectedWidgets.length; i++) {

            let w = this.selectedWidgets[i],
                nW, nH, nL, nT

            nW = w.container.offsetWidth + deltaW * w.container.offsetWidth / area.initWidth
            nH = w.container.offsetHeight + deltaH * w.container.offsetHeight / area.initHeight

            if (this.selectedWidgets.length > 1) {
                nL = w.container.offsetLeft + deltaW * (w.container.offsetLeft - area.initLeft) / area.initWidth
                nT = w.container.offsetTop + deltaH * (w.container.offsetTop - area.initTop) / area.initHeight
            }

            if (deltaW !== 0 && w.props.width !== undefined && w.parent.getProp('layout') !== 'vertical') {
                var newWidth = Math.max(nW, GRIDWIDTH) / PXSCALE
                if (typeof w.props.width === 'string' && w.props.width.indexOf('%') > -1) {
                    w.props.width = (100 * PXSCALE * newWidth / w.container.parentNode.offsetWidth).toFixed(2).replace(/\.?0+$/, '') + '%'
                } else {
                    w.props.width = newWidth
                }
                changedProps.push('width')

                if (this.selectedWidgets.length > 1) {
                    var newLeft = Math.max(nL, GRIDWIDTH) / PXSCALE
                    if (typeof w.props.left === 'string' && w.props.left.indexOf('%') > -1) {
                        w.props.left = (100 * PXSCALE * newLeft / w.container.parentNode.offsetWidth).toFixed(2).replace(/\.?0+$/, '') + '%'
                    } else if (w.props.left !== 'auto'){
                        w.props.left = newLeft
                    }
                    changedProps.push('left')
                }

            }

            if (deltaH !== 0 && w.props.height !== undefined && w.parent.getProp('layout') !== 'horizontal') {
                var newHeight = Math.max(nH, GRIDWIDTH) / PXSCALE
                if (typeof w.props.height === 'string' && w.props.height.indexOf('%') > -1) {
                    w.props.height = (100 * PXSCALE * newHeight / w.container.parentNode.offsetHeight).toFixed(2).replace(/\.?0+$/, '') + '%'
                } else {
                    w.props.height = newHeight
                }
                changedProps.push('height')

                if (this.selectedWidgets.length > 1) {
                    var newTop = Math.max(nT, GRIDWIDTH) / PXSCALE
                    if (typeof w.props.top === 'string' && w.props.top.indexOf('%') > -1) {
                        w.props.top = (100 * PXSCALE * newTop / w.container.parentNode.offsetHeight).toFixed(2).replace(/\.?0+$/, '') + '%'
                    } else if (w.props.top !== 'auto'){
                        w.props.top = newTop
                    }
                    changedProps.push('top')
                }
            }

            if (w.props.width !== undefined || w.props.height !== undefined) newWidgets.push(updateWidget(w, {changedProps: changedProps, preventSelect: this.selectedWidgets.length > 1}))

        }

        this.pushHistory()

        // if (newWidgets.length > 1) this.select(newWidgets, {preventSelect: this.selectedWidgets.length > 1})
        this.createSelectionBlock()

    }

    moveWidget(deltaX, deltaY) {

        if (!this.selectedWidgets.length) return

        if (this.selectedWidgets.some(w=>w.getProp('lock'))) {
            this.createSelectionBlock()
            return
        }

        var newWidgets = []

        for (var w of this.selectedWidgets) {

            var newTop = Math.max(parseInt(w.container.offsetTop) / PXSCALE + deltaY, 0)
            if (typeof w.props.top === 'string' && w.props.top.indexOf('%') > -1) {
                w.props.top = (100 * PXSCALE * newTop / w.container.parentNode.offsetHeight).toFixed(2).replace(/\.?0+$/, '') + '%'
            } else {
                w.props.top = newTop
            }
            var newLeft = Math.max(parseInt(w.container.offsetLeft) / PXSCALE + deltaX, 0)
            if (typeof w.props.left === 'string' && w.props.left.indexOf('%') > -1) {
                w.props.left = (100 * PXSCALE * newLeft / w.container.parentNode.offsetWidth).toFixed(2).replace(/\.?0+$/, '') + '%'
            } else {
                w.props.left = newLeft
            }

            newWidgets.push(updateWidget(w, {changedProps: ['top', 'left'], preventSelect: this.selectedWidgets.length > 1}))

        }

        this.pushHistory()

        // if (newWidgets.length > 1) this.select(newWidgets)
        this.createSelectionBlock()

    }



    pushHistory(indexes) {

        this.unsavedSession = true

        if (this.historyState > -1) {
            this.history.splice(0, this.historyState + 1)
            this.historyState = -1
        }

        var d = diff.diff(this.historySession, sessionManager.session.getRoot())

        if (d) {
            diff.patch(this.historySession, deepCopy(d))
            this.history.unshift([deepCopy(d), indexes])
            if (this.history.length > HISTORY_SIZE) this.history.pop()
        }

    }

    clearHistory() {

        this.history = []
        this.historyState = -1
        this.historySession = deepCopy(sessionManager.session.getRoot())

    }

    undo() {

        if (this.historyState === this.history.length - 1) return

        this.historyState += 1

        var [patch, indexes] = this.history[this.historyState],
            d1 = deepCopy(patch),
            d2 = deepCopy(patch)

        diff.unpatch(this.historySession, d1)
        diff.unpatch(sessionManager.session.getRoot(), d2)

        this.updateWidgetFromPatch(patch, indexes ? {
            addedIndexes: deepCopy(indexes.removedIndexes),
            removedIndexes: deepCopy(indexes.addedIndexes),
        } : undefined)

    }

    redo() {

        if (this.historyState === -1) return

        var [patch, indexes] = this.history[this.historyState],
            d1 = deepCopy(patch),
            d2 = deepCopy(patch)

        diff.patch(this.historySession, d1)
        diff.patch(sessionManager.session.getRoot(), d2)

        this.updateWidgetFromPatch(patch, indexes ? {
            addedIndexes: deepCopy(indexes.addedIndexes),
            removedIndexes: deepCopy(indexes.removedIndexes),
        } : undefined)

        this.historyState -= 1

    }

    updateWidgetFromPatch(patch, indexes) {

        var [widget, subpatch] = diffToWidget(widgetManager.getWidgetById('root')[0], patch),
            options = {}

        if (indexes) {
            options = {...indexes}
        } else {
            options.changedProps = Object.keys(subpatch)
            options.reuseChildren = false
        }

        updateWidget(widget, options)

        if (this.selectedWidgets[0] && !widgetManager.widgets[this.selectedWidgets[0].hash]) {
            this.unselect()
            this.selectedWidgets = []
            this.inspector.clear()
        } else if (this.selectedWidgets[0]) {
            this.widgetDragResize.create(this.selectedWidgets)
        }

    }




}

var editor = new Editor()

export default editor
