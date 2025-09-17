import json5 from 'json5'
import pkg from '../../package.json'
import * as dom from './dom.mjs'

export var IP = window.IP || ''
export var ENV = window.ENV || {}
location.search.replace(/[?&]+([^=&j]+)=([^&]*)/gi, (s,k,v)=>{
    ENV[k]=v
})
for (var k in ENV) {
    ENV[k.toLowerCase()] = ENV[k]
}

export var LANG = ENV.lang === 'debug' ? 'debug' : (ENV.lang || navigator.language || '').substr(0, 2).toLowerCase()

export var PACKAGE = pkg

export var LOADING = null

export var READ_ONLY = window.READ_ONLY || false
export var KIOSK = window.KIOSK || false
export var GRIDWIDTH_CSS = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-width'))
export function setGRIDWIDTH_CSS(x) {GRIDWIDTH_CSS = x}
export var GRIDWIDTH = GRIDWIDTH_CSS
export function setGRIDWIDTH(x) {GRIDWIDTH = x}






export var ELECTRON_NOGPU = false
export var CANVAS_FRAMERATE = parseFloat(ENV.framerate || 60)
export var CANVAS_SCALING = parseFloat(ENV.forcehdpi) || ( ENV.hdpi ? window.devicePixelRatio : 1 )
export var INITIALZOOM = ENV.zoom ? parseFloat(ENV.zoom) : 1
export var PXSCALE = INITIALZOOM
export function setPXSCALE(x) {PXSCALE = x}
document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

export var DOUBLE_TAP_TIME = ENV.doubletap ? parseInt(ENV.doubletap) : 375

export var CLIENT_SYNC = parseInt(ENV.clientSync) !== 0

export var TOGGLE_ALT_TRAVERSING = !!ENV.altTraversing

export var VIRTUAL_KEYBOARD = !!ENV.virtualKeyboard
export function setVIRTUAL_KEYBOARD(x) {
    VIRTUAL_KEYBOARD = x
}

export var FOCUSABLE = !ENV.noFocus
if (!FOCUSABLE) console.debug('ELECTRON.SETFOCUSABLE(0)')
else console.debug('ELECTRON.SETFOCUSABLE(1)')
export function setFOCUSABLE(x) {FOCUSABLE = x}


export var JSON5 = json5

export var DOM = dom

export var TITLE = ENV.title || (PACKAGE.productName + ' v' + PACKAGE.version)
