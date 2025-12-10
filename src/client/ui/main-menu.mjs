import NoSleep from 'nosleep.js'
import UiToolbar from './ui-toolbar.mjs'
import ipc from '../ipc/index.mjs'
import locales from '../locales/index.mjs'
import notifications from './notifications.mjs'
import fullscreen from './fullscreen.mjs'
import editor from '../editor/index.mjs'
import sessionManager from '../managers/session/index.mjs'
import stateManager from '../managers/state.mjs'
import {leftUiSidePanel, rightUiSidePanel} from '../ui/index.mjs'
import uiConsole from '../ui/ui-console.mjs'
import {READ_ONLY, KIOSK, VIRTUAL_KEYBOARD, setVIRTUAL_KEYBOARD} from '../globals.mjs'
import {device} from './utils.mjs'


var recentSessions = [{label: locales('file_open_recent_wait'), class: 'disabled'}]
var menuEntries = [

    {
        label: locales('session'),
        disabled: READ_ONLY,
        action: [
            {
                label: locales('session_new'),
                action: sessionManager.create.bind(sessionManager),
            },
            {
                separator: true
            },
            {
                label: locales('file_open'),
                action: sessionManager.browse.bind(sessionManager),
                shortcut: 'mod + o',
            },
            {
                label: locales('file_open_recent'),
                action: recentSessions,
                class: ()=>{return !recentSessions.length ? 'disabled' :''}
            },
            {
                separator: true
            },
            {
                label: locales('file_save'),
                action: sessionManager.save.bind(sessionManager),
                shortcut: 'mod + s',
                class: ()=>{return sessionManager.session === null ? 'disabled' :''}
            },
            {
                label: locales('file_save_as'),
                action: sessionManager.saveAs.bind(sessionManager),
                shortcut: 'mod + shift + s',
                class: ()=>{return sessionManager.session === null ? 'disabled' :''}
            },
            {
                label: locales('fragment_mode'),
                class: ()=>{return 'toggle ' + (sessionManager.saveMode === 'fragment' ? 'on' : 'off')},
                action: ()=>{sessionManager.setSaveMode(sessionManager.saveMode === 'session' ? 'fragment' : 'session')}
            },
            {
                separator: true
            },
            {
                label: locales('file_backup'),
                action: sessionManager.saveBackup.bind(sessionManager),
                shortcut: 'mod + b',
                class: ()=>{return sessionManager.session === null || !sessionManager.sessionPath ? 'disabled' :''}
            },
            {
                separator: true
            },
            {
                label: locales('file_import'),
                action: sessionManager.import.bind(sessionManager),
            },
            {
                label: locales('file_export'),
                action: sessionManager.export.bind(sessionManager),
                class: ()=>{return sessionManager.session === null ? 'disabled' :''}
            },

        ]
    },
    {
        label: locales('state'),
        disabled: READ_ONLY,
        class: ()=>{return sessionManager.session === null ? 'disabled' : ''},
        action: [
            {
                label: locales('state_store'),
                action: stateManager.quickSave.bind(stateManager)
            },
            {
                label: locales('state_recall'),
                class: ()=>{return stateManager.quickState === null ? 'disabled' : ''},
                action: stateManager.quickLoad.bind(stateManager)
            },
            {
                label: locales('state_send'),
                action: ()=>{
                    stateManager.send()
                    notifications.add({
                        icon: 'sliders-h',
                        message: locales('state_sendsuccess')
                    })
                }
            },
            {
                separator: true
            },
            {
                label: locales('file_open'),
                action: stateManager.browse.bind(stateManager),
            },
            {
                label: locales('file_save'),
                action: stateManager.save.bind(stateManager),
            },
            {
                label: locales('file_save_as'),
                action: stateManager.saveAs.bind(stateManager),
            },
            {
                separator: true
            },
            {
                label: locales('file_import'),
                action: stateManager.import.bind(stateManager),
            },
            {
                label: locales('file_export'),
                action: stateManager.export.bind(stateManager),
            },
        ]
    },
    {
        label: locales('editor'),
        disabled: READ_ONLY,
        class: ()=>{return sessionManager.session === null ? 'disabled' : ''},
        action: [
            {
                label: locales('editor_enabled'),
                class: ()=>{return 'toggle ' + (editor.enabled ? 'on' : 'off')},
                action: ()=>{
                    if (editor.enabled) editor.disable()
                    else editor.enable()
                },
                shortcut: 'mod + e'
            },
            {
                separator: true
            },
            {
                label: locales('editor_grid'),
                class: ()=>{return 'toggle ' + (editor.grid ? 'on' : 'off')},
                action: editor.toggleGrid.bind(editor),
                shortcut: 'mod + g'

            },
            {
                label: locales('editor_tree'),
                class: ()=>{return 'toggle ' + (leftUiSidePanel.minimized ? 'off' : 'on')},
                action: ()=>{return leftUiSidePanel.minimized ? leftUiSidePanel.restore() : leftUiSidePanel.minimize()},
                shortcut: 'mod + t'


            },
            {
                label: locales('editor_inspector'),
                class: ()=>{return 'toggle ' + (rightUiSidePanel.minimized ? 'off' : 'on')},
                action: ()=>{return rightUiSidePanel.minimized ? rightUiSidePanel.restore() : rightUiSidePanel.minimize()},
                shortcut: 'mod + i'
            },
            {
                separator: true
            },
            {
                label: locales('editor_percents'),
                class: ()=>{return 'toggle ' + (editor.usePercents ? 'on' : 'off')},
                action: ()=>{editor.usePercents = !editor.usePercents}
            }
        ]
    },
    {
        label: locales('console'),
        disabled: READ_ONLY,
        action: [
            {
                label: locales('console_enabled'),
                class: ()=>{return 'toggle ' + (uiConsole.minimized ? 'off' : 'on')},
                action: ()=>{
                    if (uiConsole.minimized) {
                        uiConsole.restore()
                        uiConsole.input.focus()
                    } else {
                        uiConsole.minimize()
                    }
                },
                shortcut: 'mod + k'
            },
            {
                separator: true
            },
            {
                label: locales('console_clear'),
                action: uiConsole.clear.bind(uiConsole),
                shortcut: 'mod + l'
            },
        ]
    },
    {
        separator: true
    },
    {
        label: locales('fullscreen'),
        disabled: KIOSK && navigator.userAgent.match(/OpenStageControl/), // built-in electron client only
        class: ()=>{return 'toggle ' + (fullscreen.isFullscreen ? 'on' : 'off')},
        action: ()=>{
            if (fullscreen.isEnabled) fullscreen.toggle()
        },
        shortcut: 'f11'
    },
    {
        label: locales('notifications'),
        class: ()=>{return 'toggle ' + (notifications.visible ? 'on' : 'off')},
        action: ()=>{
            notifications.setVisibility(!notifications.visible)
        }
    }

]

