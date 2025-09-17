import html from 'nanohtml'
import Widget from '../common/widget.mjs'
import uiFilebrowser from '../../ui/ui-filebrowser.mjs'
import {DOM} from '../../globals.mjs'

export default class File extends Widget {

    static description() {

        return 'File/Folder selector (server-side).'

    }

    static defaults() {

        return super.defaults().extend({
            style: {
                _separator_file_style: 'File style',
                align: {type: 'string', value: 'center', choices: ['center', 'left', 'right'], help: 'Set to `left` or `right` to change text alignment (otherwise center)'},
                hidePath: {type: 'boolean', value: false, help: 'Set to `true` to only display the filename (the whole path will still be used as value)'},
                mode: {type: 'string', value: 'open', choices: ['open', 'save'], help: 'File browser mode'},
            },
            class_specific: {
                directory: {type: 'string', value: 'auto', help: 'Default browsing directory'},
                extension: {type: 'string|array', value: '*', help: 'Only display files with this extension. Multiple extensions can be specified with an array of strings (`["jpg", "jpeg"]`)'},
                allowDir:  {type: 'boolean', value: false, help: 'Allow selecting a folder (by pressing "open" when no file is selected)'}
            }
        })

    }

    constructor(options) {

        super({...options, html: html`
            <inner>
                <div class="text"></div>
                <div class="icon"></div>
            </inner>
        `})

        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')
        if (this.getProp('mode') === 'save') this.widget.classList.add('save')
        if (this.getProp('hidePath')) this.widget.classList.add('hide-path')

        this.text = DOM.get(this.widget, '.text')[0]

        var ext = this.getProp('extension')
        if (Array.isArray(ext)) {
            ext = '(' + ext.join('|') + ')'
        }

        this.on('fast-click', (e)=>{

            if (e.capturedByEditor === true) return

            uiFilebrowser({
                extension: ext.replace(/^\.?(.*)$/, '$1'),
                directory: this.getProp('directory') === 'auto' ? undefined : this.getProp('directory'),
                loadDir: this.getProp('allowDir'),
                save: this.getProp('mode') === 'save'
            }, (path, root)=>{

                var sep = path[0][0] === '/' ? '/' : '\\',
                    val = path.join(sep)
                if (root) val = val.replace(root, sep).replace(sep + sep, sep)

                this.setValue(val, {
                    sync: true,
                    send: true
                })

            })
        }, {element: this.widget})

    }


    setValue(v, options={}) {

        this.value = v

        if (this.getProp('hidePath') && typeof v === 'string') {
            var sep = v[0] === '/' ? '/' : '\\'
            if (v[v.length - 1] === sep) {
                this.text.textContent = v.substr(0, v.length - 1).split(sep).pop() + sep
            } else {
                this.text.textContent = v.split(sep).pop()
            }
        } else {
            this.text.textContent = v
        }

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }




}
