import {updateWidget} from './data-workers'
import {categories} from '../widgets/'
import widgetManager from '../managers/widgets'
import {icon} from '../ui/utils'
import editor from './'
import locales from '../locales'
import ContextMenu from '../ui/context-menu'

var sessionManager
;(async ()=>{
    sessionManager = (await import('../managers/session')).default
})()


var contextMenu = new ContextMenu()

var multiSelectKey = (navigator.platform || '').match('Mac') ? 'metaKey' : 'ctrlKey'

var handleClick = function(event) {

    if (
        !editor.enabled ||
        event.detail.button === 1 ||
        (event.detail.metaKey && event.detail.shiftKey)
    ) return

    if (!event.detail[multiSelectKey] && event.type !== 'fast-right-click' && (
        event.target.classList.contains('no-widget-select') ||
        event.target.id === 'open-toggle'
    )) { return }

    var eventData = event.detail,
        targetWidget = widgetManager.getWidgetByElement(eventData.target, ':not(.not-editable)')

    if (!targetWidget) return

    while (targetWidget._not_editable && targetWidget.parent) {
        targetWidget = targetWidget.parent
    }

    // if the widget is not already selected
    if (!targetWidget.container.classList.contains('editing') || event.detail.ctrlKey || event.detail.shiftKey) {
        // add a flag to the original event to prevent draginit
        // and prevent any further fast-click (ie input focus)
        eventData.capturedByEditor = true
        event.capturedByEditor = true
    }


    if (editor.inspector.focusedInput) {
        editor.inspector.onChange()
        editor.inspector.focusedInput = null
        if (!document.body.contains(eventData.target)) return
    }

    if (event.type !== 'fast-right-click') {

        if (targetWidget.getProp('type') === 'tab') {
            targetWidget.parent.setValue(targetWidget.parent.children.indexOf(targetWidget), {sync: true, send: true})
        }

        if (
            event.target.tagName === 'LI' && // Project tree
            event.detail.shiftKey &&
            editor.selectedWidgets.length > 0 &&
            targetWidget.parent === editor.selectedWidgets[0].parent
        ) {
            var siblings = targetWidget.parent.children,
                from = siblings.indexOf(editor.selectedWidgets[0]),
                to = siblings.indexOf(targetWidget),
                range = siblings.slice(Math.min(from, to), Math.max(from, to) + 1).filter(w=>!editor.selectedWidgets.includes(w))

            targetWidget = editor.selectedWidgets.concat(range)
        }

        editor.select(targetWidget, {multi: event.detail[multiSelectKey]})

    }

    // right-click menu
    if (event.type !== 'fast-right-click') return

    if (!event.detail.shiftKey && !event.detail[multiSelectKey] && editor.selectedWidgets.length <= 1) {
        if (editor.inspector.focusedInput) editor.inspector.onChange()
        editor.select(targetWidget)
    }

    if (!editor.selectedWidgets.length) return

    var data = editor.selectedWidgets.map((w)=>w.props),
        widget = editor.selectedWidgets[0],
        parent = widget.parent,
        actions = []

    var clickX = Math.round((eventData.offsetX + eventData.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
        clickY = Math.round((eventData.offsetY + eventData.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH

    if (parent !== widgetManager)  {

        if (event.target.tagName !== 'LI') { // not Project tree
            actions.push({
                label: icon('project-diagram') + ' ' + locales('editor_show_in_tree'),
                action: ()=>{
                    editor.widgetTree.showWidget(editor.selectedWidgets[0])
                    editor.widgetTree.blinkSelected()
                },
                shortcut: 't'
            })

        } else {

            actions.push({
                label: icon('eye') + ' ' + locales('editor_show_in_session'),
                action: ()=>{
                    for (let w of editor.selectedWidgets) {
                        editor.widgetTree.showWidgetInSession(w)
                    }
                },
                shortcut: 'y'
            })

        }

        actions.push({
            separator: true
        })

        actions.push({
            label: icon('copy') + ' ' + locales('editor_copy'),
            action: editor.copyWidget.bind(editor),
            shortcut: 'mod + c'
        })

        actions.push({
            label: icon('cut') + ' ' + locales('editor_cut'),
            action: editor.cutWidget.bind(editor),
            shortcut: 'mod + x'
        })

    }

    if (widget.childrenType !== undefined) {

        if (editor.clipboard !== null) {

            var pasteActions = [],
                canPaste = true

            if (
                editor.clipboard[0].type === 'tab' && widget.childrenType === 'widget' ||
                editor.clipboard[0].type !== 'tab' && widget.childrenType === 'tab'
            ) canPaste = false

            if (canPaste) {

                pasteActions.push({
                    label: icon('paste') + ' ' + locales('editor_paste'),
                    action: ()=>{
                        editor.pasteWidget(clickX, clickY)
                    },
                    shortcut: 'mod + v'
                })
                pasteActions.push({
                    label: icon('plus-square') + ' ' + locales('editor_pasteindent'),
                    action: ()=>{
                        editor.pasteWidget(clickX, clickY, true)
                    },
                    shortcut: 'mod + shift + v'

                })

                if (editor.idClipboard && widgetManager.getWidgetById(editor.idClipboard).length && editor.clipboard[0].type !== 'tab') {
                    pasteActions.push({
                        label: icon('clone') + ' ' + locales('editor_clone'),
                        action: ()=>{
                            editor.pasteWidgetAsClone(clickX, clickY)
                        }
                    })
                }

            }

            actions.push({
                label: icon('paste') + ' ' + locales('editor_paste'),
                action: pasteActions,
                class: canPaste ? '' : 'disabled'
            })

        }

    }

    if (parent !== widgetManager && editor.selectedWidgets.length === 1 && editor.selectedWidgets[0].parent.children.length > 1) {
        actions.push({
            separator: true
        })
        actions.push({
            label: icon('layer-group') + ' Position',
            action: [
                {
                    label: locales('editor_back'),
                    action: ()=>{
                        editor.handleKeydown('home')
                    },
                    shortcut: 'Home'
                },
                {
                    label: locales('editor_farther'),
                    action: ()=>{
                        editor.handleKeydown('pageup')
                    },
                    shortcut: 'Page Up'
                },
                {
                    label: locales('editor_closer'),
                    action: ()=>{
                        editor.handleKeydown('pagedown')
                    },
                    shortcut: 'Page Down'
                },
                {
                    label: locales('editor_front'),
                    action: ()=>{
                        editor.handleKeydown('end')
                    },
                    shortcut: 'End'
                }
            ]
        })

    }

    if (widget.childrenType !== undefined) {

        var addActions = []

        for (let category in categories) {

            var catActions = []

            for (let t in categories[category]) {

                let type = categories[category][t]

                catActions.push({

                    label: type,
                    action: ()=>{

                        var newData = {type: type}

                        if (!eventData.target.classList.contains('tablink')) {
                            newData.top = clickY
                            newData.left= clickX
                        }

                        if (editor.usePercents) {
                            newData.top = (100 * clickY / editor.selectedWidgets[0].widget.offsetHeight).toFixed(2) + '%'
                            newData.left= (100 * clickX / editor.selectedWidgets[0].widget.offsetWidth).toFixed(2) + '%'
                            newData.height= '6%'
                            newData.width = '8%'
                        }

                        data[0].widgets = data[0].widgets || []
                        data[0].widgets.push(newData)

                        var indexes = {addedIndexes: [data[0].widgets.length -1]}

                        updateWidget(editor.selectedWidgets[0], indexes)
                        editor.pushHistory(indexes)

                        var newWidget = editor.selectedWidgets[0].children[editor.selectedWidgets[0].children.length - 1]
                        editor.select([newWidget])
                        if (!editor.widgetTree.parent.minimized) editor.widgetTree.showWidget(newWidget)


                    }
                })

            }

            addActions.push({
                label: category,
                action: catActions
            })

        }

        if (data.length == 1 && widget.childrenType !== undefined) {
            if (actions.length) actions.push({
                separator: true
            })
        }

        if (data.length == 1 && widget.childrenType !== 'tab') {
            actions.push({
                label: icon('plus') + ' ' + locales('editor_addwidget'),
                action: addActions
            })
        }

        if (data.length == 1 && widget.childrenType !== 'widget') {

            actions.push({
                label: icon('plus') + ' ' + locales('editor_addtab'),
                action: ()=>{
                    data[0].tabs = data[0].tabs || []
                    data[0].tabs.push({})

                    var indexes = {addedIndexes: [data[0].tabs.length -1]}

                    updateWidget(editor.selectedWidgets[0], indexes)
                    editor.pushHistory(indexes)

                    var newWidget = editor.selectedWidgets[0].children[editor.selectedWidgets[0].children.length - 1]

                    editor.select([newWidget])
                    if (!editor.widgetTree.parent.minimized) editor.widgetTree.showWidget(newWidget)
                    newWidget.parent.setValue(newWidget.parent.children.indexOf(newWidget))


                }
            })

        }

    }


    if (parent !== widgetManager && data.length === 1) {

        actions.push({
            separator: true
        })

        actions.push({
            label: icon('file-download') + ' ' + locales('editor_fragment_export'),
            action: ()=>{
                sessionManager.saveFragment(editor.selectedWidgets[0].props)
            }
        })
    }

    if (parent !== widgetManager)  {

        actions.push({
            separator: true
        })

        actions.push({
            label: icon('trash') + ' ' + locales('editor_delete'),
            action: editor.deleteWidget.bind(editor),
            shortcut: 'delete'
        })

    }

    contextMenu.open(eventData, actions)

}

document.body.addEventListener('fast-right-click', handleClick, true)
document.body.addEventListener('fast-click', handleClick, true)
