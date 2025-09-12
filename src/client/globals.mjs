import json5 from 'json5'
import pkg from '../../package.json'
import * as dom from './dom'

window.IP = window.IP || ''
window.ENV = window.ENV || {}
location.search.replace(/[?&]+([^=&j]+)=([^&]*)/gi, (s,k,v)=>{
    ENV[k]=v
})
for (var k in ENV) {
    ENV[k.toLowerCase()] = ENV[k]
}

window.LANG = ENV.lang === 'debug' ? 'debug' : (ENV.lang || navigator.language || '').substr(0, 2).toLowerCase()

window.PACKAGE = pkg

window.LOADING = null

window.READ_ONLY = window.READ_ONLY || false
window.KIOSK = window.KIOSK || false
window.GRIDWIDTH_CSS = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-width'))
window.GRIDWIDTH = GRIDWIDTH_CSS



window.ELECTRON_NOGPU = false
window.CANVAS_FRAMERATE = parseFloat(ENV.framerate || 60)
window.CANVAS_SCALING = parseFloat(ENV.forcehdpi) || ( ENV.hdpi ? window.devicePixelRatio : 1 )
window.INITIALZOOM = ENV.zoom ? parseFloat(ENV.zoom) : 1
window.PXSCALE = INITIALZOOM
document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

window.DOUBLE_TAP_TIME = ENV.doubletap ? parseInt(ENV.doubletap) : 375

window.CLIENT_SYNC = parseInt(ENV.clientSync) !== 0

window.TOGGLE_ALT_TRAVERSING = !!ENV.altTraversing

window.VIRTUAL_KEYBOARD = !!ENV.virtualKeyboard

window.FOCUSABLE = !ENV.noFocus
if (!FOCUSABLE) console.debug('ELECTRON.SETFOCUSABLE(0)')
else console.debug('ELECTRON.SETFOCUSABLE(1)')

window.JSON.parseFlex = json5.parse

window.DOM = dom

window.TITLE = ENV.title || (PACKAGE.productName + ' v' + PACKAGE.version)
