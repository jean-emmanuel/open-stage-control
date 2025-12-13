import {deepCopy} from '../utils.mjs'
import {ENV, IP} from '../globals.mjs'

var sessionManager
setTimeout(async()=>{
    // use setTimeout to fix init order in safari...
    sessionManager = (await import('../managers/session/index.mjs')).default
})


var globals

class Vm {

    constructor() {

        this.widget = []

        if (!globals) {
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

    }

    compile(code, defaultContext) {

        if (typeof code !== 'string') code = String(code)

        // var contextInit = 'var locals = locals;',
        var contextInit = '"use strict";',
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

        code = contextInit + code.replace(/(VAR_[0-9]+)/g, '__VARS.$1')

        var compiledCode = new this.safeFunctionProto(...contextKeys, 'locals', code)

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

            return compiledCode.apply('this', __contextValues)

        }

    }

}

export default Vm
