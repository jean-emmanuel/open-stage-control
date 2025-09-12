// basics
import button from './basics/button'
import _switch from './basics/switch'
import dropdown from './basics/dropdown'
import menu from './basics/menu'
import input from './basics/input'
import textarea from './basics/textarea'
import file from './basics/file'

// containers
import panel from './containers/panel'
import folder from './containers/folder'
import root from './containers/root'
import tab from './containers/tab'
import modal from './containers/modal'
import clone from './containers/clone'
import fragment from './containers/fragment'
import matrix from './containers/matrix'
import keyboard from './containers/keyboard'
import {PatchBay as patchbay, PatchBayNode as patchbaynode} from './containers/patchbay'

// frames
import image from './frames/image'
import svg from './frames/svg'
import html from './frames/html'
import frame from './frames/frame'

// graphs
import plot from './graphs/plot'
import eq from './graphs/eq'
import visualizer from './graphs/visualizer'

// indicators
import led from './indicators/led'
import text from './indicators/text'

// pads
import xy from './pads/xy'
import rgb from './pads/rgb'
import multixy from './pads/multixy'
import canvas from './pads/canvas'

// sliders
import fader from './sliders/fader'
import knob from './sliders/knob'
import encoder from './sliders/encoder'
import range from './sliders/range'

// scripts
import script from './scripts/script-widget'
import variable from './scripts/variable'

export const widgets = {

    // basics
    button,
    switch: _switch,
    dropdown,
    menu,
    input,
    textarea,
    file,

    // containers
    panel,
    folder,
    root,
    tab,
    modal,
    clone,
    fragment,
    matrix,
    keyboard,
    patchbay,
    patchbaynode,

    // frames
    image,
    svg,
    html,
    frame,

    // graphs
    plot,
    eq,
    visualizer,

    // indicators
    led,
    text,

    // pads
    xy,
    rgb,
    multixy,
    canvas,

    // sliders
    fader,
    knob,
    encoder,
    range,

    // scripts
    script,
    variable,

}

export const categories = {
    'Basics':['button', 'switch', 'dropdown', 'menu', 'input', 'textarea', 'file'],
    'Containers':['panel', 'modal', 'clone', 'fragment', 'matrix', 'keyboard', 'patchbay', 'folder'],
    'Frames':['frame', 'svg', 'html', 'image'],
    'Graphs':['plot','eq','visualizer'],
    'Indicators':['led', 'text'],
    'Pads':['xy','rgb','multixy', 'canvas'],
    'Sliders':['fader','knob', 'encoder', 'range'],
    'Scripts':['script', 'variable'],
}

var defaults = {}
for (var k in widgets) {
    defaults[k] = widgets[k].defaults()
    widgets[k]._defaults = defaults[k]._props()
}
export {defaults}
