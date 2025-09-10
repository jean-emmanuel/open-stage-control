var UiModal = require('./ui-modal'),
    locales = require('../locales'),
    html = require('nanohtml/lib/browser'),
    raw = require('nanohtml/raw'),
    {icon} = require('../ui/utils'),
    scriptGlobals = require('../widgets/scripts/script-vm').globals,
    editors = {}, editorModes = {
        javascript: require('ace-builds/src-noconflict/mode-javascript.js'),
        css: require('ace-builds/src-noconflict/mode-css.js'),
        html: require('ace-builds/src-noconflict/mode-html.js'),
    },
    codeEditorModKey = (navigator.platform || '').match('Mac') ? 'Cmd' : 'Ctrl'

ace.config.set('basePath', '/client/ace/')

function setCommandEnabled(editor, name, enabled) {
    var command = editor.commands.byName[name]
    if (!command.bindKeyOriginal)
        command.bindKeyOriginal = command.bindKey
    command.bindKey = enabled ? command.bindKeyOriginal : null
    editor.commands.addCommand(command)
}


class CodeEditor {

    constructor(parent, name, language, syntaxChecker) {

        this.parent = parent
        this.name = name
        this.language = language
        this.syntaxChecker = syntaxChecker

        this.field = null
        this.input = null
        this.widget = null
        this.container = html`<div id="#editor${name}"></div>`
        this.helpBtn = html`<div class="btn help">${locales('editor_ace_help')}</div>`
        this.fsBtn = html`<div class="btn fullscreen">${raw(icon('expand'))}</div>`

        this.helpBtn.addEventListener('fast-click', (e)=>{
            this.help()
        })
        this.fsBtn.addEventListener('fast-click', (e)=>{
            this.fullscreen()
        })

        this.closeKey = ((e)=>{
            // this handler may remain dangling if closing with ctrl+enter
            // we ignore this as it has no effect
            if (e.key != 'Escape') return
            this.field.classList.remove('fullscreen')
            this.editor.setOptions({maxLines: 30})
            this.editor.fullscreen = false
            document.removeEventListener('keydown', this.closeKey)
            this.field.removeEventListener('fast-click', this.closeClick)
            this.editor.blur()
            this.parent.parentContainer.classList.remove('editor-breakout')
        }).bind(this)

        this.closeClick = ((e)=>{
            if (e.target === this.field) {
                this.closeKey({key: 'Escape'})
            }
        }).bind(this)

        this.editor = ace.edit(this.container)

        if (editorModes[language]) this.editor.getSession().setMode('ace/mode/' + language)

        this.editor.setOptions({
            autoScrollEditorIntoView: true,
            copyWithEmptySelection: true,
            highlightIndentGuides:false,
            tooltipFollowsMouse: false,
            tabSize: 2,
            maxLines: 30,
            dragEnabled: false,
            useWorker: syntaxChecker !== false
        })

        this.editor.$blockScrolling = Infinity
        this.editor.commands.bindKeys({
            'ctrl-l': null, 'ctrl-f': null, 'ctrl-h': null, 'ctrl-,': null,
            'cmd-l': null, 'cmd-f': null, 'cmd-h': null, 'cmd-,': null,
        })
        this.editor.renderer.setScrollMargin(4, 4, 0, 4)
        this.editor.element = this.container
        this.editor.element.classList.add('ace_dark')
        this.editor.textarea = DOM.get(this.container, '.ace_text-input')[0]
        this.editor.textarea.name = name
        this.editor.textarea._ace = true
        this.editor.setHighlightActiveLine(false)
        this.editor.setHighlightGutterLine(false)

        if (language === 'javascript' && syntaxChecker !== false) {
            this.editor.getSession().$worker.send('setOptions', [{
                asi: true,          // no semicolon
                esversion: 7,
                strict: 'implied',
                node: false,
                browser: true,
                validthis: true,
                undef: true,
                globals: {}
            }])
        }

        this.container.addEventListener('mousedown', (e)=>{
            if (e.button === 1) {
                e.preventDefault()
                e.stopPropagation()
            }
        }, {capture: true})

    }

