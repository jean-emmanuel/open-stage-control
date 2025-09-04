var settings = require('./settings'),
    http = require('http'),
    EventEmitter = require('events').EventEmitter,
    eventEmitter = new EventEmitter(),
    QRCode = require('qrcode'),
    qrcode = ''

function createServer(route) {
    if (settings.read('use-ssl')) {
        http = require('https')
        require('./ssl')
        return http.createServer(settings.read('ssl-certificate'), route)

    } else {
        return http.createServer(route)
    }
}

var path        = require('path'),
    fs          = require('fs'),
    send        = require('send'),
    replaceStream = require('replacestream'),
    auth        = require('./auth'),
    server      = createServer(auth ? auth.check(httpRoute) : httpRoute),
    Ipc         = require('./ipc/server'),
    ipc         = new Ipc(server),
    theme       = require('./theme').init(),
    zeroconf    = require('./zeroconf'),
    {resolveHomeDir} = require('./utils'),
    prod = !process.argv[0].includes('node_modules'),
    debug = settings.read('debug'),
    osc = {},
    clients = {},
    httpCheckTimeout


var clientOptions = {}
if (settings.read('client-options')) {
    for (var o of settings.read('client-options')) {
        if (!o.includes('=')) continue
        var [k, v] = o.split('=')
        clientOptions[k] = v
    }
}

var resolveDirs = theme.files.map(x=>path.dirname(x)),
    remoteRoot = settings.read('remote-root')

resolveDirs = resolveDirs.filter((x, index)=>{return resolveDirs.indexOf(x) === index})
resolveDirs.push(remoteRoot || '') // remote-root / absolute

function resolvePath(url, clientId) {

    var sessionPath

    if (ipc.clients[clientId]) {
        sessionPath = path.dirname(ipc.clients[clientId].sessionPath)
    }

    url = resolveHomeDir(url)
    url = url.split('?')[0]

    for (var i = sessionPath ? -1 : 0; i < resolveDirs.length; i++) {
        var p = i === -1 ? sessionPath : resolveDirs[i]

        if (i == resolveDirs.length - 1 && remoteRoot) {
            // strip out remote-root path from request url when resolving against it
            url = url.replace(settings.read('remote-root'), '')
        }

        p = path.resolve(path.join(p, url))

        if (fs.existsSync(p)) return p
    }

    if (debug && !ipc.clients[clientId]) {
        // safari seems to be picky with cookies
        if (clientId === undefined) console.log(`(DEBUG, HTTP) Could not resolve requested url ${url} (client id not found in http cookies)`)
        // this should never happen, but just in case...
        // it happens when importing css file from theme
        else console.log(`(DEBUG, HTTP) Requested url ${url} not resolved against session path (unregistered client id ${clientId})`)
    }

    return false

}

function httpRoute(req, res) {

    res.sendFile = (path)=>{
        var fpath = path.split('?')[0]
        if (!fs.existsSync(fpath)) throw `File "${fpath}" not found.`
        return send(req, fpath).pipe(res)
    }

    var url = req.url

    if (url === '/qrcode'){
        res.setHeader('Content-Type', 'image/svg+xml')
        let str = qrcode,
            buf = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from(str) : new Buffer(str)
        res.write(buf)
        res.end()

    } else if (url === '/' || url.indexOf('/?') === 0) {

        var ip = req.connection.remoteAddress.replace('::ffff:', '')

        fs.createReadStream(path.resolve(__dirname + '/../client/index.html'))
          .pipe(replaceStream('</body>', `
            <script>
                window.IP=${JSON.stringify(ip)}
                window.ENV=${JSON.stringify(clientOptions)}
                window.READ_ONLY=${JSON.stringify(settings.read('read-only'))}
                window.KIOSK=${settings.read('read-only') && settings.read('fullscreen') ? 'true' : 'false'}
                window.AUTH=\`${(req.headers.authorization || '').replace('Basic ', '').replace('/', '_')}\`
            </script></body>`))
          .pipe(res)

        // res.sendFile(path.resolve(__dirname + '/../client/index.html'))

    } else {

        if (
            url.indexOf('__OSC_ASSET__=1') != -1 ||
            url.indexOf('open-stage-control-client.js.map') != -1 ||
            url.indexOf('/client/workers') != -1
        ) {

            // osc asset files

            if (url.indexOf('theme.css') != -1) {

                res.setHeader('Content-Type', 'text/css')
                if (settings.read('theme')) {
                    let str = theme.get(),
                        buf = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from(str) : new Buffer(str)
                    res.write(buf)
                } else {
                    res.write('')
                }
                res.end()

            } else {

                if (prod) res.setHeader('Cache-Control', 'public, max-age=2592000')
                try {
                    res.sendFile(path.resolve(__dirname + '/../' + url))
                    return true
                } catch(e) {}

                console.error(`(ERROR, HTTP) File not found: ${url}`)
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

                resolvedPath = resolvePath(decodeURI(url), id)

                if (resolvedPath) {
                    try {
                        res.sendFile(resolvedPath)
                        return true
                    } catch(e) {}
                }

                console.error(`(ERROR, HTTP) File not found: ${url}`)
                res.writeHead(404)
                res.end()

            } else if (url.includes('/osc-ping')) {
                httpCheck(true)
            } else {
                res.writeHead(403)
                res.end()
            }

        }

    }
}

server.on('error', (e)=>{
    if (e.code === 'EADDRINUSE') {
        console.error(`(ERROR, HTTP) Could not open port ${oscInPort} (already in use) `)
    } else {
        console.error(`(ERROR, HTTP) ${e.message}`)
    }
})

server.listen(settings.read('port') || 8080)

http.get(settings.appAddresses()[0] + '/osc-ping', {
    auth: settings.read('authentication'),
    rejectUnauthorized: false
},()=>{}).on('error', ()=>{httpCheck(false)})

httpCheckTimeout = setTimeout(()=>{httpCheck(false)}, 5000)
function httpCheck(ok, error){
    if (!httpCheckTimeout) return
    clearTimeout(httpCheckTimeout)
    httpCheckTimeout = null
    if (ok) {
        console.log('(INFO) Server started, app available at \n    ' + settings.appAddresses().join('\n    '))
        eventEmitter.emit('serverStarted')
        QRCode.toString(settings.appAddresses().pop(),{type:'svg', small: true, margin: 1}, (err, qr)=>{
            qrcode = qr
        })
    } else {
        if (error) {
            console.error('(ERROR, HTTP) Server setup error: ' + error.message)
        }
        console.error('(ERROR, HTTP) Could not setup http server, maybe try a different port ?')
    }
}

zeroconf.publish({
    name: settings.infos.productName + (settings.read('instanceName') ? ' (' + settings.read('instanceName') + ')' : ''),
    type: 'http',
    port: settings.read('port') || 8080
}).on('error', (e)=>{
    console.error(`(ERROR, ZEROCONF) ${e.message}`)
})

var bindCallbacks = function(callbacks) {

    ipc.on('connection', function(client) {

        var clientInfos = {address: client.address, id: client.id}

        var customModule = settings.read('custom-module')

        for (let name in callbacks) {
            client.on(name, (data)=>{
                if (customModule) {
                    osc.customModuleEventEmitter.emit(name, data, clientInfos)
                }
                callbacks[name](data, client.id)
            })
        }

    })

}

module.exports =  {
    ipc:ipc,
    bindCallbacks:bindCallbacks,
    clients:clients,
    resolvePath:resolvePath,
    eventEmitter:eventEmitter
}

osc = require('./osc').server
