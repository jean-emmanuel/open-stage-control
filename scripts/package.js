const packager = require('@electron/packager'),
      path = require('path'),
      appData = require('../app/package.json'),
      safeFFMPEG = require('electron-packager-plugin-non-proprietary-codecs-ffmpeg').default,
      licensePath = path.resolve(__dirname + '/../LICENSE'),
      fs = require('fs')

var all = process.argv.includes('--all')

packager({
    dir: path.resolve(__dirname + '/../app'),
    name: appData.name,
    platform: all ? ['linux', 'win32', 'darwin'] : process.env.PLATFORM,
    arch: process.env.ARCH || 'x64',
    electronVersion:  process.env.ARCH === 'armv7l' ? '1.7.11' : require('../package.json').optionalDependencies.electron,
    overwrite: true,
    out: path.resolve(__dirname + '/../dist'),
    icon: path.resolve(__dirname + '/../resources/images/logo'),
    ignore: /(node_modules\/(serialport|uws)|docs\/fonts)/,
    afterExtract: [safeFFMPEG],
    prune: false
}).then((appPaths)=>{

    for (var appPath of appPaths) {
      var electronLicensePath = path.join(appPath, 'LICENSE')
      fs.copyFileSync(electronLicensePath, electronLicensePath + '.electron')
      fs.copyFileSync(licensePath, electronLicensePath)
    }

    console.warn('\x1b[36m%s\x1b[0m', '=> Build artifacts created in ' + path.resolve(__dirname + '/../dist'))

})
