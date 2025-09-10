var EventEmitter = require('../../events/event-emitter'),
    osc = require('../../osc'),
    {nanoid} = require('nanoid'),
    widgetManager = require('../../managers/widgets'),
    {urlParser, balancedReplace} = require('../utils'),
    Vm = require('../vm'),
    vm = new Vm(),
    scopeCss = require('scope-css'),
    resize = require('../../events/resize'),
    OscReceiver = require('./osc-receiver'),
    {deepCopy, deepEqual, isJSON} = require('../../utils'),
    html = require('nanohtml/lib/browser'),
    morph = require('nanomorph'),
    sanitizeHtml = require('sanitize-html'),
    updateWidget = ()=>{},
    Script = require('../scripts/script'),
    uiConsole, uiTree, uiDragResize, sessionManager


var oscReceiverState = {}

var OSCProps = [
    'decimals',
    'address',
    'preArgs',
    'typeTags',
    'target',
    'bypass'
]

setTimeout(()=>{
    updateWidget = require('../../editor/data-workers').updateWidget
    uiConsole = require('../../ui/ui-console')
    uiTree = require('../../editor').widgetTree
    uiDragResize = require('../../editor').widgetDragResize
    sessionManager = require('../../managers/session')
})

class Widget extends EventEmitter {

    static description() {

        return ''

    }

