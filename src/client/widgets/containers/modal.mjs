import html from 'nanohtml'
import raw from 'nanohtml/raw'
import Panel from './panel.mjs'
import {icon, iconify} from '../../ui/utils.mjs'
import * as resize from '../../events/resize.mjs'
import doubleTap from '../mixins/double_tap'
import {DOM, PXSCALE} from '../../globals.mjs'

class Modal extends Panel {

    static description() {

        return 'A toggle button that opens a popup panel. Cannot contain tabs directly.'

    }

    static defaults() {

        return super.defaults().extend({
            class_specific: {
                doubleTap: {type: 'boolean', value: false, help: 'Set to `true` to make the modal require a double tap to open instead of a single tap'},
            },
            geometry: {
                _separator_modal_geometry: 'Modal geometry',
                popupWidth: {type: 'number|percentage', value: '80%', help: 'Modal popup\'s size'},
                popupHeight: {type: 'number|percentage', value: '80%', help: 'Modal popup\'s size'},
                popupLeft: {type: 'number|percentage', value: 'auto', help: 'Modal popup\'s position'},
                popupTop: {type: 'number|percentage', value: 'auto', help: 'Modal popup\'s position'},
                relative: {type: 'boolean', value: false, help: 'Set to `true` to make the modal\'s position relative to the button\'s position.'},
                ignoreTabs: {type: 'boolean', value: false, help: 'Set to `true` to allow the modal overflowing its tab ancestors.'},
            },
            style: {
                _separator_modal_style: 'Modal style',
                label: {type: 'string|boolean', value: 'auto', help: [
                    'Set to `false` to hide completely',
                    '- Insert icons using the prefix ^ followed by the icon\'s name : `^play`, `^pause`, etc (see https://fontawesome.com/icons?d=gallery&s=solid&m=free)',
                    '- Icons can be transformed with the following suffixes: `.flip-[horizontal|vertical|both]`, `.rotate-[90|180|270]`, `.spin`, `.pulse`. Example: `^play.flip-horizontal`',
                ]},
                popupLabel: {type: 'string|boolean', value: 'auto', help: 'Alternative label for the modal popup'},
                popupPadding: {type: 'number', value: 'auto', help: 'Modal\'s inner spacing.'},
                tabsPosition: null,
                html: null
            },
            children: {
                tab: null
            },
            value: {
                value: {type: 'integer', value: '', help: [
                    'Defines the modal\'s state:`0` for closed, `1` for opened'
                ]},
            }
        })

    }

    constructor(options) {

        super(options)

        this.popup = html`
            <div class="popup">
                <div class="popup-wrapper">
                    <div class="popup-title closable"><span class="popup-label"></span><span class="closer">${raw(icon('times'))}</span></div>
                    <div class="popup-content widget panel-container not-editable contains-widgets"></div>
                </div>
            </div>
        `

        this.container.appendChild(this.popup)
        this.popupContent = DOM.get(this.popup, '.popup-content')[0]


        // convert dimensions / coordinates to rem
        var geometry = {}
        for (var g of ['Width', 'Height', 'Left', 'Top']) {
            geometry[g] = parseFloat(this.getProp('popup' + g)) == this.getProp('popup' + g) ? parseFloat(this.getProp('popup' + g)) + 'rem' : this.getProp('popup' + g)
        }

        this.popup.style.setProperty('--width', geometry.Width)
        this.popup.style.setProperty('--height', geometry.Height)

        if (geometry.Left !== 'auto') {
            this.popup.style.setProperty('--left', geometry.Left)
            this.popup.classList.add('x-positionned')
        }

        if (geometry.Top !== 'auto') {
            this.popup.style.setProperty('--top', geometry.Top)
            this.popup.classList.add('y-positionned')
        }

        this.toggle = this.container.appendChild(html`<div class="toggle"></div>`)

        var closer = DOM.get(this.popup, '.closer')[0]

        this.on('fast-click',(e)=>{
            if ((e.target === this.popup || e.target === closer) && this.value == 1) {
                e.detail.preventOriginalEvent = true
                this.setValue(0, {sync:true, send:true})
            }
        }, {element: this.container})

        if (this.getProp('doubleTap')) {
            doubleTap(this, ()=>{
                this.setValue(1, {sync:true, send:true})
            }, {element: this.toggle})
        } else {
            this.on('fast-click',(e)=>{
                if (e.capturedByEditor === true) return
                if (e.target === this.toggle) {
                    e.detail.preventOriginalEvent = true
                    this.setValue(1, {sync:true, send:true})
                }
            }, {element: this.container})
        }


        this.escapeKeyHandler = ((e)=>{
            if (e.key == 'Escape') this.setValue(0, {sync:true, send:true})
        }).bind(this)

        this.value = 0
        this.init = false
        this.labelChange = true

        this.container.classList.toggle('relative', this.getProp('relative'))
        this.popupContent.classList.add('layout-' + this.getProp('layout'))

        this.label = html`<label></label>`
        this.updateLabel()

        this.childrenType = 'widget'

    }

