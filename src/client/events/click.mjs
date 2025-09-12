import iOS from '../ui/ios'
import editor from '../editor'

const macOs = (navigator.platform || '').match('Mac')

var longTouchTimer = false,
    clearLongTouchTimer = function() {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer)
            longTouchTimer = false
        }
    }

if (macOs) {
    // on macOs, ctrl+click generates a contextmenu event
    // that should be interpreted as a rightclick
    document.body.addEventListener('contextmenu', (event)=>{
        event.preventDefault()
        DOM.dispatchEvent(event.target, 'fast-right-click', event)
    })
} else {
    document.body.addEventListener('contextmenu', (event)=>{
        if (
            event.target &&
            !event.target.classList.contains('ace_content') &&
            !event.target.tagName.match(/INPUT|TEXTAREA|OSC-CONSOLE|OSC-CONSOLE-MESSAGE/)
        ) event.preventDefault()
    })
}

function mouseToFastClick(event) {

    if (event.pointerType === 'touch') return
    if (event.button == 2) event.preventDefault()

    var e = event

    var name = event.button == 2 ? 'fast-right-click' : 'fast-click'

    DOM.dispatchEvent(e.target, name, e)

    if (!FOCUSABLE && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        console.debug('ELECTRON.BLUR()')
    }

}

function touchToFastClick(event) {

    var e = event.changedTouches[0]

    e.shiftKey = event.shiftKey
    e.ctrlKey = event.ctrlKey

    DOM.dispatchEvent(e.target, 'fast-click', e)

    if (e.preventOriginalEvent) event.preventDefault()

    longTouchTimer = setTimeout(()=>{

        var off = DOM.offset(e.target)

        e.offsetX = e.pageX - off.left
        e.offsetY = e.pageY - off.top

        DOM.dispatchEvent(e.target, 'fast-right-click', e)

        clearLongTouchTimer()

    }, 600)

    if (ENV.nofocus && !editor.enabled && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA'  && e.target.tagName !== 'SELECT') {
        console.debug('ELECTRON.BLUR()')
    }

}

if (!iOS) document.addEventListener('pointerdown', mouseToFastClick, true)
document.addEventListener('touchstart', touchToFastClick, {passive: false, capture: true})


DOM.addEventListener(document, 'touchend touchmove touchcancel', clearLongTouchTimer)
