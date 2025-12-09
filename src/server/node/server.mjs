import http from 'http'
import https from 'https'
import {EventEmitter} from 'events'
import path from 'path'
import fs from 'fs'
import send from 'send'
import replaceStream from 'replacestream'
import * as settings from './settings.mjs'
import './ssl.mjs'
import auth from './auth.mjs'
import theme from './theme.mjs'
import zeroconf from './zeroconf.mjs'
import qrcode from './qrcode.mjs'
import {resolveHomeDir} from './utils.mjs'

class WebServer extends EventEmitter {

    constructor() {

        super()

        this.ipcServer = null

        this.qrcode = ''
        this.prod = !process.argv[0].includes('node_modules'),
        this.debug = settings.read('debug'),
        this.remoteRoot = settings.read('remote-root')

        var route = auth ? auth.check(this.httpRoute.bind(this)) : this.httpRoute.bind(this)
        if (settings.read('use-ssl')) {
            this.server = https.createServer(settings.read('ssl-certificate'), route)
        } else {
            this.server = http.createServer(route)
        }

        // file request resolution directories
        // add theme dirs
        this.resolveDirs = theme.files.map(x=>path.dirname(x)),
        // dedupe
        this.resolveDirs = this.resolveDirs.filter((x, index)=>{return this.resolveDirs.indexOf(x) === index})
        // add remote root or absolute
        this.resolveDirs.push(this.remoteRoot || '')

        this.ignoredNotFound = [
            '/apple-touch-icon-precomposed.png',
            '/favicon.ico',
            '/apple-touch-icon.png'
        ]


    }

    start(ipcServer) {

        this.ipcServer = ipcServer


        theme.on('update', ()=>{
            ipcServer.send('reloadCss')
        })

        this.server.listen(settings.read('port') || 8080)

        var proto = settings.read('use-ssl') ? https : http
        proto.get(settings.appAddresses()[0] + '/osc-ping', {
            auth: settings.read('authentication'),
            rejectUnauthorized: false
        },()=>{}).on('error', ()=>{this.httpCheck(false)})

        this.httpCheckTimeout = setTimeout(()=>{this.httpCheck(false)}, 5000)

        zeroconf.publish({
            name: settings.infos.productName + (settings.read('instanceName') ? ' (' + settings.read('instanceName') + ')' : ''),
            type: 'http',
            port: settings.read('port') || 8080
        }).on('error', (e)=>{
            console.error(`(ERROR, ZEROCONF) ${e.message}`)
        })

        this.server.on('error', (e)=>{
            if (e.code === 'EADDRINUSE') {
                console.error(`(ERROR, HTTP) Could not open port ${this.port} (already in use) `)
            } else {
                console.error(`(ERROR, HTTP) ${e.message}`)
            }
        })

    }

    stop() {

        this.server.close()

    }

    resolvePath(url, clientId) {

        var sessionPath

        if (this.ipcServer.clients[clientId]) {
            sessionPath = path.dirname(this.ipcServer.clients[clientId].sessionPath)
        }

        url = resolveHomeDir(url)
        url = url.split('?')[0]

        for (var i = sessionPath ? -1 : 0; i < this.resolveDirs.length; i++) {
            var p = i === -1 ? sessionPath : this.resolveDirs[i]

            if (i == this.resolveDirs.length - 1 && this.remoteRoot) {
                // strip out remote-root path from request url when resolving against it
                url = url.replace(settings.read('remote-root'), '')
            }

            p = path.resolve(path.join(p, url))

            if (fs.existsSync(p)) return p
        }

        if (this.debug && !this.ipcServer.clients[clientId]) {
            // safari seems to be picky with cookies
            if (clientId === undefined) console.log(`(DEBUG, HTTP) Could not resolve requested url ${url} (client id not found in http cookies)`)
            // this should never happen, but just in case...
            // it happens when importing css file from theme
            else console.log(`(DEBUG, HTTP) Requested url ${url} not resolved against session path (unregistered client id ${clientId})`)
        }

        return false

    }

