var cpr = require('cpr'),
    fs = require('fs'),
    path = require('path'),
    files = [
        ['../resources/images/logo_nobadge.png', '../app/assets/favicon.png'],
        ['../resources/images/logo.png', '../app/assets/logo.png'],
        ['../resources/images/logo_tray.png', '../app/assets/logo_tray.png'],
        ['../resources/images/logo_tray@x2.png', '../app/assets/logo_tray@x2.png'],
        ['../LICENSE', '../app/LICENSE'],
        ['../src/python/', '../app/server/python/'],
        ['../resources/fonts/', '../app/assets/fonts/'],
        ['../src/html/launcher.html', '../app/launcher/index.html'],
        ['../node_modules/fsevents/fsevents.node', '../app/server/fsevents.node'],
        ['../node_modules/ace-builds/src-min/worker-css.js', '../app/client/workers/worker-css.js'],
        ['../node_modules/ace-builds/src-min/worker-html.js', '../app/client/workers/worker-html.js'],
        ['../node_modules/ace-builds/src-min/worker-javascript.js', '../app/client/workers/worker-javascript.js'],
    ]

if (process.platform === 'darwin') {
    files.push(['../resources/images/logo_16x16.png', '../app/assets/logo_16x16.png'])
}

// Create necessary directories
var directories = [
    '../app',
    '../app/assets',
    '../app/assets/themes',
    '../app/client',
    '../app/client/workers',
    '../app/launcher',
    '../app/server'
]

for (var dir of directories) {
    fs.mkdirSync(path.resolve(__dirname + '/' + dir), { recursive: true })
}

for (var i in files) {
    cpr(...files[i].map(f => path.resolve(__dirname + '/' + f)), {
        overwrite: true
    })
}


var packageJson = require('../package.json'),
    appJson = {},
    copiedProps = [
        "name",
        "productName",
        "description",
        "version",
        "author",
        "repository",
        "homepage",
        "license",
        "yargs",
        "engines"
    ]

for (var k of copiedProps) {
    appJson[k] = packageJson[k]
}

appJson.main = appJson.bin = "index.js"
appJson.scripts = {
  "start": "electron index.js",
  "start-node": "node index.js"
}

appJson.optionalDependencies = {
    electron: packageJson.optionalDependencies.electron
}

fs.writeFileSync(path.resolve(__dirname + '/../app/package.json'), JSON.stringify(appJson, null, '  '))

var clientHtml = fs.readFileSync(path.resolve(__dirname + '/../src/html/client.html'))
    .toString()
    .replace(/\$\{([^\}]+)\}/g, (m, p1)=>{return appJson[p1]})

fs.writeFileSync(path.resolve(__dirname + '/../app/client/index.html'), clientHtml)

// Generate main entry point
var mainJs = "require('./server/open-stage-control-server')\n"
fs.writeFileSync(path.resolve(__dirname + '/../app/index.js'), mainJs)
