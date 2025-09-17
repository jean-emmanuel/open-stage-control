import raw from 'nanohtml/raw'
import fastdom from 'fastdom'
import osc from '../osc.mjs'
import session from '../managers/session/index.mjs'
import widgetManager from '../managers/widgets.mjs'
import state from '../managers/state.mjs'
import editor from '../editor/index.mjs'
import locales from '../locales/index.mjs'
import UiModal from '../ui/ui-modal.mjs'
import uiLoading from '../ui/ui-loading.mjs'
import notifications from '../ui/notifications'
import * as backup from '../backup.mjs'
import {updateMobileThemeColor, icon} from '../ui/utils.mjs'
import {CLIENT_SYNC, DOM, ENV, TITLE, setGRIDWIDTH_CSS} from '../globals.mjs'

export default {

    bundle: function(data) {
        for (let i in data) {
            osc.receive(data[i])
        }
    },

    receiveOsc: function(data){
        osc.receive(data)
    },

    connected:function(){
        uiLoading(false)
    },

    sessionOpen: function(data){

        session.open(data)

    },

    sessionNew: function(){

        session.create()

    },

    sessionSaved: function(data){

        editor.unsavedSession = false

    },

    fragmentLoad: function(data){

        session.setFragment(data)

    },

    stateLoad: function(data){

        state.load(data.state, data.send, data.path)

    },

    stateSend:function(){

        if (!CLIENT_SYNC) return

        notifications.add({
            icon: 'wifi',
            class: 'client-connected',
            message: locales('loading_newclient')
        })

        setTimeout(function(){

            osc.syncOnly = true
            state.send()
            osc.syncOnly = false

        },200)

    },

    editorDisable: function(data){

        editor.disable(data.permanent)

    },

    error: function(data){
        new UiModal({title: raw(icon('exclamation-triangle') + '&nbsp; ' + locales('error')), content: raw(data), closable:true})
    },

    errorLog: function(data) {

        console.error(data)

    },

    reloadCss: function(){
        var queryString = '?__OSC_ASSET__=1&reload=' + Date.now()
        var sheets = DOM.get(document, 'link[rel="stylesheet"][hot-reload]')
        var loaded = 0

        for (let stylesheet of sheets) {
            stylesheet.href = stylesheet.href.replace(/\?.*|$/, queryString)

            // use image hack to catch stylesheet load event
            let img = document.createElement('img')
            document.body.appendChild(img)

            img.onerror = img.onload = ()=>{
                img.onerror = img.onload = null
                document.body.removeChild(img)

                if (++loaded === sheets.length) {
                    var root = widgetManager.getWidgetById('root')[0]
                    if (root) root.onPropChanged('colorWidget')
                    fastdom.measure(()=>{
                        setGRIDWIDTH_CSS(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-width')))
                        fastdom.mutate(()=>{
                            editor.toggleGrid()
                            editor.toggleGrid()
                        })
                    })
                    updateMobileThemeColor(root)
                }
            }

            img.src = stylesheet.href


        }

    },

    reload: function(){

        backup.save()
        editor.unsavedSession = false
        window.location.href = window.location.href

    },

    notify: function(data) {

        var message = data.message || ''

        if (data.locale) message = locales(data.locale) + message

        notifications.add({
            icon: data.icon,
            class: data.class,
            message: message
        })

    },

    setTitle: function(data) {

        if (ENV.title) return

        document.title = TITLE + (data ? ' (' + data + ')' : '')

    },

    serverTargets: function(data) {

        if (data) osc.serverTargets = data

    }

}
