import html from 'nanohtml/lib/browser'
import raw from 'nanohtml/raw'
import keyboardJS from 'keyboardjs/dist/keyboard.min.js'
import UiWidget from './ui-widget'

var mod = (navigator.platform || '').match('Mac') ? 'cmd' : 'ctrl',
    MENU_CONTAINER

class ContextMenu extends UiWidget {

    constructor(options={}){

        super(options)

        if (!MENU_CONTAINER) MENU_CONTAINER = DOM.get('osc-workspace')[0]


        this.container = html`<div class="context-menu"></div>`
        this.clickHandler = (e)=>{
            if (this.container && !this.container.contains(e.target)) {
                this.close()
            }
        }


        this.position = options.position
        if (this.position) {
            this.container.style.top = this.position[0] + 'rem'
            this.container.style.left = this.position[1] + 'rem'
        }

        this.container.addEventListener('click', (e)=>{
            e.preventDefault()
            if (e.target._action){
                e.target._action()
                this.close()
            }
        })

        this.hoverNode = null
        this.container.addEventListener('mousemove', (e)=>{
            if (this.hoverNode === e.target) return
            this.hoverNode = e.target
            if (!e.target.classList.contains('focus')) {
                DOM.each(e.target.parentNode, '.focus', (el)=>{
                    el.classList.remove('focus')
                })
                e.target.classList.add('focus')
            }
        })

        this.container.addEventListener('touchstart', (e)=>{
            if (e.target.classList.contains('has-sub')) e.preventDefault()
            if (!e.target.classList.contains('focus')) {
                DOM.each(e.target.parentNode, '.focus', (el)=>{
                    el.classList.remove('focus')
                })
                e.target.classList.add('focus')
            } else {
                e.target.classList.remove('focus')
                DOM.each(e.target, '.focus', (el)=>{
                    el.classList.remove('focus')
                })
            }
        })


    }

    parse(actions, node) {

        for (let action of actions) {

            if (action.separator) {

                node.appendChild(html`<div class="separator"></div>`)

            } else if (Array.isArray(action.action)) {

                let submenu = html`<div class="context-menu"></div>`,
                    label = typeof action.label === 'function' ? action.label() : action.label,
                    iclass = typeof action.class === 'function' ? action    .class() : action.class,
                    item = html`<div class="item has-sub ${iclass || ''}" tabIndex="1">${raw(label)}</div>`

                if (action.disabled) {

                    item.classList.add('disabled')

                } else {

                    item.appendChild(submenu)

                    this.parse(action.action, submenu)

                }

                node.appendChild(item)

            } else {

                let label = typeof action.label === 'function' ? action.label() : action.label,
                    iclass = typeof action.class === 'function' ? action.class() : action.class,
                    item = html`<div class="item ${iclass || ''}">${raw(label)}</div>`

                if (action.disabled) item.classList.add('disabled')

                item._action = action.action
                node.appendChild(item)

                if (action.shortcut) {

                    item.appendChild(html`<div class="shortcut">${action.shortcut.replace('mod', mod)}</div>`)

                }

            }

        }

    }

    open(e, actions, parent) {

        this.container.innerHTML = ''
        this.parse(actions, this.container)

        MENU_CONTAINER.appendChild(this.container)

        if (!this.position) {
            this.container.style.top = e.pageY / PXSCALE + 'rem'
            this.container.style.left = e.pageX / PXSCALE + 'rem'
        }


        this.correctPosition(this.container)

        DOM.each(this.container, '.context-menu', (m)=>{
            this.correctPosition(m, m.parentNode)
        })

        document.addEventListener('fast-click', this.clickHandler, true)
        document.addEventListener('fast-right-click', this.clickHandler, true)

        this.trigger('open')

    }

    close() {

        if (this.container) {

            this.container.parentNode.removeChild(this.container)

            // remove position fix
            this.container.style.bottom = ''
            this.container.style.right = ''
            this.container.style.marginRight = ''

        }

        document.removeEventListener('fast-click', this.clickHandler, true)
        document.removeEventListener('fast-right-click', this.clickHandler, true)

        this.hoverNode = null

        this.trigger('close')

    }

    correctPosition(menu, parent) {

        var position = DOM.offset(menu),
            width = menu.offsetWidth,
            height = menu.offsetHeight,
            totalWidth = MENU_CONTAINER.offsetWidth,
            totalHeight = MENU_CONTAINER.offsetHeight

        if (width + position.left > totalWidth) {
            if (position.left - width > 0) {
                menu.style.right = parent ? '100%' : '0'
                menu.style.left = 'auto'
                menu.style.marginRight = '-0.5rem'
            } else {
                menu.style.left =  (parent.offsetWidth + (totalWidth  - width - position.left)) / PXSCALE + 'rem'
            }
        }

        if (height + position.top > totalHeight && position.top - height > 0) {
            menu.style.top = 'auto'
            menu.style.bottom = '0rem'
        }

    }

    bindShortcuts(actions) {

        for (let action of actions) {

            if (action.disabled) continue

            if (Array.isArray(action.action)) {

                this.bindShortcuts(action.action)

            } else if (action.shortcut && action.action) {

                keyboardJS.bind(action.shortcut, (e)=>{
                    e.preventDefault()
                    action.action()
                })

            }

        }

    }

}

export default ContextMenu
