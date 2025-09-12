import screenfull from 'screenfull'
import UiModal from './ui-modal.mjs'
import locales from '../locales/index.mjs'
import iOS from './ios.mjs'

var fullscreen

if (screenfull.isEnabled && !iOS) {

    fullscreen = screenfull

} else {

    class IOSFullScreen {

        constructor(){

            this.enabled = !navigator.standalone
            this.isFullScreen = navigator.standalone

        }

        toggle(){

            new UiModal({
                title: locales('fullscreen_unnavailable'),
                content: locales('fullscreen_addtohome'),
                closable: true
            })

        }

        on(){}

    }

    fullscreen = new IOSFullScreen()

}

window.ELECTRON_FULLSCREEN = ()=>{fullscreen.toggle()}

export default fullscreen
