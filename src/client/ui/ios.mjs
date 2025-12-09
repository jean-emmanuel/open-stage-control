import {DOM} from '../globals.mjs'
import {device, os} from './utils.mjs'


iOS = (device.is('mobile') || device.is('tablet')) && os.is('ios')

// Prevent iOS Pull-To-Refresh

if (iOS && parseInt(os.version.split('.')[0]) < 13) {

    // prevent overscroll
    // breaks scrolling on iOS <= 13 (besides it doesn't seem to be needed)

    var supportsPassiveOption = false
    try {
        document.createElement('div').addEventListener('test', function() {}, {
            get passive() {
                supportsPassiveOption = true
                return false
            }
        })
    } catch(e) {}

    iOS = true

    var preventNextMove = false

    document.addEventListener('touchstart', (e)=>{
        if (e.touches.length === 1 && !e.target._drag_widget) preventNextMove = true
    }, supportsPassiveOption ? {passive: false} : false)

    document.addEventListener('touchmove', (e)=>{
        // preventDefault the first overscrolling touchmove
        if (preventNextMove) {
            preventNextMove = false
            e.preventDefault()
        }
    }, supportsPassiveOption ? {passive: false} : false)


}

if (iOS) {
    // when waking from sleep, iOS may have trouble rendering the session properly
    // this attempts to force a full redraw by shortly resizing the main container
    document.onvisibilitychange = ()=>{
        if (document.visibilityState === 'visible') {
            var main = DOM.get('osc-panel-container#main')[0]
            main.style.marginBottom = '1px'
            main.style.marginRight = '1px'
            setTimeout(()=>{
                main.style.marginBottom = ''
                main.style.marginRight = ''
            })
        }
    }
}

export default iOS
