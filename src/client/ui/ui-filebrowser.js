var locales = require('../locales'),
    html = require('nanohtml/lib/browser'),
    raw = require('nanohtml/raw'),
    ipc = require('../ipc'),
    doubleClick = require('../events/double-click'),
    {icon} = require('./utils'),
    UiModal = require('./ui-modal'),
    keyboardJS = require('keyboardjs/dist/keyboard.min.js')


module.exports = function UiFilebrowser(options, callback) {

    var save = options.save,
        saveInputFocus = undefined,
        previousKbContext = keyboardJS.getContext()

    var popup = new UiModal({
        height: 360,
        closable: true,
        html: true,
        title: locales(save ? 'remotesave_save' : 'remotesave_open'),
        hide: true
    })

    var container = DOM.get(popup.container, '.popup-content')[0],
        browser = html`<div class="file-browser"></div>`,
        ariane = html`<div class="ariane"></div>`,
        list = html`<form class="file-list"></form>`,
        saveInput = html`<input type="text" class="save-as no-keybinding" placeholder="${options.extension ? '*.' + options.extension : ''}" ${options.save ? '' : 'disabled'}/>`,
        actions = html`
            <div class="file-actions">
                ${saveInput}
                <div class="btn cancel">${raw(icon('times'))} Cancel</div>
                ${
                    save ?
                        html`<div class="btn submit save">${raw(icon('save'))} Save</div>` :
                        html`<div class="btn submit open">${raw(icon('folder-open'))} Open</div>`
                }
            </div>
        `

    var files = [],
        path = ''

    var extRe = options.extension ? new RegExp('.*\\.' + options.extension + '$') : /.*/

    if (save) {
        saveInput.addEventListener('change', ()=>{
            if (!saveInput.value.match(extRe)) saveInput.value += '.' + options.extension
        })
        saveInput.addEventListener('focus', ()=>{
            saveInputFocus = true
        })
        list.addEventListener('change', ()=>{
            saveInputFocus = false
            var choice = DOM.get(list, ':checked')[0]
            if (choice && choice.classList.contains('file')) {
                saveInput.value = choice.value
            }
        })
    }

    doubleClick(list, submit, {click: true})

    function submit(){

        var choice = DOM.get(list, ':checked')[0]

        if (!choice && (!save || !saveInput.value) && !options.loadDir) return

        if (choice && choice.classList.contains('folder') && (!save || !saveInputFocus)) {
            ipc.send('listDir', {path: [path, choice.value]})
        } else {
            if (save) {
                if (files.some(x=>x.name===saveInput.value)) {
                    if (!confirm(locales('remotesave_overwrite'))) return
                }
                callback([path, saveInput.value])
                popup.close()
            } else {
                callback([path, choice ? choice.value : ''])
                popup.close()
            }
        }

    }

    actions.addEventListener('click', (e)=>{
        if (e.target.classList.contains('submit')) {
            submit()
        } else if ((e.target.classList.contains('cancel'))){
            popup.close()
        }
    })

    function keyDownHandler(e){

        if (e.key == 'Enter') {
            if (save) {
                document.addEventListener('keyup', keyUpHandler)
            } else {
                submit()
            }
        } else if (e.target === saveInput) {
            return
        } else if (e.key == 'DOM_VK_BACK_SPACE' || e.keyCode === 8) {
            list.childNodes[0].firstElementChild.checked = true
            submit()
        } else if (e.key.length === 1) {
            var letter = e.key.toLowerCase(),
                current = DOM.get(list, ':checked')[0],
                minIndex = -1,
                index = -1

            if (current) minIndex = DOM.index(current.parentNode)

            for (let i in files) {
                if (files[i].name[0].toLowerCase() === letter && !list.childNodes[i].firstElementChild.checked) {
                    if (index === -1) index = i
                    if (minIndex !== -1 && i < minIndex) continue
                    index = i
                    break
                }
            }

            if (index !== -1) {
                list.childNodes[index].firstElementChild.click()
                list.childNodes[index].firstElementChild.focus()
            }
        }
    }
    function keyUpHandler(e){

        if (e.key == 'Enter') {
            setTimeout(submit, 100)
            document.removeEventListener('keyup', keyUpHandler)
        }

    }

    document.addEventListener('keydown', keyDownHandler)

    ipc.on('listDir', (data)=>{

        ariane.textContent = path = data.path

        files = data.files.filter(x=>x.folder || x.name.match(extRe))


        function alphaSort(a, b){
            // convert to strings and force lowercase
            a = typeof a.name === 'string' ? a.name.toLowerCase() : a.name.toString()
            b = typeof b.name === 'string' ? b.name.toLowerCase() : b.name.toString()
            return a.localeCompare(b)
        }

        var fo = files.filter(x=>x.folder),
            fi = files.filter(x=>!x.folder)

        fo.sort(alphaSort)
        fi.sort(alphaSort)

        files = fo.concat(fi)

        files.unshift({
            name: '..',
            folder: true
        })


        browser.removeChild(list)
        list.innerHTML = ''
        for (let i in files) {
            var file = files[i]
            list.appendChild(html`
                <div class="file">
                    <input type="radio" value="${file.name}" name="file" class="${file.folder ? 'folder' : 'file'}"/>
                    <div class="label"><span>${raw(icon(file.folder ? 'folder' : 'osc'))} ${file.name}</span></div>
                </div>
            `)
        }


        browser.insertBefore(list, actions)


        if (save && saveInputFocus === undefined) {
            saveInput.focus()
        } else {
            list.childNodes[0].firstElementChild.focus()
        }

    }, {context: popup})

    popup.on('close', ()=>{
        ipc.off('listDir', null, popup)
        document.removeEventListener('keydown', keyDownHandler)
        document.removeEventListener('keyup', keyUpHandler)
        keyboardJS.setContext(previousKbContext)
    })

    browser.appendChild(ariane)
    browser.appendChild(list)
    browser.appendChild(actions)
    container.appendChild(browser)

    ipc.send('listDir', {extension: options.extension, path: options.directory ? [options.directory] : null})

    popup.open()
    keyboardJS.setContext('filebrowser')

}