    httpRoute(req, res) {

        res.sendFile = (path)=>{
            var fpath = path.split('?')[0]
            var stats = fs.statSync(fpath)
            if (!stats || !stats.isFile()) {
                throw `File "${fpath}" not found.`
            }
            var lastModified = new Date(stats.mtime)
            lastModified.setMilliseconds(0)
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader("Last-Modified", lastModified.toUTCString())
            if (
                req.headers['if-modified-since'] && new Date(req.headers['if-modified-since']).getTime() >= lastModified.getTime()
            ) {
                res.statusCode = 304
                res.end()
                return
            }
            return send(req, fpath).pipe(res)
        }

        var url = req.url

        if (url === '/qrcode'){
            res.setHeader('Content-Type', 'image/svg+xml')
            let str = this.qrcode,
                buf = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from(str) : new Buffer(str)
            res.write(buf)
            res.end()

        } else if (url === '/' || url.indexOf('/?') === 0) {

            var ip = req.connection.remoteAddress.replace('::ffff:', '')

            var clientOptions = {}
            if (settings.read('client-options')) {
                for (var o of settings.read('client-options')) {
                    if (!o.includes('=')) continue
                    var [k, v] = o.split('=')
                    clientOptions[k] = v
                }
            }
            res.setHeader('Cache-Control', 'no-store')
            fs.createReadStream(path.resolve(__dirname + '/../../client/index.html'))
              .pipe(replaceStream('</body>', `
                <script>
                    window.IP=${JSON.stringify(ip)}
                    window.ENV=${JSON.stringify(clientOptions)}
                    window.READ_ONLY=${JSON.stringify(settings.read('read-only'))}
                    window.KIOSK=${settings.read('read-only') && settings.read('fullscreen') ? 'true' : 'false'}
                    window.AUTH=\`${(req.headers.authorization || '').replace('Basic ', '').replace('/', '_')}\`
                </script></body>`))
              .pipe(res)

        } else {

            if (
                url.indexOf('/assets/') == 0 ||
                url.indexOf('/client/') == 0
            ) {

                // osc asset files

                if (url.indexOf('theme.css') != -1) {

                    res.setHeader('Content-Type', 'text/css')

                    var etag = settings.read('theme') ? theme.hash : 'empty-theme'
                    res.setHeader('Cache-Control', 'no-cache')
                    res.setHeader('ETag', etag)
                    if (req.headers['if-none-match'] && req.headers['if-none-match'] === etag) {
                        res.statusCode = 304
                        res.end()
                        return
                    }

                    if (settings.read('theme')) {
                        let str = theme.get(),
                            buf = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from(str) : new Buffer(str)
                        res.write(buf)
                    } else {
                        res.write('')
                    }
                    res.end()

                } else {

                    try {
                        res.sendFile(path.resolve(__dirname + '/../../' + url))
                        return true
                    } catch(e) {}


                    console.error(`(ERROR, HTTP) File not found: ${url}`)

                    if (url.match(/\/client\/index.*\.js/)) {
                        console.warn('(WARNING) It seems a client attempted to load an older version of the app,',
                            'this may occur when using a homescreen bookmark on mobile devices.',
                            'If that\'s the case, please delete it and browse to the app\'s url again.')
                    }

                    res.writeHead(404)
                    res.end()

                }

            } else {

                // user files

                // windows absolute path fix
                url = url.replace('_:_', ':') // escaped drive colon
                url = url.replace(/^\/([^/]*:)/, '$1') // strip leading slash

                if (url.match(/.(svg|jpg|jpeg|png|apng|gif|webp|tiff|xbm|bmp|ico|ttf|otf|woff|woff2|html|css|js)(\?[0-9]*)?$/i)) {

                    // Resolution order: session path, theme path, absolute path
                    var id
                    if (req.headers.cookie) {
                        id = (req.headers.cookie.match(/client_id=([^;]+)/) || [])[1]
                    }

                    var resolvedPath = this.resolvePath(decodeURI(url), id)

                    if (resolvedPath) {
                        try {
                            res.sendFile(resolvedPath)
                            return true
                        } catch(e) {}
                    }

                    if (!this.ignoredNotFound.includes(url)) {
                        console.error(`(ERROR, HTTP) File not found: ${url}`)
                    }

                    res.writeHead(404)
                    res.end()

                } else if (url.includes('/osc-ping')) {
                    this.httpCheck(true)
                } else {
                    res.writeHead(403)
                    res.end()
                }

            }

        }
    }

    httpCheck(ok, error) {

        if (!this.httpCheckTimeout) return

        clearTimeout(this.httpCheckTimeout)
        this.httpCheckTimeout = null

        if (ok) {
            console.log('(INFO) Server started, app available at \n    ' + settings.appAddresses().join('\n    '))
            this.emit('serverStarted')
            qrcode('file', (qr)=>{
                this.qrcode = qr
            })
        } else {
            if (error) {
                console.error('(ERROR, HTTP) Server setup error: ' + error.message)
            }
            console.error('(ERROR, HTTP) Could not setup http server, maybe try a different port ?')
        }

    }
}

export default WebServer
