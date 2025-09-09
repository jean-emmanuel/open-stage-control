var html = require('nanohtml/lib/browser'),
    morph = require('nanomorph'),
    UiWidget = require('./ui-widget')


var DEFAULT_DURATION = 3500

class Toast {

    constructor(data) {

        this.id = data.id || Date.now()
        this.update(data)

    }

    update(data) {

        this.expires = Date.now() + (data.duration || DEFAULT_DURATION)

        var toast = html`
            <div class="toast ${data.class || ''}" data-id="${data.id}">
                <i class="fa fa-fw fa-${data.icon || (data.class === 'error' ? 'exclamation' : 'bell')}"></i>
                <div class="content"></div>
            </div>
        `

        DOM.get(toast, '.content')[0].textContent = data.message

        if (this.html) {
            this.html = morph(this.html, toast)
            this.html.style.height = this.html.offsetHeight + 'px'
        } else {
            this.html = toast
        }

    }

    appendTo(el) {

        el.appendChild(this.html)
        this.html.style.height = this.html.offsetHeight + 'px'

    }

    removeFrom(el) {

        this.html.classList.add('remove')
        setTimeout(()=>{
            if (el.contains(this.html)) el.removeChild(this.html)
        }, 200)

    }

}

class Notifications extends UiWidget {

    constructor(options) {

        super(options)

        this.toasts = []

        this.loop = null
        this.visible = undefined

        this.setVisibility(ENV.notifications != 0)

        this.container.addEventListener('fast-click', (e)=>{
            for (var toast of this.toasts) {
                if (toast.html.contains(e.target)) this.remove(toast)
            }
        })

    }

    add(data) {

        if (data.id) {
            var match = this.toasts.filter(x => x.id === data.id)
            if (match.length) {
                return match[0].update(data)
            }
        }

        var toast = new Toast(data)

        toast.appendTo(this.container)
        this.toasts.push(toast)

        this.startLoop()

    }

    remove(toast) {

        toast.removeFrom(this.container)
        this.toasts.splice(this.toasts.indexOf(toast), 1)

        if (this.toasts.length === 0) this.stopLoop()

    }

    startLoop() {

        if (this.loop) return

        this.loop = setInterval(()=>{
            for (var i = this.toasts.length - 1; i > -1; i--) {
                if (Date.now() > this.toasts[i].expires) {
                    this.remove(this.toasts[i])
                }
            }

        },100)

    }

    stopLoop() {

        if (!this.loop) return

        clearInterval(this.loop)
        this.loop = null

    }


    setVisibility(v) {

        this.visible = v
        this.container.style.display = v ? '' : 'none'

    }

}

module.exports = new Notifications({selector: '#notifications'})
