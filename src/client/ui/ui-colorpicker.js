var UiWidget = require('./ui-widget'),
    Rgb = require('../widgets/pads/rgb'),
    html = require('nanohtml'),
    chroma = require('chroma-js'),
    resize = require('../events/resize')


class ColorPicker extends UiWidget {

    constructor() {

        super({})

        this.name = ''
        this.value = ''

        this.rgb = new Rgb({props: {
            ...Rgb.defaults()._props(),
            type: 'rgb',
            width: 'auto',
            height: 'auto',
            alphaStroke: 0,
            snap: true,
            alpha: true
        }, parent: this})
        this.rgb.container.classList.add('not-editable')

        this.container = html`
            <div class="color-picker">
                ${this.rgb.container}
             </div>
        `

        this.rgb.on('value-changed', (e)=>{
            e.stopPropagation = true
            this.value = chroma(this.rgb.value).hex()
            this.trigger('change', {preventHistory: true})
        })

        var dragEndCb = (e)=>{
            this.value = chroma(this.rgb.value).hex()
            this.trigger('change')
        }
        this.rgb.pad.on('dragend', dragEndCb)
        this.rgb.hue.on('dragend', dragEndCb)
        this.rgb.alpha.on('dragend', dragEndCb)


        this.opened = 0

        this.escKeyHandler = ((e)=>{
            if (e.key == 'Escape') this.close()
        }).bind(this)

        this.enterKeyHandler = ((e)=>{
            if (e.key == 'Enter') this.confirm()
        }).bind(this)

    }

    open() {

        this.parentNode.appendChild(this.container)
        resize.check(this.rgb.container)
        this.opened = 1

        document.addEventListener('keydown', this.escKeyHandler)
        document.addEventListener('keydown', this.enterKeyHandler)
    }

    close() {

        if (this.parentNode && this.parentNode.contains(this.container)) {
            this.parentNode.removeChild(this.container)
        }
        this.setName()
        this.opened = 0

        document.removeEventListener('keydown', this.escKeyHandler)
        document.removeEventListener('keydown', this.enterKeyHandler)
    }

    confirm() {

        this.value = chroma(this.rgb.getValue(true)).css('rgba')
        this.trigger('change')
        this.close()

    }

    isVisible() {

        return true

    }

    setName(n = '') {

        this.name = n

    }

    setValue(v) {

        if (v === 'transparent') v = '#00000000'

        this.rgb.setValue(chroma(v).rgba())

    }

    setParent(node) {

        if (this.opened && node !== this.parentNode) this.close()
        this.parentNode = node

    }

}

module.exports = ColorPicker
