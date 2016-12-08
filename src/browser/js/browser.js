///////////////////////

SESSION = []
STATE = []

CLIPBOARD = null
EDITING = false


TABS = {}


MISC = {
    iterators: {
        widget:{},
        tab:{}
    }
}


PXSCALE =  getComputedStyle(document.documentElement).getPropertyValue("--pixel-scale")
INITIALZOOM = PXSCALE


///////////////////////

$ = jQuery = require('./jquery/jquery.min')
require('./jquery/jquery.ui')
require('./jquery/jquery.drag')
require('./jquery/jquery.resize')
require('./jquery/jquery.fake-input')

///////////////////////

var callbacks = require('./app/callbacks'),
    ipc = require('./app/ipc'),
    osc = require('./app/osc')

osc.init()


///////////////////////
$(document).ready(function(){
    LOADING = require('./app/utils').loading('Connecting server...')
    ipc.send('ready')
})
