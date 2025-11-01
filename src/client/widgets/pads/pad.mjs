import html from 'nanohtml'
import Canvas from '../common/canvas.mjs'
import {PXSCALE} from '../../globals.mjs'

class Pad extends Canvas {

    constructor(options) {

        super({...options, value: [], html: html`
            <inner>
                <canvas></canvas>
            </inner>
        `})

    }

    cacheCanvasStyle(style) {

        style = style || window.getComputedStyle(this.canvas)

        super.cacheCanvasStyle(style)

        this.padPadding = (this.cssVars.padding + this.cssVars.lineWidth) + 2 * PXSCALE
        this.pointSize = parseFloat(this.cssVars.pointSize) * (this.cssVars.pointSize.indexOf('%') > -1 ? this.width / 100 : PXSCALE)

    }

    drawPips() {

        var margin = this.padPadding,
            pipTexts = margin >= this.fontSize * 1.5

        this.ctx.lineWidth = PXSCALE
        this.ctx.fillStyle = this.cssVars.colorText
        this.ctx.strokeStyle = this.cssVars.colorStroke
        this.ctx.globalAlpha = this.cssVars.alphaPips
        this.ctx.beginPath()

        for (let i in this.faders.x.rangeKeys) {

            let pip = this.faders.x.rangeKeys[i],
                px = Math.round(0.5 * this.faders.x.percentToCoord(pip)) * 2

            if (parseInt(px) === px) px -= 0.5

            if (pipTexts) {
                this.ctx.textAlign = 'center'
                let label = this.faders.x.rangeLabels[i]
                this.ctx.fillText(label, px, this.height - margin / 2)
            }

            if (pip == 0 || pip == 100) continue
            this.ctx.moveTo(px, margin - PXSCALE)
            this.ctx.lineTo(px, this.height - margin + PXSCALE)


        }
        for (let i in this.faders.y.rangeKeys) {

            let pip = this.faders.y.rangeKeys[i],
                py = Math.round(0.5 * this.faders.y.percentToCoord(pip)) * 2

            if (parseInt(py) === py) py -= 0.5

            if (pipTexts) {
                this.ctx.textAlign = 'right'
                let label = this.faders.y.rangeLabels[i]
                this.ctx.fillText(label, margin / 2 + this.fontSize / 2, py)
            }

            if (pip == 0 || pip == 100) continue
            this.ctx.moveTo(margin - PXSCALE, py)
            this.ctx.lineTo(this.width - margin + PXSCALE, py)


        }

        this.ctx.globalAlpha = this.cssVars.alphaFillOn
        this.ctx.stroke()

    }

    onPropChanged(propName, options, oldPropValue) {

        var ret = super.onPropChanged(...arguments)

        switch (propName) {
            case 'pointSize':
                this.setCssVariables()
                return
        }

        return ret


    }

}

Pad.cssVariables = Pad.prototype.constructor.cssVariables.concat(
    {js: 'pointSize', css: '--point-size'},
)

Pad.dynamicProps = Pad.prototype.constructor.dynamicProps.filter(n => n !== 'decimals').concat([
    'spring',
    'axisLock',
    'pointSize',
    'label',
    'clipX',
    'clipY'
])

export default Pad
