import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import {EventEmitter} from 'events'
import crypto from 'crypto'
import * as settings from './settings.mjs'

class Theme extends EventEmitter {

    constructor() {

        super()

        this.defaultColor = '#151a24'
        this.backgroundColor = this.defaultColor

        this.css = []
        this.watcher = null
        this.themes = settings.read('theme') || []
        this.files = []
        this.hash = ''

        if (!this.themes.length) return this

        if (this.themes.length > 1 && fs.existsSync(this.themes.join(' '))) {

            this.files.push(this.themes.join(' '))

        } else {

            for (let theme of this.themes) {

                if (theme.includes('.css') && fs.existsSync(theme)) {
                    this.files.push(theme)
                } else if (!theme.includes('.css') && fs.existsSync(path.resolve(__dirname + '/../../assets/themes/' + theme + '.css'))) {
                    this.files.push(path.resolve(__dirname + '/../../assets/themes/' + theme + '.css'))
                } else {
                    console.error('(ERROR) Theme not found: "' + theme)
                }
            }

        }

        if (this.files.length) {

            this.watcher = chokidar.watch(this.files, {awaitWriteFinish: {stabilityThreshold: 200}}).on('change', ()=>{
                this.load()
                this.emit('update')
            })

        }

        this.load()

    }

    load() {

        this.css = []

        for (let i in this.files) {

            try {
                this.css.push(fs.readFileSync(this.files[i],'utf-8'))
            } catch(err) {
                console.error('(ERROR) Could not load theme "' + this.files[i])
            }

        }

        this.hash = crypto.createHash('sha1').update(this.get()).digest('base64')

    }

    get() {

        return this.css.join('\n')

    }

}

var theme = new Theme()

export default theme
