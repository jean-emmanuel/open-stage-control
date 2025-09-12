import path from 'path'
import fs from 'fs'
import child_process from 'child_process'
import * as settings from '../settings'
import {deepCopy, resolveHomeDir} from '../utils'
import FragmentManager from '../fragment-manager'

export default class Callbacks {

    constructor(ipcServer, webServer, oscServer) {

        this.oscServer = oscServer
        this.ipcServer = ipcServer
        this.webServer = webServer

        this.fragmentManager = new FragmentManager(this, ipcServer, webServer)

        this.clipboardContent = {clipboard: null, idClipboard: null}
        this.widgetHashTable = {}
    }

    getEvents() {

        return Object.getOwnPropertyNames(this.__proto__)
                .filter(x=>!['constructor', 'getEvents'].includes(x))
                .filter(x=>typeof this[x] == 'function')

    }

    open(data, clientId) {
        // client connected

        this.ipcServer.send('connected')

        var recentSessions = settings.read('recentSessions')

        this.ipcServer.send('sessionList', recentSessions, clientId)
        this.ipcServer.send('clipboard', this.clipboardContent, clientId)
        this.ipcServer.send('serverTargets', settings.read('send'), clientId)

        if (settings.read('load') && !data.hotReload) return this.sessionOpen({path: settings.read('load')}, clientId)

    }

    close(data, clientId) {
        // client disconnected

    }

    created(data, clientId) {
        // client created or reconnected

        if (!this.widgetHashTable[clientId])  {
            this.widgetHashTable[clientId] = {CONSOLE: {typeTags: ''}}
        }

    }

    destroyed(data, clientId) {
        // client removed (timeout)

        // clear osc data cache
        if (this.widgetHashTable[clientId]) delete this.widgetHashTable[clientId]

    }

    clipboard(data, clientId) {
        // shared clipboard

        this.clipboardContent = data
        this.ipcServer.send('clipboard', data, null, clientId)

    }

    sessionAddToHistory(data) {

        var recentSessions = settings.read('recentSessions')

        fs.lstat(data, (err, stats)=>{

            if (err || !stats.isFile()) return

            // add session to history
            recentSessions.unshift(path.resolve(data))
            // remove doubles from history
            recentSessions = recentSessions.filter(function(elem, index, self) {
                return index == self.indexOf(elem)
            })

            // history size limit
            if (recentSessions.length > 10) recentSessions = recentSessions.slice(0, 10)

            // save history
            settings.write('recentSessions', recentSessions)

            this.ipcServer.send('sessionList', recentSessions)

        })
    }

    sessionRemoveFromHistory(data) {

        var recentSessions = settings.read('recentSessions')
        if (recentSessions.indexOf(data) > -1) {
            recentSessions.splice(recentSessions.indexOf(data),1)
            settings.write('recentSessions',recentSessions)
            this.ipcServer.send('sessionList', recentSessions)
        }

    }

    sessionSetPath(data, clientId) {
        // store client's current session file path

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (!settings.read('read-only')) {
            this.sessionAddToHistory(data.path)
        }

        this.ipcServer.clients[clientId].sessionPath = data.path

        this.ipcServer.send('setTitle', path.basename(data.path), clientId)

    }

    sessionOpen(data, clientId) {
        // attempt to read session file

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        this.fileRead(data, clientId, true, (result)=>{

            this.ipcServer.clients[clientId].sessionPath = data.path // for resolving local file requests
            this.ipcServer.send('sessionOpen', {path: data.path, fileContent: result}, clientId)

        }, (error)=>{

            this.ipcServer.send('error', `Could not open session file:\n ${error}`)

        })

    }

    fragmentLoad(data, clientId) {
        // attempt to read session file

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        this.fragmentManager.loadFragment(data, clientId)

    }

    sessionOpened(data, clientId) {
        // session file opened successfully

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (settings.read('state')) {
            var send = true
            for (var id in this.ipcServer.clients) {
                // only make the client send its osc state if there are no other active clients
                if (id !== clientId && this.ipcServer.clients[id].connected()) {
                    send = false
                }
            }

            var stateContent = fs.readFileSync(settings.read('state'), 'utf8')
            if (stateContent[0] === '\ufeff') stateContent = stateContent.slice(1) // remove BOM
            var state = {
                state: JSON.parse(stateContent),
                send: send
            }
            this.ipcServer.send('stateLoad', state, clientId)
        }

        this.ipcServer.send('stateSend', null, null, clientId)

        this.sessionSetPath({path: data.path}, clientId)

    }

    fileRead(data, clientId, ok, callback, errorCallback) {
        // private function

        if (!ok) return

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        data.path = resolveHomeDir(data.path)

        if (!path.isAbsolute(data.path) && settings.read('remote-root')) data.path =  path.resolve(resolveHomeDir(settings.read('remote-root')), data.path)

        fs.readFile(data.path, 'utf8', (err, result)=>{

            var error

            if (err) {
                error = err
            } else {
                try {
                    if (result[0] === '\ufeff') result = result.slice(1) // remove BOM
                    result = data.raw ? result : JSON.parse(result)
                    callback(result)
                } catch(err) {
                    error = err
                }
            }

            if (error && errorCallback) errorCallback(error)

        })

    }

