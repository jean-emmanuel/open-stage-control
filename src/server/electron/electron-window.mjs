import path from 'path'
import {BrowserWindow, dialog, shell, screen, Menu, MenuItem} from 'electron'
import shortcut from 'electron-localshortcut'
import app from './electron-app.mjs'
import * as settings from '../node/settings.mjs'

export default function(options={}) {

    var window

    window = new BrowserWindow({
        title: options.title || settings.infos.productName,
        icon: path.resolve(__dirname + '/../../assets/logo.png'),
        backgroundColor: options.color,
        type: options.type,
        useContentSize: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: !!options.node,
            contextIsolation: !options.node,
            enableRemoteModule: !!options.node
        },
        show: false,
    })



    // default geometry
    var currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()),
        screenSize = currentScreen.size,
        width = options.width || screenSize.width,
        height = options.height || screenSize.height,
        bounds = currentScreen.bounds,
        x = Math.ceil(bounds.x + ((bounds.width - width) / 2)),
        y = Math.ceil(bounds.y + ((bounds.height - height) / 2)),
        geometry = {x, y, width, height}

    // retrieve last geometry
    if (settings.read('geometry') && settings.read('geometry')[options.id]) {
        var last_geometry = settings.read('geometry')[options.id],
            mScreen = screen.getDisplayMatching(geometry)
        if (intersectionArea(geometry, mScreen.bounds) > 20000) {
            // don't load geometry if the window is not visible enough
            Object.assign(geometry, last_geometry)
        }
    }

    if (options.id === 'client') {
        if (settings.read('client-position')) {
            [x, y] =  settings.read('client-position').split(',').map(x=>parseInt(x))
            Object.assign(geometry, {x, y})
        }

        if (settings.read('client-size')) {
            [width, height] =  settings.read('client-size').split(',').map(x=>parseInt(x))
            Object.assign(geometry, {width, height})
        }
    }

    window.setBounds(geometry)

    window.once('ready-to-show', ()=>{
        if (options.id === 'launcher' && settings.read('startMinimized')) {
            if (settings.read('useTray') || process.platform === 'darwin') {
                window.hide()
            } else {
                window.show()
                window.minimize()
            }
        } else {
            window.show()
        }
    })

    if (options.id === 'launcher' && process.platform === 'darwin' && settings.read('startMinimized')) {
        app.on('activate', ()=>{
            if (!window.isDestroyed()) window.show()
        })
    }

    window.webContents.once('page-title-updated', ()=>{
        if (options.fullscreen) {
            window.webContents.executeJavaScript('window.ELECTRON_FULLSCREEN()', true)
        }
        if (app._noGpu) {
            window.webContents.executeJavaScript(`
                window.ELECTRON_NOGPU = true
            `)
        }
    })


    window.webContents.on('will-prevent-unload', (event)=>{
        var choice = dialog.showMessageBoxSync(window, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Are you sure ?',
            message: 'Unsaved data will be lost. Are you sure you want to quit?',
            defaultId: 0,
            cancelId: 1
        })
        if (choice === 0) {
            event.preventDefault()
        }
    })


    window.webContents.on('certificate-error', function(event, url, error, certificate, callback) {
        if (error === 'net::ERR_CERT_AUTHORITY_INVALID') {
            // self signed certificate is ok
            event.preventDefault()
            callback(true)
        }
    })

    window.webContents.on('login', function(event, request, authInfo, callback) {
        event.preventDefault()
        var [name, pwd] = settings.read('authentication').split(':')
        callback(name, pwd)
    })

    // window.webContents.on('will-navigate', (event)=>event.preventDefault())
    window.webContents.on('new-window', (event, url)=>{
        event.preventDefault()
        shell.openExternal(url)
    })


    window.webContents.on('console-message', (event, level, message)=>{

        if (level === 0 && message === 'ELECTRON.BLUR()') window.blur()
        if (level === 0 && message === 'ELECTRON.FOCUS()') window.focus()
        if (level === 0 && message === 'ELECTRON.SETFOCUSABLE(1)') {
            window.setFocusable(true)
            window.focus()
        }
        if (level === 0 && message === 'ELECTRON.SETFOCUSABLE(0)') {
            window.setFocusable(false)
            window.blur()
        }

    })

    window.webContents.setVisualZoomLevelLimits(1, 1)

    window.on('closed', function() {
        window = null
    })

    window.setMenu(null)

    window.loadURL(options.address)

    if (process.platform === 'linux') {
        // already registered in app menu on macOs
        // already bound to alt+f4 on windows
        window.webContents.on('before-input-event', (e, input)=>{
            // using before-input-event because electron-localshortcut
            // gets azerty keyboards wrong (ctrl + z would also be caught)
            if ((input.key === 'w' || input.key === 'W') && input.control && input.type === 'keyDown') {
                window.close()
            }
        })
    }

    window.on('close', function() {
        // save geometry
        var geometry = settings.read('geometry') || {}
        geometry[options.id] = window.getBounds()
        settings.write('geometry', geometry, false, true)
    })

    var menu = new Menu()
    menu.append(new MenuItem({role: 'cut'}))
    menu.append(new MenuItem({role: 'copy'}))
    menu.append(new MenuItem({role: 'paste'}))
    window.webContents.on('context-menu', (e, data) => {
        menu.items[0].enabled = data.editFlags.canPaste
        menu.items[1].enabled = data.editFlags.canCopy
        menu.items[2].enabled = data.editFlags.canPaste
        menu.popup({window: window, x: e.x, y: e.y })
    }, false)

    if (options.shortcuts && !settings.read('read-only')) {

        shortcut.register(window,'CmdOrCtrl+R',function(){
            window.reload()
        })

        shortcut.register(window,'F12',function(){
            window.toggleDevTools()
        })

    } else {
        shortcut.register(window,'CmdOrCtrl+R',function(e){
            return false
        })
    }

    window.setFocusable(!options.noFocus)


    return window

}


function intersectionArea(a, b) {
    // intersectionArea between two rectangles

    var width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
        height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)

    return width * height

}
