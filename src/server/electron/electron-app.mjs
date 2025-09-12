import {app, Menu, shell, BrowserWindow} from 'electron'
import * as settings from '../node/settings.mjs'
import infos from '../../../package.json'

app.setPath('userData', settings.configPath)

app.commandLine.appendSwitch('--ignore-certificate-errors')

app.commandLine.appendSwitch('--touch-events')

if (settings.read('disable-vsync')) {
    app.commandLine.appendSwitch('--disable-gpu-vsync')
}

if (settings.read('disable-gpu')) {
    app.disableHardwareAcceleration()
    app._noGpu = true
}

if (settings.read('force-gpu')) {
    app.commandLine.appendSwitch('--ignore-gpu-blacklist')
}



var template = [{
    label: 'Edit',
    submenu: [
        {role: 'undo', accelerator: 'CmdOrCtrl+Z'},
        {role: 'redo', accelerator: 'Shift+CmdOrCtrl+Z'},
        {type: 'separator'},
        {role: 'cut', accelerator: 'CmdOrCtrl+X'},
        {role: 'copy', accelerator: 'CmdOrCtrl+C'},
        {role: 'paste', accelerator: 'CmdOrCtrl+V'},
        {role: 'selectall', accelerator: 'CmdOrCtrl+A'}
    ]
}]

if (process.platform === 'darwin') {
    // Add app menu (macOs)
    template.unshift({
        label: settings.infos.productName,
        submenu: [
            {
                label: 'Hide ' + infos.productName,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: ()=>app.quit()
            }
        ]
    })
    template.push(
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    click: ()=>{
                        var win = BrowserWindow.getFocusedWindow()
                        if (win) win.close()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                },
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Documentation',
                    click: ()=>shell.openExternal(infos.homepage)
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Report an Issue',
                    click: ()=>shell.openExternal(infos.repository.url + '/issues')
                }
            ]
        }
    )
}


app.on('ready',()=>{
    var menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

export default app
