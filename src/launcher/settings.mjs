import {ipcRenderer} from 'electron'
import remote from '@electron/remote'
import {icon} from '../client/ui/utils'
import html from 'nanohtml/lib/browser'
import raw from 'nanohtml/raw'
import terminal from './terminal'

var {dialog} = remote.require('electron'),
    fs = remote.require('fs'),
    {settings} = remote.getGlobal('launcherSharedGlobals'),
    options_remote = settings.read('options')

class Settings {

    constructor() {

        this.remote = settings
        this.container = DOM.get('#osc-container')[0].appendChild(html`<osc-settings></osc-settings>`)
        this.names = []
        this.options = {}
        this.configPath = null
        for (var i in options_remote) {
            this.options[i] = options_remote[i]
        }

        this.create()
        this.write(true)

        ipcRenderer.on('server-starting', ()=>{
            this.disable()
        })
        ipcRenderer.on('server-stopped', ()=>{
            this.enable()
        })

    }

    save() {

        if (!this.configPath) return this.saveAs()
        fs.writeFile(this.configPath, JSON.stringify(this.options), (err, fdata)=>{

            if (err) console.error(err)
            else terminal.log('(INFO) Config saved in ' + this.configPath)

        })

    }

    saveAs() {

        dialog.showSaveDialog({
            title: 'Open File',
            filters:[{name: 'OSC Config (.config)', extensions: ['config']}],
            properties: ['openFile']
        }).then((file)=>{
            if (file.canceled || !file.filePath) return
            this.configPath = file.filePath
            if (this.configPath.split('.').pop() !== 'config') this.configPath += '.config'
            this.save()
        })

    }

    load() {

        dialog.showOpenDialog({
            title: 'Open File',
            filters:[{name: 'OSC Config (.config)', extensions: ['config']}],
            properties: ['openFile']
        }).then((file)=>{
            if (file.canceled || !file.filePaths.length) return
            this.options = JSON.parse(fs.readFileSync(file.filePaths[0], 'utf-8'))
            this.create()
            this.write()
            terminal.log('(INFO) Config loaded from ' + file.filePaths[0])
            this.configPath = file.filePaths[0]
        })

    }


    write(tmp) {

        for (var i in this.options) {
            if (this.options[i] === '' || !this.names.includes(i)) {
                delete this.options[i]
            }
        }

        settings.write('options', this.options, tmp)

    }


    create() {

        this.container.innerHTML = ''

        for (let k in settings.options) {

            if (settings.options[k].launcher === false) continue

            let data = settings.options[k],
                name = data.alias || k,
                field = html`<osc-settings-field></osc-settings-field>`,
                label = field.appendChild(html`<label>${name}</label>`),
                input = field.appendChild(html`<input/>`),
                toggle, browse, reset

            this.names.push(name)

            let value = this.options[name] === undefined ? '' : this.options[name],
                strValue = Array.isArray(value) ? value.map(x=>x.includes(' ') ? '"'+x+'"' : x).join(' ') : value


            label.addEventListener('click', (e)=>{
                terminal.log(`(HELP) --${name}: ${data.describe}`, 'help')
            })

            if (data.type === 'boolean') {

                toggle = field.appendChild(html`
                    <osc-settings-checkbox class="${value ? 'on' : ''}">${raw(icon('check'))}</osc-settings-checkbox>
                `)
                toggle.addEventListener('click', (e)=>{
                    input.value = toggle.classList.toggle('on')
                    DOM.dispatchEvent(input, 'change')
                })

            }

            if (data.file) {

                browse = field.appendChild(html`
                    <osc-settings-file>${raw(icon('folder-open'))}</osc-settings-file>
                `)

                browse.addEventListener('click', (e)=>{
                    e.preventDefault()
                    dialog.showOpenDialog({
                        title: 'Open ' + (data.file.folder ? 'folder' : 'file'),
                        filters:[{name: data.file.name, extensions: data.file.extensions}],
                        properties: data.file.folder ? ['openDirectory'] : ['openFile']
                    }).then((file)=>{
                        input.value = file.filePaths
                        DOM.dispatchEvent(input, 'change')
                    })
                })

                field.addEventListener('drop', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    let paths = []
                    for (var f of event.dataTransfer.files) {
                        if (f.path.includes(' ')) {
                            paths.push('"' + f.path + '"')
                        } else {
                            paths.push(f.path)
                        }
                    }
                    input.value = paths.join(' ')
                    DOM.dispatchEvent(input, 'change')
                })

            }

            reset = field.appendChild(html`
                <osc-settings-reset>${raw(icon('times'))}</osc-settings-reset>
            `)
            reset.addEventListener('click', ()=>{
                input.value = ''
                DOM.dispatchEvent(input, 'change')
            })

            input.value = strValue

            this.container.appendChild(field)

            input.addEventListener('change', (e)=>{
                let v = input.value.trim(),
                    fail = false

                try {
                    if (data.type == 'boolean') {
                        v = v && v !== 'false' ? true : ''
                        input.value = v
                        toggle.classList.toggle('on', v)
                    } else if (v && data.type === 'array'){
                        v = v.replace(/("[^"]*"|'[^']*')/g, (m)=>{
                            return m.substr(1, m.length - 2).replace(/\s/g, '_SPaCE_')
                        })
                        v = v.split(' ')
                        v = v.map(x=>x.replace(/_SPaCE_/g, ' '))
                    } else if (v && data.type == 'number'){
                        v = parseFloat(v)
                    }
                } catch (err) {
                    fail = err
                }

                if (fail || v !== '' && data.check && data.check(v, this.options) !== true) {
                    let error = `(ERROR) --${name}: ${fail || data.check(v, this.options)}`
                    field.classList.add('error')
                    if (field.getAttribute('data-error') !== error) {
                        terminal.log(error, 'error')
                        field.setAttribute('data-error', error)
                    }
                } else {
                    field.classList.remove('error')
                    field.removeAttribute('data-error')
                    this.options[name] = v
                }

                if (data.restart && !field.classList.contains('restart') && v != value) {
                    field.classList.add('restart')
                    field.classList.add('warning')
                    terminal.log(`(WARNING) --${name}: The launcher must be restarted for this change to take effect.`, 'warning')
                } else if (data.restart && field.classList.contains('restart') && v == value) {
                    field.classList.remove('restart')
                    field.classList.remove('warning')
                }


                if (!e.detail || !e.detail.stop) {
                    DOM.each(this.container, 'input', (el)=>{
                        if (el === input) return
                        DOM.dispatchEvent(el, 'change', {stop: true})
                    })
                    this.write()
                }

            })

        }

        DOM.each(this.container, 'input', (el)=>{
            DOM.dispatchEvent(el, 'change', {stop: true})
        })

    }

    disable() {

        this.container.classList.add('disabled')
        DOM.each(this.container, 'input', (el)=>{
            el.setAttribute('disabled', true)
        })

    }

    enable() {

        this.container.classList.remove('disabled')
        DOM.each(this.container, 'input', (el)=>{
            el.removeAttribute('disabled')
        })

    }

}

export default new Settings()
