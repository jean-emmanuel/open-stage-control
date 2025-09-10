// Very simple test: load a session with 1 widget of each type
var fs = require('fs')

// create tmp session file

var session = {type: 'root', tabs:[{widgets:[]}]},
    sessionPath = 'test-session.json'

require('../scripts/client-shim')

var widgets = {
    'Basics':['button', 'switch', 'dropdown', 'menu', 'input', 'file'],
    'Containers':['panel', 'modal', 'clone', 'matrix', 'keyboard', 'patchbay'],
    'Frames':['frame', 'svg', 'html', 'image'],
    'Graphs':['plot','eq','visualizer'],
    'Indicators':['led', 'text'],
    'Pads':['xy','rgb','multixy', 'canvas', 'canvasgl'],
    'Sliders':['fader','knob', 'encoder', 'range'],
    'Scripts':['script', 'variable'],
}
for (let k in widgets) {
    for (let type of widgets[k]) {
        if (type !== 'tab' && type !== 'root' && type !== 'patchbaynode') {
            console.log(type)
            session.tabs[0].widgets.push({type: type})
        }
    }
}

fs.writeFileSync(sessionPath, JSON.stringify(session))


// spawn o-s-c in headless mode and load tmp session

var {spawn} = require('child_process')

var proc = spawn('xvfb-run', `npm start -- -l ${sessionPath}`.split(' '), {detached: true})

proc.stdout.on('data', std)
proc.stderr.on('data', std)


function std(data){

    if (data.includes('process error')) {
        console.error(data.toString())
        console.log('\033[31m\n=> Test errored ✘\n\033[0m')

        end(true)
    }

}

// timeout after 5s -> no error
setTimeout(()=>{
    console.log('\033[36m\n=> Test timeout without error ✔\n\033[0m')
    end()
}, 5000)

function end(fail){
    proc.kill()
    fs.unlinkSync(sessionPath)
    process.exit(fail ? 1 : 0)
}
