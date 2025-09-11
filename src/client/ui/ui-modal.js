import UiWidget from './ui-widget'
import {icon} from './utils'
import html from 'nanohtml/lib/browser'
import raw from 'nanohtml/raw'

var MODAL_SINGLETON = null,
    MODAL_CONTAINER = null

class UiModal extends UiWidget {

    constructor(options) {

        super(options)

        if (!MODAL_CONTAINER) MODAL_CONTAINER = DOM.get('osc-modal-container')[0]

        if (options.closable) {

            if (MODAL_SINGLETON) MODAL_SINGLETON.close()
            MODAL_SINGLETON = this

        }

        this.escKey = options.closable || options.escKey
        this.enterKey = options.enterKey
        this.state = 0

        this.container = html`
           <div class="popup show">
               <div class="popup-wrapper">
                   <div class="popup-title ${options.closable? 'closable' : ''}">
                       <span class="title">
                           ${options.icon ? raw(icon(options.icon)) : ''}
                           ${options.title}
                       </span>
                       ${options.closable? html`<span class="closer">${raw(icon('times'))}</span>` : ''}
                       </div>
                   <div class="popup-content ${options.html ? 'html' : 'message'}">
                       ${options.content}
                   </div>
               </div>
           </div>
       `

        if (options.width) this.container.style.setProperty('--width', options.width + 'rem')
        if (options.height) this.container.style.setProperty('--height', options.height + 'rem')

        if (options.closable) {
            var closer = DOM.get(this.container, '.popup-title .closer')[0]
            this.container.addEventListener('fast-click',(e)=>{
                if (e.target === this.container || e.target === closer) {
                    e.detail.preventOriginalEvent = true
                    this.close()
                }
            })
        }

        if (this.escKey) {
            this.escKeyHandler = ((e)=>{
                if (e.key == 'Escape') this.close()
            }).bind(this)
        }

        if (this.enterKey) {
            this.enterKeyHandler = ((e)=>{
                if (e.key == 'Enter') this.enterKey.call(this, e)
            }).bind(this)
        }

        if (!options.hide) this.open()


    }



    close() {

        if (!this.state) return
        this.state = 0

        if (this.escKey) document.removeEventListener('keydown', this.escKeyHandler)
        if (this.enterKey) document.removeEventListener('keydown', this.enterKeyHandler)

        MODAL_CONTAINER.removeChild(this.container)

        this.trigger('close')

    }

    open() {

        if (this.state) return
        this.state = 1

        if (this.escKey) document.addEventListener('keydown', this.escKeyHandler)
        if (this.enterKey) document.addEventListener('keydown', this.enterKeyHandler)

        MODAL_CONTAINER.appendChild(this.container)

        this.trigger('open')
    }

}

export default UiModal
