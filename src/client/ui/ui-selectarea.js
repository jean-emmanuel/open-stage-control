import html from 'nanohtml/lib/browser'

class UiSelectArea {

    constructor(selector, callback){

        this.startX = 0
        this.startY = 0
        this.curX = 0
        this.curY = 0

        this.rectCoords = [0, 0, 0, 0]
        this.rectSize = [0, 0]
        this.elements = []

        this.rect = document.body.appendChild(html`<div class="select-area hidden"></div>`)

        this.selector = selector
        this.callback = callback

        this.boundMousedown = this.mousedown.bind(this)
        this.boundMousemove = this.mousemove.bind(this)
        this.boundMouseup = this.mouseup.bind(this)

    }

    mousedown(e) {
        if (!e.shiftKey || event.altKey || event.button === 2 || (event.shiftKey && event.metaKey)) return
        this.startX = this.curX = e.clientX
        this.startY = this.curY = e.clientY
        this.down = true
        this.updateRect()
    }

    mousemove(e) {
        if (!this.down) return
        e.preventDefault()
        e.stopPropagation()
        this.curX = e.clientX
        this.curY = e.clientY
        this.updateRect()
    }

    mouseup(e) {
        if (!this.down) return
        this.down = false

        if (this.rectSize[0] > 0 && this.rectSize[1] > 0) {
            this.callback(this.getElements(), e)
            this.rect.classList.add('hidden')
        }

        this.elements = []

    }

    updateRect() {

        var x0 = Math.min(this.startX, this.curX),
            y0 = Math.min(this.startY, this.curY),
            x1 = Math.max(this.startX, this.curX),
            y1 = Math.max(this.startY, this.curY),
            w = x1 - x0,
            h = y1 - y0

        if (w < 1 || h < 1) {
            this.rect.classList.add('hidden')
        } else {
            this.rect.classList.remove('hidden')
            this.rect.setAttribute('style', `width:${w}px;height:${h}px;left:${x0}px;top:${y0}px`)
        }

        this.rectSize = [w, h]
        this.rectCoords = [x0, x1, y0, y1]

    }

    getElements(){

        var [x0, x1, y0, y1] = this.rectCoords,
            startEl = document.elementFromPoint(this.startX, this.startY),
            elements = [startEl]

        this.elements = DOM.each(document, this.selector, (el)=>{

            var {left, right, top, bottom} = el.getBoundingClientRect()
            if (!(
                left > x1  ||
                right < x0 ||
                top > y1   ||
                bottom < y0
            )) {
                if (el !== startEl) elements.push(el)
            }

        })

        // slower implementation...
        // for (var x = x0; x <= x1; x += 10) {
        //     for (var y = y0; y <= y1; y += 10) {
        //         var el = document.elementFromPoint(x, y)
        //         if (elements.indexOf(el) < 0) elements.push(el)
        //     }
        // }

        return elements

    }

    enable() {

        document.addEventListener('pointerdown',  this.boundMousedown)
        document.addEventListener('pointermove', this.boundMousemove, true)
        document.addEventListener('pointerup', this.boundMouseup)

    }

    disable() {

        document.removeEventListener('pointerdown',  this.boundMousedown)
        document.removeEventListener('pointermove', this.boundMousemove, true)
        document.removeEventListener('pointerup', this.boundMouseup)

    }

}

export default UiSelectArea
