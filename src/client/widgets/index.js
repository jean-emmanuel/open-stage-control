module.exports.widgets = {

    // basics
    button: require('./basics/button'),
    switch: require('./basics/switch'),
    dropdown: require('./basics/dropdown'),
    menu: require('./basics/menu'),
    input: require('./basics/input'),
    textarea: require('./basics/textarea'),
    file: require('./basics/file'),

    // containers
    panel: require('./containers/panel'),
    folder: require('./containers/folder'),
    root: require('./containers/root'),
    tab: require('./containers/tab'),
    modal: require('./containers/modal'),
    clone: require('./containers/clone'),
    fragment: require('./containers/fragment'),
    matrix: require('./containers/matrix'),
    keyboard: require('./containers/keyboard'),
    patchbay: require('./containers/patchbay').PatchBay,
    patchbaynode: require('./containers/patchbay').PatchBayNode,

    // frames
    image: require('./frames/image'),
    svg: require('./frames/svg'),
    html: require('./frames/html'),
    frame: require('./frames/frame'),

    // graphs
    plot: require('./graphs/plot'),
    eq: require('./graphs/eq'),
    visualizer: require('./graphs/visualizer'),

    // indicators
    led: require('./indicators/led'),
    text: require('./indicators/text'),

    // pads
    xy: require('./pads/xy'),
    rgb: require('./pads/rgb'),
    multixy: require('./pads/multixy'),
    canvas: require('./pads/canvas'),
    canvasgl: require('./pads/canvasgl'),

    // sliders
    fader: require('./sliders/fader'),
    knob: require('./sliders/knob'),
    encoder: require('./sliders/encoder'),
    range: require('./sliders/range'),

    // scripts
    script: require('./scripts/script-widget'),
    variable: require('./scripts/variable'),

}

module.exports.categories = {
    'Basics':['button', 'switch', 'dropdown', 'menu', 'input', 'textarea', 'file'],
    'Containers':['panel', 'modal', 'clone', 'fragment', 'matrix', 'keyboard', 'patchbay', 'folder'],
    'Frames':['frame', 'svg', 'html', 'image'],
    'Graphs':['plot','eq','visualizer'],
    'Indicators':['led', 'text'],
    'Pads':['xy','rgb','multixy', 'canvas', 'canvasgl'],
    'Sliders':['fader','knob', 'encoder', 'range'],
    'Scripts':['script', 'variable'],
}

var defaults = {}
for (var k in module.exports.widgets) {
    defaults[k] = module.exports.widgets[k].defaults()
    module.exports.widgets[k]._defaults = defaults[k]._props()
}
module.exports.defaults = defaults