if (device.is('mobile') || device.is('tablet')) {


    var noSleep = new NoSleep(),
        noSleepState = false,
        wakeLock = null

    menuEntries.push({
        label: locales('nosleep'),
        class: ()=>{return 'toggle ' + (noSleepState ? 'on' : 'off')},
        action:()=>{
            noSleepState = !noSleepState
            if (noSleepState) {
                if ('wakeLock' in navigator) {
                    navigator.wakeLock.request('screen').then((l)=>{
                        wakeLock = l
                        wakeLock.addEventListener("release", ()=>{
                            noSleepState = false
                        })
                    }).catch((err)=>{
                        console.error(`Could not acquire wake lock:\n${err.name}, ${err.message}`)
                        wakeLock = null
                    })
                }
                if (wakeLock === null) noSleep.enable()
            } else {
                if ('wakeLock' in navigator && wakeLock !== null) {
                    wakeLock.release().then(()=>{
                        wakeLock = null
                    })
                } else {
                    noSleep.disable()
                }
            }
        }
    })

} else {

    menuEntries.push({
        label: locales('keyboard'),
        class: ()=>{return 'toggle ' + (VIRTUAL_KEYBOARD ? 'on' : 'off')},
        action: ()=>{
            setVIRTUAL_KEYBOARD(!VIRTUAL_KEYBOARD)
        }
    })

}





class MainMenu extends UiToolbar {

    constructor(options) {

        super(options)

        ipc.on('sessionList', (data)=>{
            if (recentSessions.length) {
                recentSessions.splice(0, 10)
            }
            for (let s of data) [
                recentSessions.push({
                    label: s,
                    action: ()=>{sessionManager.requestOpen(s)}
                })
            ]
        })

    }

}


export default new MainMenu({selector: '#main-menu', position: [40, 1], entries: menuEntries})
