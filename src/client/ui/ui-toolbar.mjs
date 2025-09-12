import UiWidget from './ui-widget'
import ContextMenu from './context-menu'

class UiToolbar extends UiWidget {

    constructor(options) {

        super(options)

        this.menu = new ContextMenu({
            position: options.position
        })
        this.opened = false
        this.entries = options.entries

        this.menu.bindShortcuts(this.entries)

        this.container.addEventListener('fast-click', (e)=>{
            if (this.opened) this.close()
            else this.open(e)
        })

        this.menu.on('close', ()=>{
            setTimeout(()=>{
                this.opened = false
                this.toggleState()
            })
        })

    }

    open(e) {

        if (this.opened) return
        this.menu.open(e.detail, this.entries)

        this.opened = true
        this.toggleState()


    }

    close() {

        if (this.opened) return

        this.menu.close()

        this.opened = false
        this.toggleState()

    }

    toggleState() {

        this.container.classList.toggle('on', this.opened)

    }

}


export default UiToolbar
