var runtime = 'node'

if (!process.argv.includes('-n') && !process.argv.includes('--no-gui')
    && process.versions.electron && !process.env.ELECTRON_RUN_AS_NODE)
{
    try {
        var electron = require('electron')
        electron.dialog.showErrorBox = (title, err)=>{
            console.error(title + ': ' + err)
        }
        runtime = 'electron'
    } catch {}
}

require(`./${runtime}/`)
