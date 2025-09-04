var build = require('./build'),
    babelify = require('babelify'),
    fs = require('fs'),
    path = require('path')

// Ensure output directory exists
var outputDir = path.resolve(__dirname + '/../app/server')
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

build({
    input: '../src/server/index.js',
    output: '../app/server/open-stage-control-server.js',
    options: {
        commonDir: false,
        ignoreMissing: true,
        debug: true,
        builtins: false,
        commondir: false,
        insertGlobalVars: {
            __filename: true,
            __dirname: true,
            process: true,
            electron: true,
            global: true
        },
        browserField: false,
    },
    ignore: 'serialport',
    exclude: [
        'electron',
        './fsevents.node'  // osx binary module, to be copied as is
    ]
})()