    bind(widget, field) {

        this.widget = widget
        this.field = field
        this.input = DOM.get(field, 'textarea')[0]

        var editor = this.editor,
            input = this.input

        editor.fullscreen = false
        input.style.display = 'none'
        input._ace_input = editor.textarea
        input.tabIndex = -1

        editor.setValue(input.value)
        editor.textarea.osc_input = input
        editor.textarea.tabIndex = 0
        editor.selection.setRange({start:0,end:0})
        if (!this.widget || widget.hash !== this.widget.hash) {
            // preserve active line if widget is the same
            editor.gotoLine(0)
        }

        editor.removeAllListeners('focus')
        this.editor.on('focus', (e)=>{
            this.parent.focusedInput = this.input
            this.editor.setHighlightActiveLine(true)
            this.editor.setHighlightGutterLine(true)

            this.editor.removeAllListeners('blur')
            this.editor.removeAllListeners('change')
            this.editor.removeAllListeners('changeSelection')
            this.editor.on('change', (e)=>{
                this.input.value = this.editor.getValue()
                this.editor.dirty = true
            })

            setTimeout(()=>{
                var pos = this.editor.getCursorPosition()
                if (pos.row === undefined || pos.column === undefined) {
                    this.editor.gotoLine(0)
                }
            })

            this.typing = false
            setCommandEnabled(this.editor, 'indent', false)
            setCommandEnabled(this.editor, 'outdent', false)

            this.editor.on('changeSelection', ()=>{
                if (this.typing) return
                let pos = this.editor.getCursorPosition()
                if (pos.row || pos.column) {
                    setCommandEnabled(this.editor, 'indent', true)
                    setCommandEnabled(this.editor, 'outdent', true)
                }
                this.typing = true
            })
            this.editor.on('blur', (e)=>{
                this.editor.setHighlightActiveLine(false)
                this.editor.setHighlightGutterLine(false)
                this.editor.selection.setRange({start:0,end:0})
                if (this.editor.fullscreen) {
                    e.preventDefault()
                    return
                }
                this.input.value = this.editor.getValue()
                this.parent.focusedInput = this.input
                if (this.editor.dirty) {
                    this.editor.dirty = false
                    this.parent.onChange()
                }
                this.parent.focusedInput = null

            })

        })


        editor.setOptions({maxLines: 30})
        editor.dirty = false

        if (this.language === 'javascript') {
            let globals = {}
            if (this.name === 'onKeyboard') {
                globals = {type: true, key: true, code: true, ctrl: true, shift: true, alt: true, meta: true}
            } else if (this.name === 'onCreate') {
                globals = {value: true}
            } else if (this.name === 'onValue') {
                globals = {id: true, value: true, touch: true}
            } else if (this.name === 'onDraw') {
                globals = {value: true, height: true, width: true, ctx: true, cssVars: true}
            } else if (this.name === 'onTouch') {
                globals = this.widget.getProp('type') === 'canvas' ?
                    {value: true, height: true, width: true, event: true} :
                    {value: true, event: true, handle: true}
            } else if (this.name === 'onResize') {
                globals = {value: true, height: true, width: true, cssVars: true}
            }


            globals.locals = true
            globals.console = true
            globals.JS = true
            globals.this = false

            if (this.syntaxChecker !== false) editor.getSession().$worker.send('changeOptions', [{
                globals: {...scriptGlobals, ...globals}
            }])
        }

        field.appendChild(editor.element)
        field.appendChild(this.helpBtn)
        field.appendChild(this.fsBtn)

        editor.getSession().getUndoManager().reset()
        editor.resize()


    }

    fullscreen() {

        this.editor.fullscreen = this.field.classList.toggle('fullscreen')
        this.editor.setOptions({maxLines: this.editor.fullscreen ? 0 : 30})
        this.field.style.setProperty('--prefix', this.editor.fullscreen ? '"' + this.widget.getProp('id') + '."' : '')
        setTimeout(()=>{
            window.dispatchEvent(new Event('resize'))
        })

        if (this.editor.fullscreen) {
            this.parent.parentContainer.classList.add('editor-breakout')
            this.editor.focus()
            document.addEventListener('keydown', this.closeKey)
            this.field.addEventListener('fast-click', this.closeClick)
        } else {
            this.parent.parentContainer.classList.remove('editor-breakout')
            document.removeEventListener('keydown', this.closeKey)
            this.field.removeEventListener('fast-click', this.closeClick)
        }
    }

    help() {

        var keybindings = []
        var commandMap = {}

        this.editor.keyBinding.$handlers.forEach(function(handler) {
            var ckb = handler.commandKeyBinding
            for (var i in ckb) {
                var key = i.replace(/(^|-)\w/g, function(x) { return x.toUpperCase() })
                var commands = ckb[i]
                if (!Array.isArray(commands))
                    commands = [commands]
                commands.forEach(function(command) {
                    if (typeof command != 'string')
                        command  = command.name
                    if (commandMap[command]) {
                        commandMap[command].key += '|' + key
                    } else {
                        commandMap[command] = {key: key, command: command}
                        keybindings.push(commandMap[command])
                    }
                })
            }
        })

        var modal = new UiModal({closable: true, title: html`<span class="editor-help-title">${locales('editor_ace_help_title')}</span>`, html: true, content: html`
            <div class="inspector-help">
                <table>
                <thead>
                    <tr>
                        <th>Shortcut</th>
                        <th>Command</th>
                    </tr>
                </thead>
                    <tr><td><span class="kbd">${codeEditorModKey}-Enter</span></td><td>save</td></tr>
                    ${keybindings.map(k=>html`<tr><td><span class="kbd">${k.key}</span></td><td>${k.command}</td></tr>`)}
                </table>
            </div>
        `})


        this.parent.helpModalOpened = true

        modal.on('close', ()=>{
            this.parent.helpModalOpened = false
        })

    }

}

module.exports = function(parent, name, language, syntaxChecker) {
    if (!editors[name]) editors[name] = new CodeEditor(parent, name, language, syntaxChecker)
    return editors[name]
}
