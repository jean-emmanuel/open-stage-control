import loopProtect from 'loop-protect'
import {deepCopy} from '../utils'

var sessionManager
;(async ()=>{
    sessionManager = (await import('../managers/session')).default
})()


var globals

class Vm {

    constructor() {

        this.widget = []

        if (!globals) {
            var sessionManager
            globals = {
                screen: {
                    get width() {return screen.width},
                    get height() {return screen.height},
                    get orientation() {
                        return (screen.orientation || {}).type || window.orientation
                    }
                },
                env: deepCopy(ENV),
                ip: IP,
                url: document.location.host,
                platform: navigator.platform,
                clipboard: navigator.clipboard,
                get session() {
                    return sessionManager.sessionPath
                }
            }
        }

        this.sandbox = document.createElement('iframe')
        this.sandbox.style.display = 'none'
        this.sandbox.sandbox = 'allow-same-origin'

        // attach sandbox
        document.documentElement.appendChild(this.sandbox)

        // sandboxed function prototype
        this.safeFunctionProto = this.sandbox.contentWindow.Function

        // block requests
        this.sandbox.contentWindow.document.open()
        this.sandbox.contentWindow.document.write('<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-eval\';">')
        this.sandbox.contentWindow.document.close()

        // init infinite loop guard
        loopProtect.alias = '__protect'
        loopProtect.hit = function(line){
            throw 'Potential infinite loop found on line ' + line + '(script interrupted).\nAdd "// noprotect" to your code to disable loop protection.'
        }
        this.sandbox.contentWindow.__protect = loopProtect

        // global context
        this.registerGlobals()

        // detach sandbox
        document.documentElement.removeChild(this.sandbox)

    }

    setWidget(widget) {

        if (!widget) this.widget.pop()
        else this.widget.push(widget)

    }

    getWidget() {

        return this.widget[this.widget.length - 1]

    }

    registerGlobals() {

        this.sandbox.contentWindow.console = {
            ...console,
            log: (...msg)=>{
                msg = msg.map(m => typeof m == 'object' ? JSON.stringify(m) : m)
                this.getWidget().log(msg.join(' '))
            }
        }

        this.sandbox.contentWindow.setTimeout =
        this.sandbox.contentWindow.setInterval = ()=>{
            throw 'setTimeout and setInterval can\'t be used in the JS sandbox'
        }
        this.sandbox.contentWindow.globals = globals

        // sanitize globals
        for (var imports of ['__protect', 'console', 'setTimeout', 'setInterval', 'globals']) {
            this.sanitize(this.sandbox.contentWindow[imports])
        }

    }

    sanitize(object) {

        // non-primitives created outside the sandbox context can leak
        // the host window object... let's nuke that !
        // (we only nuke functions and objects/arrays because we don't pass anything else)
        var t = typeof o
        if (t === 'function' || (t === 'object' && o !== null)) {
            if (o.__proto__) {
                if (t === 'function') {
                    o.__proto__.constructor = this.safeFunctionProto
                } else {
                    o.__proto__.constructor.constructor = this.safeFunctionProto
                }
            }
            for (var k in o) {
                this.sanitize(o[k])
            }
        }

    }

    compile(code, defaultContext) {

        if (typeof code !== 'string') code = String(code)

        // var contextInit = 'var locals = locals;',
        var contextInit = '',
            contextKeys = ['__VARS'],
            contextValues = [{}]

        // detached context + reading global navigator == crash electron
        if (code.indexOf('navigator') !== -1) {
            contextInit += 'var navigator;'
        }

        if  (defaultContext) {
            for (var k in defaultContext) {
                contextInit += `var ${k} = ${k} === undefined ? ${JSON.stringify(defaultContext[k])} : ${k};`
                contextKeys.push(k)
                contextValues.push(defaultContext[k])
            }
        }

        var compiledCode = new this.safeFunctionProto(
            ...contextKeys, 'locals',
            loopProtect('"use strict";' + contextInit + code)
                .replace(/;\n(if \(__protect.*break;)\n/g, ';$1') // prevent loop protect from breaking stack linenumber
                .replace(/(VAR_[0-9]+)/g, '__VARS.$1')
        )


        return (context, locals)=>{

            var __contextValues = deepCopy(contextValues)
            var __VARS = __contextValues[0]
            for (var k in context) {
                var index = contextKeys.indexOf(k)
                if (index !== -1) {
                    __contextValues[index] = context[k]
                } else {
                    __VARS[k] = context[k]
                }
            }

            __contextValues.push(locals)

            this.sanitize(__contextValues)

            return compiledCode.apply('this', __contextValues)

        }

    }

}

export default Vm
