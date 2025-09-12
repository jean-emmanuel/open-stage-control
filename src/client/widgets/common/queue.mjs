import EventEmitter from '../../events/event-emitter.mjs'

class CanvasQueue extends EventEmitter{

    constructor() {

        super()

        this.queue = {}
        this.flushed = 0
        this.running = false
        this.frameLength = 1000 / CANVAS_FRAMERATE
        this.lastFrame = 0
        this.boundLoop = this.loop.bind(this)

    }

    push(widget) {

        this.queue[widget.hash] = widget
        this.flushed = 0
        if (!this.running) this.startLoop()

    }

    startLoop() {

        this.running = true
        this.flushed = 0
        requestAnimationFrame(this.boundLoop)

    }

    flush() {

        for (var h in this.queue) {
            if (this.queue[h].width > 0 && this.queue[h].height > 0 && this.queue[h].visible) {
                this.queue[h].draw()
            }
        }

        this.queue = {}
        this.flushed++

    }

    loop(timestamp) {

        if (this.flushed >= 10) {
            this.running = false
            return
        }

        requestAnimationFrame(this.boundLoop)

        var delta = timestamp - this.lastFrame

        if (delta > this.frameLength) {
            this.lastFrame = timestamp - (delta % this.frameLength)
            this.trigger('frame', {timestamp})
            this.flush()
        }

    }

}

export default new CanvasQueue()
