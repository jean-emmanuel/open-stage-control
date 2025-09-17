import {DOM} from '../globals.mjs'

// Prevent iOS Pull-To-Refresh

var iOS13 = (
        navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 // safari iPad
        || navigator.userAgent.match(/iPhone OS (1[3-9])/) // iPhone
        || navigator.userAgent.match(/i(Pad|Phone); CPU OS 1[3-9]/) // chrome iPad
    ) ? 13 : 0,
    iOS = iOS13 || navigator.platform.match(/iPhone|iPod|iPad/)

if (iOS && !iOS13) {

    // prevent overscroll
    // breaks scrolling on iOS13 (besides it doesn't seem to be needed)

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

if (iOS13) document.body.classList.add('iOS13')

export default iOS