    fileSave(data, clientId, ok, callback) {
        // private function

        if (!ok) return

        if (!data.path || settings.read('remote-saving') && !RegExp(settings.read('remote-saving')).test(this.ipcServer.clients[clientId].address)) {

            return this.ipcServer.send('notify', {
                icon: 'save',
                locale: 'remotesave_forbidden',
                class: 'error'
            }, clientId)

        }

        if (data.path) {

            if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

            data.path = resolveHomeDir(data.path)

            if (!path.isAbsolute(data.path) && settings.read('remote-root')) data.path =  path.resolve(settings.read('remote-root'), data.path)

            var root = resolveHomeDir(settings.read('remote-root'))
            if (root && !path.normalize(data.path).includes(path.normalize(root))) {
                console.error('(ERROR) Could not save: path outside of remote-root')
                return this.ipcServer.send('notify', {
                    class: 'error',
                    locale: 'remotesave_fail',
                    message: ' (Could not save: path outside of remote-root)'
                }, clientId)
            }

            try {
                JSON.parse(data.session)
            } catch(e) {
                return console.error('(ERROR) Could not save: invalid file')
            }

            fs.writeFile(data.path, data.session, function(err, fdata) {

                if (err) return this.ipcServer.send('notify', {
                    class: 'error',
                    locale: 'remotesave_fail',
                    message: ' (' + err.message + ')'
                }, clientId)


                this.ipcServer.send('notify', {
                    icon: 'save',
                    locale: 'remotesave_success',
                    class: 'session-save',
                    message: ' ('+ path.basename(data.path) +')'
                }, clientId)

                callback()

            })

        }

    }

    stateOpen(data, clientId) {
        // attempt to open state file

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        this.fileRead(data, clientId, true, (result)=>{

            this.ipcServer.send('stateLoad', {state: result, path: data.path, send: true}, clientId)

        }, (error)=>{

            this.ipcServer.send('error', `Could not open state file:\n ${error}`)

        })

    }

    sessionSave(data, clientId) {
        // save session file (.json)

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (!path.basename(data.path).match(/.*\.json$/)) return console.error('(ERROR) Sessions must be saved as .json files')

        if (data.backup) {
            var newpath, i = 0
            for (;;) {
                newpath = data.path.replace(/\.json$/, '-backup' + String(i).padStart(3, 0) + '.json')
                if (fs.existsSync(newpath)) i++
                else {
                    data.path = newpath
                    break
                }
            }
        }


        this.fileSave(data, clientId, true, ()=>{

            console.log('(INFO) Session file saved in '+ data.path)

            if (!data.backup) this.ipcServer.send('sessionSaved', clientId)

            // reload session in other clients
            for (var id in this.ipcServer.clients) {
                if (id !== clientId && this.ipcServer.clients[id].sessionPath === data.path) {
                    this.sessionOpen({path: data.path}, id)
                }
            }

            if (!data.backup) this.sessionSetPath({path: data.path}, clientId)

        })

    }

    stateSave(data, clientId) {
        // save state file (.json)

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (!path.basename(data.path).match(/.*\.state/)) return console.error('(ERROR) Statesaves must be saved as .state files')

        this.fileSave(data, clientId, true, ()=>{

            console.log('(INFO) State file saved in '+ data.path)

        })

    }

    syncOsc(shortdata, clientId) {
        // sync osc (or midi) message with other clients

        // if widget hash is provided, look for cached data
        if (!(this.widgetHashTable[clientId] && this.widgetHashTable[clientId][shortdata.h])) return

        var value = shortdata.v,
            data = shortdata.h ? this.widgetHashTable[clientId][shortdata.h] : {}

        data = deepCopy(data)
        for (var k in shortdata) {
            data[k] = shortdata[k]
        }

        // only rawTarget will be used
        delete data.target

        data.args = data.preArgs ? data.preArgs.concat(value) : [value]

        if (!data.noSync) this.ipcServer.send('receiveOsc', data, null, clientId)


    }

