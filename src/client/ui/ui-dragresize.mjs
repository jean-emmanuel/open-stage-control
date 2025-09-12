import html from 'nanohtml'
import fastdom from 'fastdom'
import keyboardJS from 'keyboardjs/dist/keyboard.min.js'
import UiWidget from './ui-widget.mjs'

var Tab, Root, Folder
;(async()=>{
    Tab = (await import('../widgets/containers/tab.mjs')).default
    Root = (await import('../widgets/containers/root.mjs')).default
    Folder = (await import('../widgets/containers/folder.mjs')).default
})()

class UiDragResize extends UiWidget {

    constructor(options) {

        super(options)

        this.container = html`
            <div id="drag-resize">
                <div class="helper"></div>
                <div class="no-widget-select handle nw" data-action="left,top"></div>
                <div class="no-widget-select handle e" data-action="width"></div>
                <div class="no-widget-select handle s" data-action="height"></div>
                <div class="no-widget-select handle se" data-action="width,height"></div>
            </div>
        `


        this.initLeft = 0
        this.initTop = 0
        this.initWidth = 0
        this.initHeight = 0

        this.left = 0
        this.top = 0
        this.width = 0
        this.height = 0

        this.widgets = []
        this.mounted = false

        this.handles = DOM.get(this.container, '.handle')
        this.dragging = null
        this.copying = null
        this.shiftKey = false

        this.on('draginit', (event)=>{

            var node = event.firstTarget
            if ((event.shiftKey && !event.altKey) || !this.handles.includes(node)) return

            this.initLeft = this.left
            this.initTop = this.top
            this.initWidth = this.width
            this.initHeight = this.height
            this.matrix = ''

            this.container.classList.add('dragging')
            this.dragging = node.getAttribute('data-action').split(',')
            delete event.traversingStack
            delete event.traversing

        }, {element: this.container})

        this.on('drag', (event)=>{

            if (!this.dragging) return

            for (var k of this.dragging) {

                switch (k) {
                    case 'left':
                    case 'width':
                        this[k] += event.movementX / PXSCALE
                        break
                    case 'top':
                    case 'height':
                        this[k] += event.movementY / PXSCALE
                        break

                }

            }

            this.updateCss(true)


        }, {element: this.container})


        this.on('dragend', (event)=>{

            if (!this.dragging) return

            var node = event.firstTarget
            if (!this.handles.includes(node)) return

            this.container.classList.remove('dragging')
            this.left = Math.max(0, this.left)
            this.top = Math.max(0, this.top)
            this.shiftKey = event.shiftKey
            this.trigger(this.dragging.indexOf('left') > -1 ? 'move' : 'drag-resize', this)
            this.dragging = null
            this.copying = null
            this.shiftKey = false

        }, {element: this.container})

        window.addEventListener('resize', ()=>{
            if (this.mounted) this.updateRectangle()
        })

        // this.handles[0]._ignore_css_transforms = true

        keyboardJS.withContext('editing', ()=>{
            keyboardJS.bind('alt', (e)=>{
                if (e.target.tagName !== 'TEXTAREA') this.handles[0].classList.add('full')
            }, (e)=>{
                if (e.target && e.target.tagName !== 'TEXTAREA') this.handles[0].classList.remove('full')
            })
            keyboardJS.bind('alt+c', (e)=>{
                if (e.target.tagName === 'TEXTAREA') return
                this.copying = true
                this.container.classList.add('copying')
            }, (e)=>{
                if (e.target.tagName === 'TEXTAREA') return
                this.copying = false
                this.container.classList.remove('copying')
            })
        })

    }

    clear() {

        if (!this.mounted) return

        this.container.parentNode.removeChild(this.container)
        this.mounted = false
        this.widgets = []


    }

    create(widgets) {

        this.clear()

        this.widgets = widgets.slice().filter(
            w=>w.getProp('visible') &&
            !(w instanceof Tab) &&
            !(w instanceof Root) &&
            !(w instanceof Folder)
        )

        if (!this.widgets.length) return

        this.updateRectangle()

        this.initLeft = this.left
        this.initTop = this.top
        this.initWidth = this.width
        this.initHeight = this.height

        fastdom.mutate(()=>{
            if (this.widgets.length) {
                this.widgets[0].parentNode.appendChild(this.container)
                this.mounted = true
            }
        })

    }

    updateRectangle() {

        var widgets = this.widgets,
            widget = widgets[0],
            layout = String(widget.parent.getProp('layout'))

        var handlesVisibility = [
            layout === 'default', // nw
            layout.match(/horizontal|default/),                            // e
            layout.match(/vertical|default/),                          // s
        ]
        handlesVisibility.push(handlesVisibility[1] && handlesVisibility[2])           // se

        fastdom.measure(()=>{

            var lefts = widgets.map(w => w.container.offsetLeft),
                tops = widgets.map(w => w.container.offsetTop),
                rights = widgets.map(w => w.container.offsetLeft + w.container.offsetWidth),
                bottoms = widgets.map(w => w.container.offsetTop + w.container.offsetHeight)

            this.left = Math.min(...lefts) / PXSCALE
            this.top = Math.min(...tops) / PXSCALE
            this.width = (Math.max(...rights) - Math.min(...lefts)) / PXSCALE
            this.height = (Math.max(...bottoms) - Math.min(...tops)) / PXSCALE

            fastdom.mutate(()=>{

                for (var i in handlesVisibility) {
                    this.handles[i].style.display = handlesVisibility[i] ? '' : 'none'
                }

                this.updateCss()

                // this.cssTransform = widget.cssTransform || 'none'
                // this.cssTransformOrigin = widget.cssTransformOrigin

            })

        })


    }

    updateCss(grid) {

        for (let k of ['top', 'left', 'width', 'height']) {

            var val = this[k]

            if (k === 'width' || k === 'height') val = Math.max(10 * PXSCALE,  val)
            if (grid && this.dragging.includes(k)) {
                val = Math.round(val / GRIDWIDTH) * GRIDWIDTH
            }

            this.container.style.setProperty('--' + k, val  + 'rem')

            // this.container.style.transform = this.cssTransform
            // this.container.style.transformOrigin = this.cssTransformOrigin

        }

    }

}

export default UiDragResize