    setValue(v, options={}) {

        if (this.init === undefined) return

        var val = v ? 1 : 0

        if (val === this.value) return

        this.value = val

        if (!this.init && this.value) {
            this.popupContent.appendChild(this.widget)
            this.init = true
        }

        if (this.value && this.labelChange) {
            this.updatePopupLabel()
        }

        this.popup.classList.toggle('show', this.value)
        this.container.classList.toggle('on', this.value)

        this.bindEscKey(this.value)

        if (this.init) this.fixParents()

        this.setVisibility()
        if (this.value) {
            resize.check(this.widget, true)
        }


        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)


    }

    fixParents() {

        var parent = this.parent,
            scrollX = 0,
            scrollY = 0,
            stop = this.getProp('ignoreTabs') ? /root/ : /root|tab/

        while (parent && parent.props && !String(parent.getProp('type')).match(stop)) {

            parent.modalBreakout += (this.value ? 1 : -1)
            if (parent.modalBreakout > 0) parent.container.classList.add('modal-breakout')
            else if (parent.modalBreakout === 0) parent.container.classList.remove('modal-breakout')
            else parent.modalBreakout = 0

            scrollX += parent.widget.scrollLeft
            scrollY += parent.widget.scrollTop

            parent = parent.parent
        }

        scrollX += parent.widget.scrollLeft
        scrollY += parent.widget.scrollTop

        if (this.getProp('relative')) {
            this.container.style.setProperty('--parent-scroll-x', scrollX + 'px')
            this.container.style.setProperty('--parent-scroll-y', scrollY + 'px')
        }

        this.modalBreakout += (this.value ? 1 : -1)
        if (this.modalBreakout > 0) this.container.classList.add('modal-breakout')
        else if (this.modalBreakout === 0) this.container.classList.remove('modal-breakout')
        else this.modalBreakout = 0


    }

    bindEscKey(set) {

        if (set) {
            document.addEventListener('keydown', this.escapeKeyHandler)
        } else {
            document.removeEventListener('keydown', this.escapeKeyHandler)
        }

    }

    onRemove() {
        this.bindEscKey(false)
        this.setValue(0)
        super.onRemove()
    }

    updateLabel() {

        if (!this.label) return

        if (this.getProp('label') === false) {

            if (this.container.contains(this.label)) this.container.removeChild(this.label)

        } else {
            this.label.innerHTML = this.getProp('label') == 'auto'?
                    this.getProp('id'):
                    iconify(String(this.getProp('label')).replace(/</g, '&lt;'))

            if (!this.container.contains(this.label)) this.container.appendChild(this.label)
        }

    }

    updatePopupLabel() {

        if (!this.popup) return

        var label = this.getProp('popupLabel') !== 'auto' ? iconify(this.getProp('popupLabel')) : this.label.innerHTML

        DOM.get(this.popup, '.popup-title .popup-label')[0].innerHTML = label
        this.popup.classList.toggle('no-label', this.getProp('popupLabel') === false)

        this.labelChange = false

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'label':
                this.updateLabel()
                // falls through
            case 'popupLabel':
                if (this.value) {
                    this.updatePopupLabel()
                } else {
                    this.labelChange = true
                }
                return
            case 'popupPadding':
                this.setCssVariables()
                return

        }

    }

    setScroll(x, y) {

        if (x !== undefined) this.popupContent.firstChild.scrollLeft = this.scroll[0] = x
        if (y !== undefined) this.popupContent.firstChild.scrollTop = this.scroll[1] = y

    }

}

Modal.cssVariables = Modal.prototype.constructor.cssVariables.concat(
    {js: 'popupPadding', css: '--popup-padding', toCss: x=>parseFloat(x) + 'rem', toJs: x=>parseFloat(x) * PXSCALE},
)

Modal.dynamicProps = Modal.prototype.constructor.dynamicProps.concat(
    'label',
    'popupLabel',
    'popupPadding'
)

export default Modal