    sendOsc(shortdata, clientId) {
        // send osc (or midi) message and sync with other clients
        // shortdata
        //     {
        //         h: 'widget_uuid',
        //         v: widget_value,
        //         ... // target, preArgs, address, typeTags
        //             // override cached data
        //             // required if data.h is not provided
        //     }


        // if widget hash is provided, look for cached data
        if (shortdata.h && !(this.widgetHashTable[clientId] && this.widgetHashTable[clientId][shortdata.h])) return

        var value = shortdata.v,
            data = shortdata.h ? this.widgetHashTable[clientId][shortdata.h] : {}

        data = deepCopy(data)
        for (var k in shortdata) {
            data[k] = shortdata[k]
        }

        if (data.target) {

            var targets = []

            if (!shortdata.i && settings.read('send') && !shortdata.target) Array.prototype.push.apply(targets, settings.read('send'))
            if (data.target) Array.prototype.push.apply(targets, data.target)

            data.args = data.preArgs ? data.preArgs.concat(value) : [value]

            for (var i in targets) {

                if (targets[i] === 'self') {
                    this.ipcServer.send('receiveOsc',data,clientId)
                    continue
                } else if (targets[i] === null) {
                    continue
                }

                var host = targets[i].split(':')[0],
                    port = targets[i].split(':')[1]

                if (port) {

                    this.oscServer.send(host, port, data.address, data.args, data.typeTags, clientId)

                }

            }

        }

        if (!data.noSync) this.ipcServer.send('receiveOsc', data, null, clientId)

    }

    addWidget(data, clientId) {
        // cache widget osc data to reduce bandwidth usage
        // data
        //     {
        //         hash: 'widget_uuid',
        //         data: {
        //             target: ['host:port', ...],
        //             preArgs: [arg1, ...],
        //             address: '/address',
        //             typeTags: 'iif' // one letter per arg typetag
        //         }
        //     }
        //     preArgs, target and typeTags can be empty strings

        if (!this.widgetHashTable[clientId][data.hash])  {
            this.widgetHashTable[clientId][data.hash] = {}
        }

        var cache = this.widgetHashTable[clientId][data.hash],
            widgetData = data.data

        for (var k in widgetData) {
            if ((k === 'target' || k === 'preArgs')) {
                if (widgetData[k] !== '') {
                    cache[k] = Array.isArray(widgetData[k]) ? widgetData[k] : [widgetData[k]]
                } else {
                    cache[k] = []
                }
            } else {
                cache[k] = widgetData[k]
            }
        }

        // store raw target for client sync widget matching
        cache._rawTarget = widgetData.target

    }

    removeWidget(data, clientId) {
        // clear widget osc data

        delete this.widgetHashTable[clientId][data.hash]

    }

    reload(data) {
        // (dev) hot reload
        this.ipcServer.send('reload')

    }

    reloadCss() {
        // (dev) hot css reload
        this.ipcServer.send('reloadCss')
    }

    log(data) {
        console.log(data)
    }

    error(data) {
        console.error(data)
    }

    errorLog(data) {
        console.error(data)
    }

    errorPopup(data) {
        this.ipcServer.send('error', data)
    }

    listDir(data, clientId) {
        // remote file browser backend

        if (data.path) {
            // path is requested
            data.path[0] = resolveHomeDir(data.path[0])
        } else if (settings.read('last-dir') && fs.existsSync(settings.read('last-dir'))) {
            // attempt to use last visited directory
            data.path = [settings.read('last-dir')]
        } else {
            // default directory fallback
            data.path = [resolveHomeDir('~/')]
        }

        var p = path.resolve(...data.path),
            root = resolveHomeDir(settings.read('remote-root'))

        if (root && !path.normalize(p).includes(path.normalize(root))) p = root


        if (process.platform === 'win32' && !root) {
            // Drive list hack on windows
            if (data.path.length === 2 && data.path[1] === '..' && (data.path[0].match(/^[A-Z]:\\$/) || data.path[0] === '\\')) {

                child_process.exec('(get-wmiobject win32_volume | ? { $_.DriveType -eq 3 } | % { get-psdrive $_.DriveLetter[0] }).Root -join " "', {shell: 'powershell.exe'}, (error, stdout) => {

                    if (error) {

                        this.ipcServer.send('notify', {class: 'error', message: 'Failed to list available drives (see server console).'}, clientId)
                        console.error('(ERROR) Failed to list available drives.')
                        console.error(error.stack)

                    } else {

                        this.ipcServer.send('listDir', {
                            path: '\\',
                            files: stdout.split(' ')
                                .filter(value => /[A-Za-z]:/.test(value))
                                .map(value => {return {name: value.trim(), folder: true}})
                        }, clientId)

                    }
                })
                return
            }
        }

        fs.readdir(p, (err, files)=>{
            if (err) {
                this.ipcServer.send('notify', {class: 'error', message: err.message}, clientId)
                throw err
            } else {
                var extRe = data.extension ? new RegExp('.*\\.' + data.extension + '$') : /.*/
                var list = files.filter(x=>x[0] !== '.').map((x)=>{
                    var folder = false
                    try {
                        folder = fs.statSync(path.resolve(p, x)).isDirectory()
                    } catch(e) {}
                    return {
                        name: x,
                        folder
                    }
                })
                list = list.filter(x=>x.folder || x.name.match(extRe))
                this.ipcServer.send('listDir', {
                    path: p,
                    files: list
                }, clientId)
                settings.write('last-dir', p, false, false)
            }
        })

    }

}