    static defaults(Class=Widget) {

        var defaults = {
            widget: {
                lock: {type: 'boolean', value: false, help: 'Set to `true` to prevent modifying this widget with the editor. This will not prevent deleting the widget or moving it from a container to another.'},
                type: {type: 'string', value: 'auto', help: 'Widget type'},
                id: {type: 'string', value: 'auto', help: 'Widgets sharing the same `id` will act as clones and update each other\'s value(s) without sending extra osc messages (avoid doing so unless the widgets expect the exact same values).' },
                visible: {type: 'boolean', value: true, help: 'Set to `false` to hide the widget.'},
                interaction: {type: 'boolean', value: true, help: 'Set to `false` to disable pointer interactions.'},
                comments: {type: 'string', value: '', help: 'User comments.'},
            },
            geometry: {
                left: {type: 'number|string', value: 'auto', help: [
                    'When both top and left are set to auto, the widget is positioned according to the normal flow of the page (from left to right, by order of creation).',
                    'Otherwise, the widget will be positioned at absolute coordinates'
                ]},
                top: {type: 'number|percentage', value: 'auto', help: [
                    'When both top and left are set to auto, the widget is positioned according to the normal flow of the page (from left to right, by order of creation).',
                    'Otherwise, the widget will be positioned at absolute coordinates'
                ]},
                width: {type: 'number|percentage', value: 'auto', help: 'Widget width'},
                height: {type: 'number|percentage', value: 'auto', help: 'Widget height'},
                expand: {type: 'boolean|number', value: false, help: 'If parent\'s layout is `vertical` or `horizontal`, set this to `true` to stretch the widget to use available space automatically.'},
            },
            style: {
                colorText: {type: 'string', value: 'auto', help: 'Text color. Set to "auto" to inherit from parent widget.'},
                colorWidget: {type: 'string', value: 'auto', help: 'Widget\'s default accent color. Set to "auto" to inherit from parent widget.'},
                colorStroke: {type: 'string', value: 'auto', help: 'Stroke color. Set to "auto" to use `colorWidget`.'},
                colorFill: {type: 'string', value: 'auto', help: 'Fill color. Set to "auto" to use `colorWidget`.'},
                alphaStroke: {type: 'number', value: 'auto', help: 'Stroke color opacity.'},
                alphaFillOff: {type: 'number', value: 'auto', help: 'Fill color opacity (off).'},
                alphaFillOn: {type: 'number', value: 'auto', help: 'Fill color opacity (on).'},
                lineWidth: {type: 'number', value: 'auto', help: 'Stroke width.'},
                borderRadius: {type: 'number|string', value: 'auto', help: 'Border radius expressed as a number or a css string. This property may not work for all widgets.'},
                padding: {type: 'number', value: 'auto', help: 'Inner spacing.'},
                html: {type: 'string', value: '', editor: 'html', syntaxChecker: false, help: [
                    'Custom html content to be inserted in the widget (before the widget\'s content). Elements are all unstyled by default, `css` should be used to customize their appearance.',
                    'The code is automatically wrapped in &lt;div class="html">&lt;/div>',
                    'Allowed HTML tags:',
                    '&nbsp;&nbsp;h1-6, blockquote, p, a, ul, ol, nl, li,',
                    '&nbsp;&nbsp;b, i, strong, em, strike, code, hr, br, div,',
                    '&nbsp;&nbsp;table, thead, img, caption, tbody, tr, th, td, pre',
                    'Allowed attributes:',
                    '&nbsp;&nbsp;&lt;*>: class, style, title, name',
                    '&nbsp;&nbsp;&lt;img>: src, width, height',
                ]},
                css: {type: 'string', value: '', editor: 'css', syntaxChecker: false, help: [
                    'CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.',
                    'Some style-related properties can be set or read from css using css variables:',
                    ...Class.cssVariables.map(x=>'- `' + x.css + '`: `' + x.js + '`')
                ]},
            },
            class_specific: {

            },
            value: {
                value: {type: '*', value: '', help: 'Define the widget\'s value depending on other widget\'s values / properties using the advanced property syntax'},
                default: {type: '*', value: '', help: 'If set, the widget will be initialized with this value when the session is loaded.'},
                linkId: {type: 'string|array', value: '', help: [
                    'Widgets sharing the same `linkId` update each other\'s value(s) AND send their respective osc messages.',
                    'When prefixed with >>, the `linkId` will make the widget act as a master (sending but not receiving)',
                    'When prefixed with <<, the `linkId` will make the widget act as a slave (receiving but not sending)'
                ]},
            },
            osc: {
                address: {type: 'string', value: 'auto', help: [
                    'OSC address for sending / receiving messages, it must start with a slash (`/`)',
                    'By default ("auto"), the widget\'s id is used: `/widget_id`',
                ]},
                preArgs: {type: '*|array', value: '', help: [
                    'A value or array of values that will be prepended to the widget\'s value in the OSC messages it sends.',
                    'Incoming messages must match these to affect by the widget.',
                ]},
                typeTags: {type: 'string', value: '', help: [
                    'Defines the osc argument types, one letter per argument (including preArgs)',
                    '- If empty, the types are inferred automatically from the values (with numbers casted to floats by default)',
                    '- If there are more arguments than type letters, the last type is used for the extra arguments',
                    'See <a href="http://opensoundcontrol.org/">OSC 1.0 specification</a> for existing typetags'
                ]},
                decimals: {type: 'integer', value: 2, help: [
                    'Defines the number of decimals to send.',
                ]},
                target: {type: 'string|array|null', value: '', help: [
                    'This defines the targets of the widget\'s OSC messages',
                    '- A `string` or `array` of strings formatted as follow: `ip:port` or `["ip:portA", "ip:portB"]`',
                    '- If midi is enabled, targets can be `midi:device_name`',
                    '- If no target is set, messages can still be sent if the server has default targets',
                ]},
                ignoreDefaults: {type: 'boolean', value: false, help: 'Set to `true` to ignore the server\'s default targets'},
                bypass: {type: 'boolean', value: false, help: 'Set to `true` to prevent the widget from sending any osc message'}
            },
            scripting: {
                onCreate: {type: 'script', value: '', editor: 'javascript', help: ['Script executed when the widget (and its children) is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
                onValue: {type: 'script', value: '', editor: 'javascript', help: ['Script executed when the widget\'s value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
            }
        }

        Object.defineProperty(defaults, '_props', {
            enumerable: false,
            value: function(){
                let props = {}
                for (let category in this) {
                    for (let k in this[category]) {
                        if (k[0] === '_') continue
                        props[k] = this[category][k].value
                    }
                }
                return props
            }
        })

        Object.defineProperty(defaults, 'extend', {
            enumerable: false,
            value: function(obj){
                for (let i in obj) {
                    if (obj[i] === null) delete this[i]
                    else {
                        if (this[i] === undefined) this[i] = {}
                        for (let j in obj[i]) {
                            if (obj[i][j] === null) delete this[i][j]
                            else {
                                if (!this[i][j]) this[i][j] = {}
                                Object.assign(this[i][j], obj[i][j])
                            }
                        }
                    }
                }
                return this
            }
        })

        return defaults

    }

    constructor(options={}) {

        super()

        this.widget = options.html
        this.props = options.props
        this.errors = {}
        this.parent = options.parent
        this.parentNode = options.parentNode
        this.hash = options.hash || 'W' + nanoid(9)
        this.children = []
        this.reCreateOptions = options.reCreateOptions
        this.removed = false
        this.mounted = false
        this.visible = true

        if (options.value !== undefined) this.value = options.value

        this.parsers = {}
        this.parsersLocalScope = options.locals || {}
        this.timeouts = {}
        this.intervals = {}
        this.variables = options.variables || {}
        this.fragments = {}

        this.createPropsCache()

        if (this.getProp('id') == 'root' && this.parent !== widgetManager) {
            this.props.id = '_root'
            this.cachedProps.id = '_root'
        }

        if (this.getProp('type') == 'root' && this.parent !== widgetManager) {
            this.props.type = 'panel'
            this.cachedProps.type = 'panel'
        }



        // cache decimals
        if (this.props.decimals !== undefined) {
            this.decimals = Math.min(20, Math.max(this.getProp('decimals'), 0))
        }

        // scripting
        this.scripts = {}

        if (this.getProp('onCreate')) {
            this.scripts.onCreate = new Script({
                widget: this,
                property: 'onCreate',
                code: this.getProp('onCreate'),
                context: {value: 0}
            })
        }

        if (this.getProp('onValue')) {
            this.scripts.onValue = new Script({
                widget: this,
                property: 'onValue',
                code: this.getProp('onValue'),
                context: {value: 0, id: '', touch: undefined}
            })
            this.on('value-changed', (e)=>{
                if (e.widget === this && this.mounted && !e.options.fromEdit && e.options.script !== false) {
                    this.scripts.onValue.run({
                        value: e.options.widget ? e.options.widget.value : this.value,
                        id: e.options.id || e.id
                    }, e.options)
                }
            })
        }

        if (this.getProp('onTouch') && this.getProp('type') !== 'canvas') {
            this.scripts.onTouch = new Script({
                widget: this,
                property: 'onTouch',
                code: this.getProp('onTouch'),
                context: {event: {}, value: 0}
            })
            this.on('touch', (e)=>{
                var multi = Array.isArray(e.touch),
                    state = multi ? e.touch[1] : e.touch
                this.scripts.onTouch.run({
                    event: {type: state ? 'start' : 'stop', handle: multi ? e.touch[0] : undefined},
                    value: this.value
                }, {sync: true, send: true})
            })
        }

        // legacy touch state in onValue script
        if (String(this.getProp('onValue')).includes('touch') && !this.getProp('onTouch')) {
            this.on('touch', (e)=>{
                this.scripts.onValue.run({
                    value: this.value,
                    id: this.getProp('id'),
                    touch: e.touch
                }, {sync: true, send: true})
            })
        }


        this.style = null
        this.container = html`
            <div class="widget ${options.props.type}-container" id="${this.hash}" data-widget="${this.hash}"></div>
        `

        if (this.widget) this.container.appendChild(this.widget)
        this.container._widget_instance = this


        this.container.classList.toggle('no-interaction', !this.getProp('interaction'))

        this.setContainerStyles()
        this.setCssVariables()
        this.setVisibility()

        this.extraHtml = null
        if (this.getProp('html')) this.updateHtml()

    }

    contains(widget) {

        if (this.children.indexOf(widget) > 0) return true

        var parent = widget.parent
        while (parent && parent !== widgetManager) {
            if (parent === this) return true
            parent = parent.parent
        }
        return false

    }

    getAllChildren() {

        var children = []
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i]) continue
            children.push(this.children[i])
            children = children.concat(this.children[i].getAllChildren())
        }
        return children


    }

    created(index) {

        this.trigger('widget-created', {
            id: this.getProp('id'),
            widget: this,
            options: this.reCreateOptions,
            index: index
        })

        if (this.scripts.onCreate) this.scripts.onCreate.run({value: this.value}, {sync: true, send: true, onCreate: true})

    }

    changed(options) {

        this.trigger('value-changed', {
            widget: this,
            options: options,
            id: this.getProp('id'),
            linkId: this.getProp('linkId')
        })

    }

    sendValue(overrides, options={}) {

        if (this.selfLinkedOSCProps) {
            this.updateProps(this.selfLinkedOSCProps, this)
        }

        if (this.getProp('bypass') && !options.force) return

        var data = {
            h: this.hash,
            v: this.getValue(true),
        }

        if (this.getProp('ignoreDefaults') && !options.force) data.i = 1

        if (overrides) {
            for (var k in overrides) {
                data[k] = overrides[k]
            }
        }

        if (options.syncOnly) {

            osc.sync(data)

        } else {

            osc.send(data)

        }

    }

    setValue() {}

    getValue(withdecimals) {

        return deepCopy(this.value, withdecimals ? this.decimals : undefined)

    }

    checkLinkedProps(propNames) {

        // Dynamic props cache check
        var linkedProps = []

        Object.values(this.nestedLinkedProps).forEach(l => linkedProps = linkedProps.concat(l))
        Object.values(this.linkedProps).forEach(l => linkedProps = linkedProps.concat(l))
        Object.values(this.linkedPropsValue).forEach(l => linkedProps = linkedProps.concat(l))
        Object.values(this.oscReceivers).forEach(r => linkedProps = linkedProps.concat(r.propNames))
        Object.values(this.variables).forEach(r => linkedProps = linkedProps.concat(r.propNames))
        Object.values(this.fragments).forEach(l => linkedProps = linkedProps.concat(l))

        if (
            // if prop/osc listeners/custom vars have changed (@{} / OSC{} / VAR{})
            // refresh the widget's props cache and update linked props bindings
            propNames.map(x => this.props[x]).some(x => typeof x === 'string' && x.match(/(OSC|@|VAR|IMPORT)\{/))
        ||  propNames.some(n => linkedProps.includes(n))
        ) {
            this.createPropsCache()
            return true
        }

    }

    createPropsCache() {

        // @{props} links lists
        this.linkedProps = {}
        this.nestedLinkedProps = {}
        this.linkedPropsValue = {}

        // reset VAR{} links
        for (var name in this.variables) {
            this.variables[name].propNames = []
        }

        // OSC{/path} receivers
        if (this.oscReceivers) {
            this.removeOscReceivers()
        }
        this.oscReceivers = {}

        // IMPORT{} fragments
        this.fragments = {}

        // Cache resolved props
        this.cachedProps = {}
        this.cachedProps.uuid = this.hash

        for (var k in this.props) {
            if (k != 'widgets' && k != 'tabs') {
                this.cachedProps[k] = this.resolveProp(k, undefined, true)
            } else {
                this.cachedProps[k] = this.props[k]
            }
        }

        this.createLinkedPropsBindings()

    }

    createLinkedPropsBindings() {

        if (!this.linkedCreatedCallback && Object.keys(this.linkedProps).length) {

            this.linkedCreatedCallback = (e)=>{
                this.onLinkedPropsChanged(e, 'widget-created')
            }

            this.linkedPropChangedCallback = (e)=>{
                this.onLinkedPropsChanged(e, 'prop-changed')
            }

            widgetManager.on('widget-created', this.linkedCreatedCallback, {context: this})
            widgetManager.on('prop-changed', this.linkedPropChangedCallback, {context: this})

        } else if (this.linkedCreatedCallback && !Object.keys(this.linkedProps).length) {

            widgetManager.off('widget-created', this.linkedCreatedCallback)
            widgetManager.off('prop-changed', this.linkedPropChangedCallback)
            delete this.linkedCreatedCallback
            delete this.linkedPropChangedCallback

        }

        if (!this.linkedValueChangedCallback && Object.keys(this.linkedPropsValue).length) {

            this.linkedValueChangedCallback = (e)=>{
                this.onLinkedPropsChanged(e, 'value-changed')
            }

            widgetManager.on('value-changed', this.linkedValueChangedCallback, {context: this})

        } else if (this.linkedPropsValueCallback && !Object.keys(this.linkedPropsValue).length) {

            widgetManager.off('value-changed', this.linkedValueChangedCallback)
            delete this.linkedValueChangedCallback

        }

        if (!this.linkedFragmentCallback && Object.keys(this.fragments).length) {

            this.linkedFragmentCallback = (e)=>{
                var {path} = e
                if (this.fragments[path]) this.updateProps(this.fragments[path])
            }

            sessionManager.on('fragment-updated', this.linkedFragmentCallback, {context: this})

        } else if (this.linkedFragmentCallback && !Object.keys(this.fragments).length) {

            sessionManager.off('fragment-updated', this.linkedFragmentCallback)
            delete this.linkedFragmentCallback

        }

        var selfLinkedOSCProps = (this.linkedPropsValue['this'] || []).filter(i=>OSCProps.indexOf(i) > -1)
        this.selfLinkedOSCProps = selfLinkedOSCProps.length ? selfLinkedOSCProps : false

    }

    onLinkedPropsChanged(e, type) {

        var {id, widget, options} = e,
            changedProps = type === 'prop-changed' ? e.props : type === 'value-changed' ? ['value'] : undefined,
            linkedProps = type === 'value-changed' ? this.linkedPropsValue : this.linkedProps

        if (widget === this.parent) {
            if (type === 'widget-created') return
            id = 'parent'
        }

        if (widget === this) id = 'this'

        if (this.nestedLinkedProps[id]) {
            this.updateLinkedPropsWithNesting(id)
        }

        if (linkedProps[id]) {
            this.updateProps(linkedProps[id], widget, options, changedProps)
        }

    }

    removeOscReceivers() {

        osc.off(undefined, undefined, this)
        for (var i in this.oscReceivers) {
            oscReceiverState[i] = this.oscReceivers[i].value
        }
        this.oscReceivers = {}

    }

    updateLinkedPropsWithNesting(i) {

        for (var prop of this.nestedLinkedProps[i]) {

            // 1. remove all linked props found in properties bound to the nested link
            for (var linksStores of [this.linkedPropsValue, this.linkedProps]) {
                for (let id in linksStores) {
                    if (linksStores[id].includes(prop)) {
                        linksStores[id].splice(linksStores[id].indexOf(prop), 1)
                        if (!linksStores[id].length) delete linksStores[id]
                    }
                }
            }


            // 2. resolve these props again and recreate links (3rd arg to true)
            this.resolveProp(prop, undefined, true, this)

        }


    }

    resolveProp(propName, propValue, storeLinks=true, originalWidget, originalPropName, context) {

        propValue = propValue !== undefined ? propValue : deepCopy(this.props[propName])
        originalWidget = originalWidget || this
        originalPropName = originalPropName || propName

        var variables = {},
            defaultScope = this.constructor.parsersContexts[propName] || {},
            jsScope = context || {},
            varnumber = 999

        if (typeof propValue == 'string') {

            propValue = balancedReplace('@', '{', '}', propValue, (content)=>{

                if (content.indexOf('@{') >= 0) {

                    content = balancedReplace('@', '{', '}', content, (subcontent)=>{
                        return this.resolveProp(propName + '-nested', '@{' + subcontent + '}', storeLinks ? 'nested' : false, this)
                    })

                }

                let id = content.split('.'),
                    k, subk

                if (id.length > 1) {

                    k = id.pop()
                    subk = undefined

                    if (id.length > 1) {
                        subk = k
                        k = id.pop()
                    }

                    id = id.join('.')

                } else {

                    id = id[0]
                    k = 'value'

                }

                var widgets = id == 'parent' && this.parent ?
                    [this.parent] : id == 'this' ? [this] :
                        widgetManager.getWidgetById(id)

                if (!widgets.length) {
                    var parent = this.parent
                    while (parent && parent != widgetManager) {
                        if (parent.getProp('id') == id) {
                            widgets.push(parent)
                            break
                        }
                        parent = parent.parent
                    }
                }


                // ignore clone wrapper in @parent stack (https://github.com/jean-emmanuel/open-stage-control/issues/379)
                if (widgets[0] === this.parent && this.parent !== widgetManager && this.parent.getProp('type') === 'clone') widgets = [this.parent.parent]

                if (storeLinks) {

                    if (propName.indexOf('-nested') !== -1) propName = propName.replace('-nested', '')

                    if (k == 'value') {

                        if (!this.linkedPropsValue[id]) this.linkedPropsValue[id] = []
                        if (this.linkedPropsValue[id].indexOf(propName) == -1) this.linkedPropsValue[id].push(propName)

                    } else {

                        if (!this.linkedProps[id]) this.linkedProps[id] = []
                        if (this.linkedProps[id].indexOf(propName) == -1) this.linkedProps[id].push(propName)

                    }

                    if (storeLinks === 'nested') {
                        if (!this.nestedLinkedProps[id]) this.nestedLinkedProps[id] = []
                        if (this.nestedLinkedProps[id].indexOf(propName) == -1) this.nestedLinkedProps[id].push(propName)
                    }

                }

                for (var i in widgets) {

                    if (widgets[i] === widgetManager) continue

                    if (widgets[i].props[k] !== undefined || k === 'value' || k === 'uuid') {

                        if (k !== 'value' && originalPropName === k && widgets[i] === originalWidget) {
                            return 'ERR_CIRCULAR_REF'
                        }

                        var r
                        switch (k) {
                            case 'value':
                                r = typeof widgets[i].value === 'object' ? widgets[i].value : widgets[i].getValue(true)
                                break
                            case 'uuid':
                                r = widgets[i].hash
                                break
                            case 'tabs':
                            case 'widgets':
                                r = widgets[i].props[k]
                                break
                            default:
                                r = widgets[i].resolveProp(k, undefined, storeLinks, originalWidget, originalPropName)
                                break
                        }

                        if (subk !== undefined && r !== undefined) r = r[subk]

                        var varname = 'VAR_' + varnumber
                        varnumber--

                        variables[varname] = r
                        jsScope[varname] = r

                        return varname

                    }

                }

                return 'undefined'

            })

            propValue = balancedReplace('VAR', '{', '}', propValue, (args)=>{

                if (args === '') return 'undefined'

                let [name, value] = args.split(',')
                        .map(x=>x.trim())
                        .map(x=>x.replace(/VAR_[0-9]+/g, (m)=>{
                            return typeof variables[m] === 'string' ? variables[m] : JSON.stringify(variables[m])
                        }))

                if (typeof value === 'string' && isJSON(value)) {
                    try {
                        value = JSON.parseFlex(value)
                    } catch (err) {}
                }

                if (
                    // remove quotes
                    (name[0] === '"' && name[name.length - 1] === '"') ||
                    (name[0] === '\'' && name[name.length - 1] === '\'')
                ) name = name.slice(1, name.length - 1)

                if (!this.variables[name]) {

                    this.variables[name] = {default: value, value: value, propNames: [propName]}


                } else if (!this.variables[name].propNames.includes(propName)) {

                    this.variables[name].propNames.push(propName)

                }

                // update value if default changed
                if (
                    value !== undefined &&
                    !this.variables[name].updated && // only true on edit
                    value !== this.variables[name].default
                ) {
                    this.variables[name].default = value
                    this.variables[name].value = value
                    if (this.variables[name].propNames.length > 1) {
                        this.updateProps(this.variables[name].propNames.filter(x=>x!==propName))
                    }
                }

                var r = this.variables[name].value

                var varname = 'VAR_' + varnumber
                varnumber--

                variables[varname] = r
                jsScope[varname] = r

                return varname
            })

            propValue = balancedReplace('IMPORT', '{', '}', propValue, (file)=>{

                file = file.replace(/VAR_[0-9]+/g, (m)=>{
                    return typeof variables[m] === 'string' ? variables[m] : JSON.stringify(variables[m])
                })

                if (
                    // remove quotes
                    (file[0] === '"' && file[file.length - 1] === '"') ||
                    (file[0] === '\'' && file[file.length - 1] === '\'')
                ) file = file.slice(1, file.length - 1)

                if (storeLinks) {
                    if (!this.fragments[file]) this.fragments[file] = []
                    if (!this.fragments[file].includes(propName)) this.fragments[file].push(propName)
                }
                var r
                if (sessionManager.getFragment(file)) {
                    r = sessionManager.getFragment(file)
                } else {
                    sessionManager.loadFragment(file, true)
                    r = ''
                }

                var varname = 'VAR_' + varnumber
                varnumber--

                variables[varname] = r
                jsScope[varname] = r

                return varname
            })

            propValue = balancedReplace('OSC', '{', '}', propValue, (args)=>{

                if (args === '') return 'undefined'

                let [address, value, usePreArgs] = args.split(',')
                        .map(x=>x.trim())
                        .map(x=>x.replace(/VAR_[0-9]+/g, (m)=>{
                            return typeof variables[m] === 'string' ? variables[m] : JSON.stringify(variables[m])
                        }))

                if (!address) return 'undefined'

                if (!this.oscReceivers[args]) {
                    this.oscReceivers[args] = new OscReceiver({
                        address: address,
                        value: value,
                        parent: this,
                        propName: propName,
                        usePreArgs: usePreArgs === 'false' ? false : true
                    })
                    if (oscReceiverState[args]) {
                        this.oscReceivers[args].value = oscReceiverState[args]
                        delete oscReceiverState[args]
                    }
                } else {
                    this.oscReceivers[args].setAddress(address)
                    this.oscReceivers[args].addProp(propName)
                    this.oscReceivers[args].usePreArgs = usePreArgs === 'false' ? false : true
                }

                var r = this.oscReceivers[args].value

                var varname = 'VAR_' + varnumber
                varnumber--

                variables[varname] = r
                jsScope[varname] = r

                return varname
            })

            try {
                propValue = balancedReplace('JS', '{', '}', propValue, (code)=>{

                    if (code[0] === '{' && code[code.length - 1] === '}') code = code.slice(1, code.length - 1)

                    if (!this.parsers[code]) this.parsers[code] = vm.compile(code, defaultScope)

                    let r
                    vm.setWidget(this)
                    try {
                        r = this.parsers[code](jsScope, this.parsersLocalScope)
                    } catch (err) {
                        vm.setWidget()
                        throw err
                    }
                    vm.setWidget()

                    if (r === undefined) r = ''

                    return typeof r !== 'string' ? JSON.stringify(r) : r

                })
            } catch (err) {
                this.errorProp(propName, 'JS{}', err)
            }

            try {
                propValue = balancedReplace('#', '{', '}', propValue, (code)=>{

                    if (!this.parsers[code]) this.parsers[code] = vm.compile('return ' + code.trim(), defaultScope)

                    let r
                    vm.setWidget(this)
                    try {
                        r = this.parsers[code](jsScope, this.parsersLocalScope)
                    } catch (err) {
                        vm.setWidget()
                        throw err
                    }
                    vm.setWidget()

                    if (r === undefined) r = ''

                    return typeof r !== 'string' ? JSON.stringify(r) : r

                })
            } catch (err) {

                this.errorProp(propName, '#{}', err)
            }

            for (let k in variables) {
                var v = typeof variables[k] === 'string' ? variables[k] : JSON.stringify(variables[k])
                propValue = propValue.replace(new RegExp(k, 'g'), v)
            }

            if (isJSON(propValue) && (propName !== 'label' || propValue === 'false')) {
                try {
                    propValue = JSON.parse(propValue)
                } catch (err) {}
            }

        } else if (propValue != null && typeof propValue == 'object') {
            for (let k in propValue) {
                propValue[k] = this.resolveProp(propName, propValue[k], storeLinks, originalWidget, originalPropName, context)
            }
        }

        return propValue


    }

    getProp(propName) {
        return this.cachedProps[propName]
    }


    isDynamicProp(propName) {

        return this.constructor.dynamicProps.indexOf(propName) !== -1

    }

    updateProps(propNames, widget, options, updatedProps = []) {

        if (propNames.includes('value')) {
            propNames.splice(propNames.indexOf('value'), 1)
            propNames.push('value')
        }

        if (widget && options) options.id = widget.getProp('id')

        var reCreate = false,
            changedProps = []

        for (var propName of propNames) {

            if (widget === this && updatedProps.includes(propName)) continue

            let propValue = this.resolveProp(propName, undefined, false),
                oldPropValue = this.getProp(propName)

            if (!deepEqual(oldPropValue, propValue)) {

                if (!this.isDynamicProp(propName)) {

                    if (this.constructor._defaults[propName] === undefined) {

                        // ignore invalid properties
                        continue

                    } else if (widget && this.contains(widget)) {

                        this.errorProp(propName, '@{}', `a container can't use its child's properties to define non-dynamic properties.`)
                        continue

                    } else if (widget === this && updatedProps.length === 1 && updatedProps[0] === 'value') {

                        this.errorProp(propName, '@{}', `a widget can't use it's own value to define non-dynamic properties.`)
                        continue

                    } else {

                        reCreate = true
                        break

                    }

                } else {

                    changedProps.push({propName, propValue, oldPropValue})

                }


            }
        }

        if (reCreate) {

            return this.reCreateWidget({reCreateOptions: options})

        }


        if (changedProps.length) {

            for (var i in changedProps) {
                this.cachedProps[changedProps[i].propName] = changedProps[i].propValue
                this.onPropChanged(changedProps[i].propName, options, changedProps[i].oldPropValue)
            }

            widgetManager.trigger('prop-changed', {
                id: this.getProp('id'),
                props: changedProps,
                widget: this,
                options: options
            })

        }

        if (options && options.fromEditor) {

            // update advanced syntax bindings if its an edition
            if (this.checkLinkedProps(propNames)) {

                // emit prop-changed event if not already
                // to make sure an advanced syntax changes don't go unnoticed by clone
                var unNotified = propNames.filter(n => !changedProps.includes(n))
                widgetManager.trigger('prop-changed-maybe', {
                    id: this.getProp('id'),
                    props: unNotified,
                    widget: this,
                    options: options
                })
            }

        }

    }

    onPropChanged(propName, options={}, oldPropValue) {

        switch(propName) {

            case 'value':
                this.setValue(this.getProp('value'), {sync: true, send: options.send, id: options.id})
                return

            case 'top':
            case 'left':
                this.setContainerStyles(['geometry'])
                return

            case 'height':
            case 'width':
            case 'expand': {
                this.setContainerStyles(['geometry'])
                let container = this.parent !== widgetManager && this.parent.getProp('layout') !== 'default' ? this.parent.container : this.container
                resize.check(container)
                if (uiDragResize.mounted && uiDragResize.widgets.includes(this)) uiDragResize.updateRectangle()
                return
            }

            case 'visible': {
                this.setVisibility()
                let container = this.parent !== widgetManager && this.parent.getProp('layout') !== 'default' ? this.parent.container : this.container
                resize.check(container)
                uiTree.updateVisibility(this)
                return
            }

            case 'interaction':
                this.container.classList.toggle('no-interaction', !this.getProp('interaction'))
                return

            case 'html':
                this.updateHtml()
                resize.check(this.container)
                return

            case 'css': {
                this.setContainerStyles(['css'])
                var re = /width|height|display|margin|padding|flex/
                if (re.test(oldPropValue) || re.test(this.getProp('css'))) {
                    let container = this.parent !== widgetManager && this.parent.getProp('layout') !== 'default' ? this.parent.container : this.container
                    resize.check(container)
                    if (uiDragResize.mounted && uiDragResize.widgets.includes(this)) uiDragResize.updateRectangle()
                }
                return
            }

            case 'colorText':
            case 'colorWidget':
            case 'colorFill':
            case 'colorStroke':
            case 'alphaStroke':
            case 'alphaFillOff':
            case 'alphaFillOn':
            case 'lineWidth':
            case 'padding':
                this.setCssVariables()
                return

            case 'decimals':
                this.decimals = Math.min(20, Math.max(this.getProp('decimals'), 0))
                return

            case 'address':
            case 'preArgs':
            case 'typeTags':
            case 'target':
                if (propName === 'address') {
                    for (var k in this.oscReceivers) {
                        var receiver = this.oscReceivers[k]
                        if (receiver.prefix !== '') {
                            receiver.setAddress()
                        }
                    }
                }
                var data = {},
                    oldData = {
                        preArgs: propName == 'preArgs' ? oldPropValue : this.getProp('preArgs'),
                        address: propName == 'address' ? oldPropValue : this.getProp('address')
                    }
                data[propName] = this.getProp(propName)

                if (data.address === 'auto')  data.address = '/' + this.getProp('id')
                if (oldData.address === 'auto')  oldData.address = '/' + this.getProp('id')

                widgetManager.registerWidget(this, data, oldData)
                return

        }

    }


    log(message) {

        if (!uiConsole) return

        var widget = this,
            id = widget.getProp('id')

        console._log(`${id}${name ? '.' + name : ''}: ${message}`)
        uiConsole.log('log', `<span class="edit-widget" data-widget="${widget.builtIn ? widget.parent.hash : widget.hash}">${id}</span>: ${message}`, true)

    }

    errorProp(name, type, error) {

        let stackline = error.stack ? (error.stack.match(/>:([0-9]+):[0-9]+/) || '') : '',
            line = stackline.length > 1 ? ' at line ' + (parseInt(stackline[1]) - (type.includes('{}') ? 1 : 2)) : '',
            id = this.getProp('id') || this.props.id,
            widget = this // used for edit link in console

        while (widget._not_editable && widget.parent !== widgetManager) {
            // ignore non editable
            widget = widget.parent
        }

        // ignore clone wrapper
        if (widget.parent !== widgetManager && widget.parent.getProp('type') === 'clone') widget = widget.parent

        console._error(`${id}${name ? '.' + name : ''} ${type} error${line}: ${error}`)
        console.debug(error)
        uiConsole.log('error', `<span class="edit-widget" data-widget="${widget.builtIn ? widget.parent.hash : widget.hash}">${id}</span>${name ? '.' + name : ''} ${type} error${line}: ${error}`, true)
    }

    setContainerStyles(styles = ['geometry', 'css', 'visibility']) {

        if (styles.includes('geometry')) {

            // geometry
            var absolutePos = false
            for (let d of ['width', 'height', 'top', 'left']) {
                let val = this.getProp(d),
                    geometry

                if (val !== undefined) {
                    if (parseFloat(val) < 0) val = 0
                    geometry = parseFloat(val) == val ? parseFloat(val)+'rem' : val
                }

                if (geometry) {
                    if (geometry === 'auto') geometry = ''
                    this.container.style[d] = geometry
                    if (d === 'width') this.container.style.minWidth = geometry
                    if (d === 'height') this.container.style.minHeight = geometry
                    absolutePos = absolutePos || geometry && (d === 'top' || d === 'left')

                }
            }
            this.container.classList.toggle('absolute-position', absolutePos)
            this.container.classList.toggle('flex-expand', this.getProp('expand'))


        }

        if (styles.includes('css')) {

            // css
            var css = String(this.getProp('css')),
                extraCssClasses = []

            // extra css "class" property
            css = css.replace(/^[^\S\n]*class[^\S\n]*:[^\S\n]*([^;\n\s]+);?/igm, (m, c)=>{
                if (c === 'widget' || c.includes('-container')) return m
                extraCssClasses.push(c.replace(/"'/g,''))
                return ''
            })


            // escape windows absolute file paths
            css = css.replace(/url\(([^)]*)\)/g, (m, url)=>{
                var parser = urlParser(url)
                if (!parser.protocol.match(/http|data/)) m = m.replace(':', '_:_')
                m = m.replace(/\\/g, '\\\\')
                return m
            })


            var prefix = '#' + this.hash,
                scopedCss = '',
                unScopedCss = ''

            if (css.includes('{')) {

                scopedCss = scopeCss(css, prefix)

                css
                .replace(/\{[^}]*\}/g, '')
                .replace(/^[^@#.]*:.*/gm, (m)=>{
                    unScopedCss += m[m.length - 1] === ';' ? m : m + ';'
                })

                if (scopedCss.indexOf('@keyframes') > -1) scopedCss = scopedCss.replace(new RegExp(prefix + '\\s+([0-9]+%|to|from)', 'g'), ' $1')
                if (scopedCss.indexOf('&') > -1) scopedCss = scopedCss.replace(new RegExp(prefix + '\\s&', 'g'), prefix)

            } else {

                unScopedCss = css

            }




            var style = (unScopedCss ? prefix + '{' + unScopedCss + '}\n' : '') + scopedCss
            style = style.trim()

            if (this.style && this.container.contains(this.style)) {
                if (style) this.style.innerText = style
                else this.container.removeChild(this.style)
            } else if (scopedCss.length || unScopedCss.length){
                this.style = html`<style>${style}</style>`
                this.container.insertBefore(this.style, this.container.childNodes[0] || null)
            }


            // apply extra css classes
            if (!deepEqual(extraCssClasses, this.extraCssClasses)) {
                if (this.extraCssClasses && this.extraCssClasses.length) {
                    this.container.classList.remove(...this.extraCssClasses)
                    this.extraCssClasses = []
                }

                if (extraCssClasses.length) {
                    this.container.classList.add(...extraCssClasses)
                    this.extraCssClasses = extraCssClasses
                }
            }


            // store transform matrix if any
            // if (css.includes('transform')) {
            //     setTimeout(()=>{
            //         var style = window.getComputedStyle(this.container)
            //         this.cssTransform = style.transform || 'none'
            //         this.cssTransformOrigin = style.transformOrigin
            //     })
            // } else {
            //     this.cssTransform = 'none'
            // }


        }

    }

    setCssVariables() {


        for (var data of this.constructor.cssVariables) {

            var val = this.getProp(data.js)
            this.container.style.setProperty(data.css, val !== undefined && val !== 'auto' ? data.toCss ? data.toCss(val) : val : '')

        }

    }

    updateHtml(){

        var extraHtml = this.getProp('html') !== '' ? sanitizeHtml(this.getProp('html'), Widget.sanitizeHtmlOptions) : null

        if (this.extraHtml) {
            if (!extraHtml) {
                this.container.removeChild(this.extraHtml)
                this.extraHtml = null
            } else {
                let newHtml = html`<div class="html"></div>`
                newHtml.innerHTML = extraHtml
                morph(this.extraHtml, newHtml)
            }

        } else if (extraHtml) {
            let newHtml = html`<div class="html"></div>`
            newHtml.innerHTML = extraHtml
            this.container.insertBefore(newHtml, this.widget)
            this.extraHtml = newHtml
        }

    }

    isVisible() {

        return this.getProp('visible') && this.parent.isVisible()

    }

    setVisibility() {

        var visible = this.isVisible()

        if (visible !== this.visible) {
            this.visible = !!visible
            this.container.style.display = this.visible ? '' : 'none'

            for (var c of this.children) {
                if (c) c.setVisibility()
            }

        }

    }

    reCreateWidget(options={}){

        if (!this.removed) return updateWidget(this, options)

    }

    onRemove(){

        for (var k in this.scripts) {
            this.scripts[k].onRemove()
        }

        this.removed = true
        for (var name in this._listeners) {
            if (name !== 'widget-removed') this.off(name)
        }

        widgetManager.off(undefined, undefined, this)
        sessionManager.off(undefined, undefined, this)
        this.removeOscReceivers()

    }

}

Widget.sanitizeHtmlOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']).filter(x=>x!=='iframe'),
    allowedAttributes: {
        '*': [ 'title', 'class', 'style', 'name'],
        'img': [ 'src' ,  'title', 'class', 'style', 'width', 'height'],
        'a': ['href', 'target']
    },
    transformTags: {
        'a': sanitizeHtml.simpleTransform('a', {target: '_blank'})
    }
}

Widget.parsersContexts = {}

Widget.cssVariables = [
    {js: 'colorBg', css: '--color-background'},
    {js: 'colorWidget', css: '--color-widget'},
    {js: 'colorFill', css: '--color-fill'},
    {js: 'colorStroke', css: '--color-stroke'},
    {js: 'colorText', css: '--color-text'},
    {js: 'padding', css: '--widget-padding', toCss: x=>parseFloat(x) + 'rem', toJs: x=>parseFloat(x) * PXSCALE},
    {js: 'lineWidth', css: '--line-width', toCss: x=>parseFloat(x) + 'rem', toJs: x=>parseFloat(x) * PXSCALE},
    {js: 'borderRadius', css: '--border-radius', toCss: x=>parseFloat(x) == x ? x  + 'rem' : x, toJs: x=>parseFloat(x)},
    {js: 'alphaFillOn', css: '--alpha-fill-on', toCss: x=>parseFloat(x), toJs: x=>parseFloat(x)},
    {js: 'alphaFillOff', css: '--alpha-fill-off', toCss: x=>parseFloat(x), toJs: x=>parseFloat(x)},
    {js: 'alphaStroke', css: '--alpha-stroke', toCss: x=>parseFloat(x), toJs: x=>parseFloat(x)},
]

Widget.dynamicProps = [
    'visible',
    'interaction',
    'comments',

    'top',
    'left',
    'height',
    'width',
    'expand',


    'colorText',
    'colorWidget',
    'colorFill',
    'colorStroke',
    'alphaStroke',
    'alphaFillOff',
    'alphaFillOn',
    'padding',
    'lineWidth',
    'html',
    'css',

    'value',

    'decimals',
    'address',
    'preArgs',
    'typeTags',
    'target',
    'bypass'
]

module.exports = Widget
