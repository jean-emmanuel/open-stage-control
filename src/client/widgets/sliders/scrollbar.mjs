import Fader from './fader.mjs'
import StaticProperties from '../mixins/static_properties.mjs'
import {clip} from '../utils.mjs'
import widgetManager from '../../managers/widgets.mjs'

export default class Scrollbar extends StaticProperties(Fader, {
    range: {min: 0, max: 1},
    touchZone: 'all',
    alphaFillOn: 0,
    snap: false,
    design: 'compact'
}) {

    static defaults() {

        return super.defaults().extend({
            style: {
                _separator_fader_style: 'Scrollbar style',
                design: null,
                knobSize: null,
                // colorKnob: null,
                pips: null,
                dashed: null,
                gradient: null,
            },
            class_specific: {
                snap: null,
                touchZone: null,
                spring: null,
                doubleTap: null,
                range: null,
                logScale: null,
                steps: null,
                origin: null,
                widgetId: {type: 'string', value: '', help: '`id` of the container widget to control'},
            }
        })

    }

    constructor(options) {

        super(options)

        this.scrollTarget = null
        this.thumbSize = 1

        if (!this.getProp('horizontal')) {
            this.rangeVals[0] = 1
            this.rangeVals[1] = 0
        }

        widgetManager.on('widget-created', (e)=>{

            if (this.scrollTarget) return

            var {id, widget} = e

            if (id === this.getProp('widgetId') && widget.getProp('scroll')) {
                this.unbindTarget()
                this.bindTarget(widget)
            }

        }, {context: this})

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
        for (var widget of widgets) {
            if (widget.getProp('scroll')) {
                this.unbindTarget()
                this.bindTarget(widget)
                break
            }
        }
    }


    draginitHandle(e) {

        // super.draginitHandle(...arguments)

        if (!e.traversing && !this.shouldDrag(e)) {
            e.cancelDragEvent = true
            return
        }

        this.percent = clip(this.percent,[0,100])

        // snap when not touching the knob zone
        if (this.shouldDrag(e, 'knob')) return

        this.percent = this.getProp('horizontal')?
            (e.offsetX - this.gaugePadding) / (this.width - this.gaugePadding * 2) * 100:
            (this.height - e.offsetY - this.gaugePadding) / (this.height - this.gaugePadding * 2) * 100

        this.setValue(this.percentToValue(this.percent), {send: true, sync: true, dragged: true})

    }


    mousewheelHandle(e) {

        e.preventDefault()
        e.stopPropagation()

        var increment
        if (this.getProp('horizontal')) {
            increment = e.deltaY / this.scrollTarget.scrollWidth * 100
        } else {
            increment = -e.deltaY / this.scrollTarget.scrollHeight * 100
        }

        this.percent = clip(this.percent + increment, [0,100])
        this.setValue(this.percentToValue(this.percent), {sync: true, send: true, dragged: true})

    }

    cacheCanvasStyle(style){

        super.cacheCanvasStyle(style)

        var size = this.getProp('horizontal') ? this.width : this.height
        this.cssVars.knobSize = Math.max(this.thumbSize * size, 30)
        this.cssVars.alphaKnob = 0.25

    }


    unbindTarget() {

        if (!this.scrollTarget) return

        this.scrollTarget.off(undefined, undefined, this)

        this.scrollTarget = null

    }

    bindTarget(target) {

        if (!target) return

        this.scrollTarget = target

        this.scrollTarget.on('widget-removed', (e)=>{
            if (this.scrollTarget === e.widget) {
                this.unbindTarget()
            }
        }, {context: this})

        var onScroll = ()=>{
            if (!this.scrollTarget) return

            var index = this.getProp('horizontal') ? 0 : 1,
                size = this.getProp('horizontal') ? this.width : this.height

            this.thumbSize = this.scrollTarget.scrollThumb[index]
            this.cssVars.knobSize = Math.max(this.thumbSize * size, 30)
            this.setValue(this.scrollTarget.scroll[index], {fromPanel:true, send:true, sync:true})
        }

        this.scrollTarget.on('scroll', onScroll)
        setTimeout(()=>{
            onScroll()
        })

    }



    setValue(v, options={}) {

        super.setValue(v, options)

        if (!options.fromPanel && this.scrollTarget) {
            if (this.getProp('horizontal')) {
                this.scrollTarget.setScroll(this.value, undefined, !options.fromPanel)
            } else {
                this.scrollTarget.setScroll(undefined, this.value, !options.fromPanel)
            }

        }
    }

    onRemove(){

        this.unbindTarget()
        super.onRemove()

    }

}
