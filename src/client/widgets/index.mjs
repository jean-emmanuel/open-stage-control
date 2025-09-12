// basics
import button from './basics/button.mjs'
import _switch from './basics/switch.mjs'
import dropdown from './basics/dropdown.mjs'
import menu from './basics/menu.mjs'
import input from './basics/input.mjs'
import textarea from './basics/textarea.mjs'
import file from './basics/file.mjs'

// containers
import panel from './containers/panel.mjs'
import folder from './containers/folder.mjs'
import root from './containers/root.mjs'
import tab from './containers/tab.mjs'
import modal from './containers/modal.mjs'
import clone from './containers/clone.mjs'
import fragment from './containers/fragment.mjs'
import matrix from './containers/matrix.mjs'
import keyboard from './containers/keyboard.mjs'
import {PatchBay as patchbay, PatchBayNode as patchbaynode} from './containers/patchbay.mjs'

// frames
import image from './frames/image.mjs'
import svg from './frames/svg.mjs'
import html from './frames/html.mjs'
import frame from './frames/frame.mjs'

// graphs
import plot from './graphs/plot.mjs'
import eq from './graphs/eq.mjs'
import visualizer from './graphs/visualizer.mjs'

// indicators
import led from './indicators/led.mjs'
import text from './indicators/text.mjs'

// pads
import xy from './pads/xy.mjs'
import rgb from './pads/rgb.mjs'
import multixy from './pads/multixy.mjs'
import canvas from './pads/canvas.mjs'

// sliders
import fader from './sliders/fader.mjs'
import knob from './sliders/knob.mjs'
import encoder from './sliders/encoder.mjs'
import range from './sliders/range.mjs'

// scripts
import script from './scripts/script-widget.mjs'
import variable from './scripts/variable.mjs'

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
