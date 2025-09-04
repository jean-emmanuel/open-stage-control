# Changelog

## 1.29.9-dev

### branch `build-improvements`

- Changed build scripts so that all assets in `app` are either generated or copied to it. `app` can now be deleted and re-created via `npm run build`.

## 1.29.8

- client
    - add `title` client option

## 1.29.7

- launcher
    - add tray icon and menu (landed in 1.29.6 accidentally), disabled by default (can be enabled from the launcher's menu)

## 1.29.6

- bug fixes
    - matrix: prevent error when `quantity` is invalid
    - multixy/xy: send value when setting `spring` to `true` (only if current value is different than spring value)
    - switch/menu/fader: more consistent rendering when `borderRadius` is set

- widgets
    - multixy/xy: add `stepsX` and `stepsY` properties

- misc
    - native silicon buids (osx-arm64)

## 1.29.5

- bug fixes
    - keyboard: regression (1.27.5) breaking `velocity` property
    - editor: retain scroll position in code editors
    - cli: regression (1.28) preventing from setting options from a terminal on windows

## 1.29.4

- bug fixes
    - regression (1.29.3) breaking some widget recreation routines

## 1.29.3

- widgets
    - frame: add `allow` property
    - matrix: make `quantity` a dynamic property to avoid losing widget state when it changes
    - patchbay: missing `preArgs` implementation

## 1.29.1 / 1.29.2

- bug fixes
    - scripting: `setFocus` not working on iOS
    - fader/range: drawing error with `pips` enabled

## 1.29.0

- bug fixes
    - file browser: drive listing failing on recent windows
    - root: `hideMenu` not working when `--read-only` is set
    - combining `--read-only` and `--fullscreen` now disables `F11` on built-in client
    - regression breaking `pips` for range widget

- widgets
    - add `onTouch` to all container widgets
    - allow starting a traversing gesture outside a touchable widget
    - fader: make `knobSize` dynamic

## 1.28.5

- bug fixes
    - multixy: error when `points` is `0` (or empty array) (again)

## 1.28.4

- bug fixes
    - multixy: error when `points` is `0` (or empty array)

## 1.28.3

- bug fixes
    - multixy: correclty handle incoming feedback values and simultaneous touch releases

## 1.28.2

- bug fixes
    - regression in feedback handling (unfixes multixy simultaneous spring issue temporarily)

## 1.28.1

- bug fixes
    - eq: `highpass` filter not working as expected with `poles` set
    - fader: `touchZone` not applied to `doubleTap` events
    - fader: `touchZone` not affecting mousewheel interactions
    - fader: regression causing issues with `onTouch` scripts

## 1.28.0

- bug fixes
    - ui: global zoom (CmdOrCtrl + scroll / + / - / 0) issues and conflits with native browser zoom;
    - ui: limit ctrl + scroll zoom speed
    - broken cli when `ELECTRON_RUN_AS_NODE` is set
    - inspector: input bug when a code editor was focused using the tab key
    - inspector: prevent editing non-editable widgets (e.g matrix items) when clicking on their ids in error logs
    - multixy: simultaneous touch releases not working correctly when `spring` is set and feedback values are received shortly after being sent

- widgets
    - fader: add `touchZone` property to allow restricting interaction to a part of the widget
    - eq: add support for n-poles lowpass and highpass filters with the filter's `poles` property
    - eq: adapt sampling frequency to the x-axis range
    - xy/multixy: add `auto` choice to `axisLock` (locks on the first moved axis)
    - file: `extension` can now be an array of strings
    - plot/eq: smoother curves
    - sliders/pads: `doubleTap` can now be `"script"`, in which case `onTouch` will be called with `event.type` set to `doubleTap`
    - xy: add `label` property
    - multixy: add `padsAttr` property for per-pad customization
    - panel: `tabsPosition` can now be `hidden`
    - pads: support percents in `pointSize`

- scripting
    - `console.log` now always print the id of the widget that called it

- editor
    - inspector: tab key navigation now works, property categories can be fold/unfold with enter/space when focused
    - inspector: `F2` now focuses the `html` property in the inpector if `label` is not present
    - tree: add `mod + f` to focus the search input

## 1.27.5

- bug fixes
    - patchbay: layout issue
    - widget: regression causing error when emptying the css property and leaving only class declarations
    - modal: incorrect position in scrolled containers when `relative` is `true`
    - menu: incorrect position in scrlled containers depending on menu's alignment
    - button: `locals.touchCoords` not updated upon release and incorrect when `doubleTap` is set

## 1.27.4

- bug fixes
    - fader: pips drawing issue causing small a position offset or errors with some browsers
    - script: setFocus not working with textarea widgets

## 1.27.3

- bug fixes
    - regression causing circular loop errors upon certain editions
    - fader: glitch with large `lineWidth` values in default design mode

## 1.27.2

- bug fixes
    - multixy: `default` not applied when points are named
    - clone: avoid some unnecessary property checks
    - clone: prevent missing editions in target properties (e.g. VAR{} renamed with the same return value)

- client
    - show 3-dots menu in read-only mode with access to allowed items (e.g fullscreen)
    - hide console in read-only mode

- widgets
    - matrix: don't implicitely override children's `label`, do it explicitely in `props`' default

- custom module
    - `receive()` and `send()` now accept `host` and `port` to be provided as a single string argument joined by a colon

## 1.27.1

- bug fixes
    - server: `fullscreen` option not working when `read-only` is set
    - led and text widgets not client-syncing
    - patchbay: `address` not working properly when set to `auto`
    - patchbay: `ignoreDefaults` not working properly
    - editor: missing position indicator in color picker pad
    - file browser: fallback to home directory when last visited directory is not accessible

- mobile
    - apply root's (or themes) background color the the browser's topbar when possible

## 1.27.0

- bug fixes
    - app address / qr code not updating when network changes
    - issue after theme auto reload (broken grid, colors not updated)

- widgets
    - pads: expose css variable `--point-size`

- custom module
    - provide error backtraces in module.exports functions
    - add `reload()` callback to provide finer control over the module's lifecycle
    - add `stop()` callback (runs when the server stops)

- remote control
    - add /SESSION/CREATE command

- client
    - file browser now remembers the last displayed directory
    - allow dismissing notifications by clicking on them
    - allow toggling notifications globally from main menu
    - add `notifications` client option

## 1.26.2

- bug fixes
    - user resources not loading when using an external browser
    - advanced syntaxes resolution order issue

- advanced syntaxes
    - display an error in the console in some unsupported advanced syntaxes use cases

## 1.26.1

- bug fixes
    - mac: unable to show launcher windows when starting minimized

## 1.26.0

- bug fixes
    - scripting: `getProp()` now correctly returns a copy of the property if it is an object
    - prevent infinite loop when loading widgets with complex inter-dependencies
    - modal: layout issue on iOS 15+

- widgets
    - dropdown: allow resubmitting the same value
    - switch: allow resubmitting the same value
    - plot: missing `logScaleX` and `logScaleY` properties
    - xy/multixy: add `axisLock` property; allow locking one the axis by holding `Shift` while dragging if `axisLock` is not set, bypasses it otherwise.
    - knob/fader/range: add `colorKnob` property

- launcher
    - on Mac, start hidden if `Start minimized` is set
    - allow dropping files into file fields

- custom module
    - expose `tcpServer` to allow monitoring the state of tcp connections

## 1.25.7

- bug fixes
    - rare issue that made the last widget(s) in a container disappear when other widgets in the same container had a specific property dependency pattern

- remote control
    - `/EDIT*` commands sent by a custom module are not affected by the server's `read-only` option anymore

- widgets
    - input: allow using a number in `numeric` to specify stepping value for mousewheel interaction
    - root: add `onPreload` scripting property

## 1.25.6

- bug fixes
    - sliders: error when `steps` is an array

- scripting
    - `stateSet`: add optional `{send: false}` flag

## 1.25.5

- bug fixes
    - code editor: issue when middle clicking in the editor on linux
    - code editor: modern js operators such as `**` not recognized
    - sliders: prevent error when `steps` is not a number, add `auto` mode for using ranges values as steps (it did not work before)
    - pads, range: value not initialized as an array, causing errors in some cases
    - modal: popup not closing when `doubleTap` is true

## 1.25.4

- bug fixes
    - custom module: `receive()` not passing boolean arguments properly
    - fix `--authentication` on iOS clients

- editor
    - display current widget value in the `value` property's help modal

## 1.25.3

- bug fixes
    - input: rendering issues with big font sizes
    - panel: tab rendering issue when initialized with a non-numeric value
    - panel: minor style issue in tab navigation bar
    - scripting: scripting functions not working inside `browseFile()` callback
    - scripting: using `external: true` in `set()` should prevent affected widget from sending any message
    - button: inconsistent value in `push` mode with `decoupled` enabled when setting value from script

## 1.25.2

- bug fixes
    - textarea: escape key not restoring previous value
    - scripting: `setFocus(id)` not affecting textarea widgets
    - led, text, variable: value not synchronized between different clients
    - error when running from sources on Mac

## 1.25.1

- bug fixes
    - regression in inter-widget sync mechanism
    - regression breaking `set()` function in scripts
    - textarea: display nothing instead of "null" when receing no value, null or an empty string

## 1.25.0

- bug fixes
    - multixy: doubleTap not working on touch devices
    - button: `x` and `y` variables not passed to `onValue` when `doubleTap` is true on touch devices
    - advanced syntax: update issue with clones using their own value in their properties
    - client: minor keyboard shortcut issues
    - panel: mitigate client synchronization issue with scrollbars

- widgets
    - menu: add a background to menu items to help distinguish them
    - menu: merge different interaction modes into a single `mode` property
    - menu: add `swipe` mode

- remote control
    - `/STATE/SET`: add optional argument to prevent widgets from sending their value

## 1.24.2

- bug fixes
    - editor: regression breaking widget context menu actions under "Position" submenu
    - touch devices: touchend event not fired on elements removed/detached during touchstart/touchmove callbacks (caused issues when switching tabs using a button inside a tab)

## 1.24.1

- bug fixes
    - launcher: `Ctrl+M` keyboard shortcut not working
    - widgets: regression incurring a small delay before resolving a property that depends on a widget's own value
    - server: `--client-size` and `--client-position` options not parsed correctly

- advanced syntaxes
    - support `@{}` inside `IMPORT{}`

## 1.24.0

- bug fixes
    - widgets: circular value feedback issues
    - editor: `ctrl + e` not working when hit multiple times without releasing `ctrl`
    - mobile: "prevent sleep" feature not working

- widgets
    - patchbay: add `in`, `out` and `both` modes to `exclusive` property
    - panel: replace `verticalTabs` property with `tabsPosition` (supports 4 directions)

- custom module
    - add optional `errorCallback` argument to`loadJSON` and `saveJSON`

- server
    - print multiple qrcodes if multiple network interfaces are available and prevent printing a qrcode for the localhost address

- misc
    - add linux rpm packages

## 1.23.0

- bug fixes
    - linkId not working between two encoder widgets
    - fader: `gradient` breakpoints not positioned correctly
    - canvas: `onDraw()` called twice when calling `updateCanvas()`

- midi
    - optional rpn/nrpn parsing as single messages

- widgets
    - keyboard: incoming values different than the `off` property are now interpreted as `on`

- editor
    - when focusing the label property with `F2`, select all text in the text area
    - preserve scroll position in code editor when validating
    - display the id of selected widget in the inspector's header

- scripting
    - expose file browser (from the file widget) as a scripting function

- custom module
    - don't restrict file extension in `loadJSON()` and `saveJSON` functions

- misc
    - add polish locales (@ Manz4rk)
    - add css classes to some notification popups to allow targetting them with css themes

## 1.22.0

- bug fixes
    - keyboard widget: `linkId` not working (unable to link 2 keyboard widgets)
    - slides: issues with ranges containing decimal keys

- launcher
    - add menu options to show the qr code again
    - mac: change "List MIDI devices" keyboard shortcut to `Ctrl+m`

- widgets
    - image: add support for special value "qrcode"

- misc
    - add german locales (@ Magnus Reichel)
    - package file names changed to follow debian's convention
    - add a cli option to disable the qr code (`--no-qrcode`)

## 1.21.0

- bug fixes
    - custom module: fix autoreload on nested submodules

- launcher
    - print a qrcode when the server starts to help connecting mobile devices

- editor
    - horizontal scrolling issues with maximized code editor

- widgets
    - switch/menu/dropdown: add a syntax that supports duplicate labels in `values` property

- custom module
    - expose `global` object that persists accross module reloads.

- scripting
    - onCreate: expose `value`

## 1.20.0

- bug fixes
    - scripting: prevent some functions to be marked as undefined
    - advanced syntaxes: ignores quotes around file path in `IMPORT{}`

- launcher
    - add `Start minimized` menu option

- misc
    - change noFocus client option behavior: the default client window now doesn't take the focus at all, even when a text input is clicked.
    - colorize debug messages for sent and received osc/midi messages

- scripting
    - add `setFocusable()` function to change the focusability of the window on the fly (allows reenabling focus temporarily to interact with a text widget using a dedicated toggle button for example)
    - add `reload()` function
    - expose Navigator object with `getNavigator()`

- widgets
    - fragment: add `fallback` property

## 1.19.2

- bug fixes
    - regression breaking touch move events on desktop touchscreens

## 1.19.1

- bug fixes
    - editor zoom: adjust root widget size when zooming out

## 1.19.0

- editor
    - add keyboard shortcut "h" to hide selection and widget drag / resize handles while pressed
    - inspector: add some shortcut buttons in the header

- widgets
    - add folder widget (flat container that doesn't affect layout)
    - input: add `maxLength` property
    - multixy: allow setting its own value from onValue script while touched

- ui
    - add a virtual onscreen keyboard for desktop clients (can be enabled from the clients main menu)
    - change local zoom (alt+scroll) behavior so that it only affect widgets and add scrollbars to navigate while zooming instead of following the mouse

- server
    - client-options: add `virtualKeyboard` option to enable virtual keyboard by default (desktop clients only)

## 1.18.3

- bug fixes
    - button: regression in push mode (`on` value not passed to `onValue` script when triggered from another widget)
    - button: decoupled push mode returning wrong value when activated from a widget script

## 1.18.2

- bug fixes
    - canvas: `onTouch` not triggered on iOS when when `event.force`, `event.altitudeAngle` or `event.azimuthAngle` changes
    - switch: interaction issue when value labels contain icons
    - ios: attempt to fix rendering glitch when waking up after sleep

## 1.18.1

- widgets
    - button: add `decoupled` property, compatible with all button modes
    - button: remove `decoupled` mode

## 1.18.0

- bug fixes
    - client script source map not loading (helps providing useful error messages)

- widgets
    - button: add `decoupled` mode (toggle mode that only updates its state when it receives a value from osc/midi messages)
    - button: add client option `altTraversing` to allow one-way response to traversing gestures for toggle buttons
    - canvas: iOS: trigger `onTouch` when `event.force`, `event.altitudeAngle` or `event.azimuthAngle` updates
    - knob: add `snap-alt` mode (snap mode that allows jumping between range.min and range.max)
    - all: add `borderRadius` property

- scripting
    - add `updateCanvas()` function (forces a canvas widget to redraw)

- remote control
    - `/NOTIFY`: if multiple arguments are provided, interpret the first one as the icon's name for the client notification

- midi
    - on Mac, name virtual ports after the device name to avoid confusion

- server
    - client-options: add `clientSync` option to allow disabling client synchronization
    - client-options: add `altTraversing` option

- editor
    - add `F2` keyboard shortcut to bring label property input into view if selected widget has one

## 1.17.0

- bug fixes
    - editor: error when ctrl+clicking on a root's child
    - range: multitouch interaction issue

- widget
    - knob / encoder: `sensitivity` and ctrl+drag gesture preserve `circular` mode behavior
    - knob / encoder: `snap` mode now works like `circular` mode except for the touch start event (value can't jump from start to end anymore)
    - patchbay: add `exclusive` option

- editor
    - allow interacting with a widget without selecting it by using the middle mouse button or by holding shift+win (shift+cmd on mac).

## 1.16.6

- bug fixes
    - visibility property update issues

## 1.16.4

- bug fixes
    - modal: display issue when a modal receives the same value multiple times
    - patchbay: `outputs` property not handling object value properly
    - server: resolution conflict between app files and user files

- widgets
    - patchbay: trigger `onValue` script when a connection changes

- misc
    - windows: allow accessing other drives than the default one (list drives when the file browser reaches the filesystem's root)

## 1.16.3

- bug fixes
    - custom module: submodules not loading their own submodules with relative paths properly
    - custom module: issue with circular submodule requires
    - server: harmless error message when importing css files from the main theme file
    - server: allow using folder names "client" and "assets" for user files (eg for images used in a session)

- widgets
    - canvas: add `onResize` script property
    - scripting: expose javascript's `Image` constructor

## 1.16.2

- bug fixes
    - widget visibility not updated properly when set as a non-boolean value

- widgets
    - tabs: detach hidden tabs from the DOM (reduces lag caused by heavy tabs)

## 1.16.1

- bug fixes
    - eq widgets not properly converted when importing v0 sessions
    - image paths with url queries not loaded properly
    - @{} syntax not returning truncated value according to the widget's precision property (fixed for primitive values only, object values are still returned as is)

## 1.16.0

- advanced syntaxes
    - `@{}` and `VAR{}` that return objects / arrays do not return a copy of their value anymore as it may introduce a significant overhead when used extensively. Mutating these objects in `#{}` and `JS{}` scripts will now affect the actual values and should be avoided at all cost.
- widgets
    - `comments` property flagged as dynamic
    - multixy: add `doubleTap` property

## 1.15.8

- bug fixes
    - range: value update issue (internal touch state not updated properly)
    - scripting: send(): ignore `ignoreDefaults` property
    - script: onKeyboard script not cleaned upon edition / removal
    - editor: some variables not appearing as defined in `onKeyboard`

## 1.15.7

- bug fixes
    - matrix: property resolution issue with object/array items in `props`
    - bypass client option `nofocus=1` when the editor is enabled
    - menu/dropdown: display label when value is undefined

- misc
    - updated midi bridge: provide more information when loading fails; may fix some compatibility issue on windows

## 1.15.6

- bug fixes
    - ios: prevent server error related to the use of cookies
    - scripting: `getVar()` now returns a copy of the variable to prevent mutations on saved object

## 1.15.5

- bug fixes
    - matrix: advanced property issue in `props` property (bis)

- editor
    - inspector: add solo mode with `alt+click` for category panels

## 1.15.4

- bug fixes
    - matrix: advanced property issue in `props` property

## 1.15.3

- bug fixes
    - interaction issue ("deadzone") on touch screens
    - main menu not hidden when `read-only` is set
    - osc messages containing unicode characters not encoded correctly

## 1.15.2

- bug fixes
    - modal: scroll state not restored when the modal container is recreated
    - server: allow spaces and accentuated characters in client id

## 1.15.1

- bug fixes
    - prevent flickering on canvas based widgets when they are recreated

- editor
    - added code editor for `html` and `css` properties

- remote control
    - add `/RELOAD` command

## 1.15.0

- bug fixes
    - editor: prevent accessing non-editable widgets with right arrow
    - multixy: regression causing interaction issue

- widgets
    - add `lock` property to all widgets

- launcher
    - add `Autostart` menu option

- misc
    - update FontAwesome icon font to version 6

## 1.14.6

- bug fixes
    - inspector: script editor: cursor alignment issue in indented lines
    - clone: prevent freeze and print an error when attempting to create a circular clone
    - modal: regression on android that prevents focusing input widgets in modals

## 1.14.5

- bug fixes
    - session loading error with some malformed property cases

## 1.14.4

- bug fixes
    - broken console interpreter since v1.14.0

- widgets
    - button: add `momentary` mode for sending messages with no value; prevent button from getting stuck when `on` and `off` are equal in `momentary` and `tap` modes

- inspector
    - color picker: inline picker widget (no longer in a modal); show color changes on the fly
    - code editor: validate input with `cmd+enter` instead of `ctrl+enter` on Mac

- scripting
    - `screen.height` and `screen.width` always returns the current screen dimensions
    - added `screen.orientation` global variable

- misc
    - some performance improvements

## 1.14.3

- bug fixes
    - osc receivers (`OSC{}` syntax) now apply the same rule as widgets regarding midi messages (only receive if the message's origin matches one of the host widget's midi targets)
    - modal: rendering issue on iOS
    - button: `locals.touchCoords` not updated since v1.14.0

- widgets
    - clone/fragment: remove scripting properties as they are supposed to be overridden in `props`

## 1.14.2

- bug fixes
    - context-menu: double click issue in submenus on small touch screens
    - clone/fragment: broken onDraw / onTouch scripts if cloned widget is a canvas

## 1.14.0, 1.14.1

- bug fixes
    - misc: sending typed arguments (`{type, value}` objects) should override the widget's `typeTags` definition
    - multixy: errors when `ephemeral` is `true`
    - scripting: `setVar` not affecting all widgets when multiple widgets match provided id

- widgets
    - renamed `script` property to `onValue`, `draw` to `onDraw`, `touch` to `onTouch`
    - added `onCreate` script property to all widgets
    - added `onTouch` script to widgets that supported the touch state variable in scripts (now deprecated)
    - script: added `onKeyboard` property, removed `event` property
    - canvas: expose additional touch event informations (`radiusX`, `radiusY`, `rotationAngle` and iOS-only `altitudeAngle`, `azimuthAngle` and `touchType`)

- scripting
    - special keyword `this` now returns the string `"this"`

- advanced syntaxes
    - added `IMPORT{file}` syntax to allow loading external files in properties

- editor
    - add fullscreen mode for properties with code editor enabled

## 1.13.2

- bug fixes
    - editor: keep relative sizes and positions when resizing multiple widgets at a time

- widgets
    - canvas: expose touch pressure (as `event.force`) in the `touch` script.
    - canvas: expose touch events for extra elements added with the `html` property

## 1.13.1

- bug fixes
    - editor: data loss when leaving the editor's focus with no modifications

## 1.13.0

- bug fixes
    - scripting: `storage.getItem()` not returning anything

- editor
    - new code editor for `script`, `touch`, `draw` and `props` properties with syntax highlighting, line numbers, etc

- scripting
    - `set()`: add an option to prevent target widget's script

- widgets
    - root: add `hideMenu` property

- misc
    - minor cosmetic changes

## 1.12.0

- widgets
    - new **canvas** widget (under `pads`): allows creating custom widgets
    - button: expose normalized touch coordinates in scripts as `locals.touchCoords`
    - print a warning in the console when using advanced syntaxes in the script property

## 1.11.1

- bug fixes
    - client options specified in server config not working unless lowercased
    - make disconnection detection less aggressive (don't display notification if reconnection succeeds quickly)
    - panel: initial scroll state issue

## 1.11.0

- bug fixes
    - menu: interaction issue on iOS
    - script: prevent script functions from being called in the wrong scope (ie when leaked using the `globals` object) and print an explicit error
    - containers: prevent errors with some color formats in colorWidget
    - theme: relative url not resolved correctly

- widgets
    - when a panel contains widgets and has `scroll` set to `true`, its value will be used to represent the scroll position for x-axis and y-axis between 0 and 1.

## 1.10.3

- bug fixes
    - config not persistent on windows

- misc
    - read-only mode now hides and disables the main menu

## 1.10.2

- bug fixes
    - certificate expiration issue
    - regression breaking colors in canvas-based widgets

## 1.10.0

- bug fixes
    - sliders: ignore key order in `range`
    - sliders: handle mousewheel increment when starting from a value between two steps with `steps` property defined
    - inspector: allow scrolling in the help modal
    - console: fix command history behavior and increase history size

- widgets
    - encoder: expose angle in script (as `locals.angle`)
    - new textarea widget (multi line input)
    - expose the computed dimensions of canvas-based widgets in `css` (as `--widget-width` and `--widget-height`) and `script` (as `locals.width` and `locals.height`)

- client
    - add `Save backup` menu action (saves a backup copy of current session with an incremented suffix appended to the file name)

## 1.9.14

- bug fixes
    - modal: remove `html` property
    - matrix: nested property inheritance (eg. `@{id_@{id_x}}`) not working in `props`

## 1.9.13

- bug fixes
    - nested property inheritance (eg. `@{id_@{id_x}}`) not updating properly
    - canvas based widgets not updating when hidden

## 1.9.12

- bug fixes
    - client options: options ignored if not lowercased
    - sliders: prevent errors for some edge-case `range` values

## 1.9.11

- bug fixes
    - range: value not properly updated with set()

- misc
    - (built-in client only) add `nofocus` client option to prevent the client window from taking focus unless a text input or a dropdown is clicked.

## 1.9.10

- bug fixes
    - matrix: regression from 1.9.8 (broken nested @{} syntax in props property)

- misc
    - midi: detect missing binary (eg when deleted by antivirus) and print a message

## 1.9.9

- bug fixes
    - matrix: regression from 1.9.8

## 1.9.8

- bug fixes
    - matrix: update children when `props` is modified even when the result for `$ = 0` doesn't change
    - fragments: fragment widgets empty when reloading
    - panel: scrollbar issue on iOS 13+

- scripting
    - expose `console.clear()`

## 1.9.7

- bug fixes
    - issue when resizing widget using keyboard shortcuts
    - advanced syntaxes (VAR{}): avoid storing default value as string if it can be parsed as a javascript primitive (boolean, number, etc)
    - advanced syntaxes (VAR{}): ignore quotes around variable name

- editor
    - change keyboard shortcuts for moving widgets (now `mod + arrows`) and navigating in widgets (now `arrows`) to feel more natural with the project tree view.

- widgets
    - script: bypass keyboard shortcuts already used by the editor if it is enabled
    - matrix: removed ambiguous `start` property
    - matrix: advanced syntax blocks can be passed to children without being resolved at the matrix\' scope by adding an underscore before the opening bracket
    - text: add `soft` mode for the `wrap` property
    - input: improve `numeric` mode on iOS

## 1.9.6

- bug fixes
    - advanced syntaxes: `VAR{}` not updating when the default value is edited
    - editor: fix "Bring to front" and "Send to back" context menu actions

- ui
    - add keyboard shortcuts `mod + "+"` and `mod + "-"` to control zoom level

- widgets
    - input: add `numeric` property (allows numeric values only and displays numeric keyboard on mobile devices)
    - button: add `soft` mode for the `wrap` property
    - switch: add `wrap` property

- editor
    - display dropdown and checkbox for boolean properties with extra choices

## 1.9.5

- bug fixes
    - advanced syntaxes: various issues and regressions
    - editor: preserve advanced syntaxes in `left` and `top` when pasting a widget

- editor
    - tree: update widget visibility when it changes dynamically

## 1.9.4

- bug fixes
    - prevent error with empty `OSC{}` blocks
    - regression breaking advanced syntax blocks containing nested brackets

- advanced syntaxes
    - new syntax for creating and using custom variables in properties: `VAR{name, default}`
    - `JS{}` blocks don't require 2 brackets anymore (`JS{{}}` still works)

- scripting
    - add `getVar()` and `setVar()` for reading and modifying custom variables. This allows modifying properties directly from scripts (if they contain `VAR{}` blocks).
    - expose session path as `globals.session`

- editor
    - make tree item blink when hitting "Show in tree"

- remote control
    - add `/SCRIPT` command to run scripts remotely

## 1.9.3

- bug fixes
    - scripting: set() not working from a slider to a pad
    - tabs not sending messages / triggering scripts when clicked in editing mode
    - prevent hang with some syntax errors in advanced syntaxes
    - don't show project tree if minimized when creating a new widget (1.9.2 regression)
    - fix "ID + 1" paste for widgets with numeric ids
    - dropdown: reset the underlying dropdown when the widget's value is undefined

- editor
    - tree: allow specifying multiple type filters
    - tree: add "Show in session" context menu action

## 1.9.2

- bug fixes
    - visualizer: remove `bars` and `dots` option
    - plot: fix `bars` option
    - project tree: clear filter input when loading a session
    - server: fix serving files from paths containing accents
    - editor: keep editor open when loading a session
    - menu: prevent clipping in container on iOS

- widgets
    - image: add pre defined values for `size`, `position` and `repeat` properties
    - text: add vertical alignment choices to `align`

- editor
    - tree: add icons before widget ids depending on the category
    - tree: activate tab when selecting it in the project tree
    - tree: allow dragging widgets from a container to another
    - tree: expand container when a new widget is created inside it
    - tree: add support for filtering widgets by type (by typing `type:fader` for example)
    - smarter shift+drag selection: allow selecting widgets in the area when the event started on the parent container
    - select newly created widgets/tab except when copy-pasting

- remote control
    - add `/STATE/SEND` command

## 1.9.1

- bug fixes
    - button: allow writing strings like `"1.0"` in `label` without removing the decimals
    - editor: use css variable `--grid-width` at startup and after disabling & enabling the grid
    - launcher: regression preventing server halt when built-in client is closed manually beforehand
    - scripting: prevent crash (built-in client only) when using the variable `navigator`

- widgets
    - menu/switch/dropdown: reset value to `undefined` when receiving a value that's not defined in `values`

- scripting
    - expose instance of navigator [Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard) as `globals.clipboard`

- midi
    - allow sending note off with velocity
    - add option for receiving note off with velocity

- misc
    - v0->v1 session conversion: remove `JS{{}}` in script property

## 1.9.0

**Warning** Sessions saved with this version will not open in older versions (sessions saved with older version will open in this version).

- bug fixes
    - remote-root option not applied on resources loaded by the client app (css images, etc)
    - input: display issue when resizing the window
    - launcher: cancel stopping the server when there are unsaved changes in the built-in client

- editor
    - context menu: add `export` action to export a widget as a fragment file
    - show project tree if minimized when clicking on "Show in tree"

- widget
    - **new** `fragment` widgets (under `containers`): embedded session or fragment file with overridable properties.
    - add `comments` property to all widgets

- launcher
    - add `Always on top` menu toggle

## 1.8.15

- bug fixes
    - editor: error when duplicating widget while if the clipboard is empty
    - ui: local zoom move issue when not in fullscreen
    - custom module: `clearInterval()` not working
    - regression breaking style attribute in html property

- misc
    - faster local zoom

## 1.8.14

- bug fixes
    - `alt+shift+c` not working when pressed before dragging
    - incremental pasting issue with address property
    - generate scrollbars for panels on iOS 13+
    - fix scrolling on chrome for iOS 13+

- editor
    - add `mod+d` and `mod+shift+d` for duplicating widgets
    - use a temporary clipboard when duplicating widgets

- misc
    - inspector: move `script` property to `scripting` category
    - ui: minor style tweaks

## 1.8.13

- widgets
    - file: show save icon when mode is set to save
    - file: center icon when hidePath is set to true
    - sliders/pads: apply `spring` property dynamically

- ui
    - add `alt`+`wheel` for local zoom centered on cursor

- editor
    - add `alt+c+drag` and `alt+shift+c+drag` for duplicating dragged widgets

## 1.8.12

- bug fixes:
    - project tree: filter input position issue when scrolling
    - sliders/pads: apply `spring` property dynamically

- project tree
    - select range of contiguous widgets with shift + click

- misc
    - plot: remove unused `filters` property; fix description for `rangeX` and `rangeY`
    - console: focus input when the console opens

## 1.8.11

- bug fixes
    - switch: widget not reacting at first touch when traversing is enabled on parent
    - sliders: disable mousewheel when `spring` is enabled

- widgets
    - script: add `once` event mode
    - encoder: remove `spring` property

- custom module
    - expose `process` global

- scripting
    - add `openUrl` function

## 1.8.10

- bug fixes
    - modal: issues with children's visibility
    - console: allow multiple arguments in console.log()

- ui
    - launcher: add many keyboard shortcuts
    - client: add keyboard shortcuts for clearing the console

- scripting
    - add `setFocus` function to focus an input widget programmatically

- misc
    - add `usePercents` client option

## 1.8.9

- bug fixes
    - script: issue when using the `options` argument in `set()` (options leaked to subsequent set() calls in the script)
    - multixy: `decimals` property not applied
    - multixy: spring behavior not working until all points are released
    - custom module: prevent require() from reading submodules files each time and instead return the object in memory

## 1.8.8

- launcher
    - add file browser button for the `theme` option and fix parsing path containing spaces if only one theme is set

- windows
    - remove `ctrl+w` shortcut for closing a window (use `alt+f4` instead)

## 1.8.7

- midi
    - add active sensing messages support (received as sysex)

- remote control
    - restore `/TABS` command (for opening tabs by ids)

- widgets
    - encoder: expose rotation speed in script (as `locals.speed`)

## 1.8.6

- bug fixes
    - range: per-fader touch event not emitted properly
    - rgb: fix `spring` property
    - rgb: touch event not emitted

## 1.8.5

- bug fixes
    - midi: debug messages displayed as errors
    - launcher: broken context menu

## 1.8.4

- bug fixes
    - input: prevent focus when selecting the widget for edition
    - input: submit content when leaving focus, not only when hitting `enter` or `tab` (`esc` still cancels)
    - midi: prevent midi bridge from stopping when an error occurs; provide meaningful errors when connection fails

- editor
    - inspector: hitting ctrl+s while editing a property will submit the change before saving

- ui
    - hide the console toggle button when the bottom panel is minimized and the editor is disabled

- widgets
    - file: add `mode` property, for choosing between `open` and `save` modes
    - switch: add `flip` mode

## 1.8.3

- bug fixes
    - keyboard: allow note numbers up to 127
    - server: return http 404 error when a user-requested resource is not found instead of keeping a pending request
    - modal: `visible` property not applied correctly

- project tree
    - add an input for filtering displayed widget by id

## 1.8.2

- bug fixes
    - menu: allow manual line breaks ("`\n`") in labels / values
    - custom module: parsing issue when sending widget data using `receive()` (`type` attribute erroneously parsed as an osc typetag)

- widgets
    - html property: allow "href" attribute on "a" elements

## 1.8.1

- bug fixes
    - script: stops triggering osc messages under some circumstances

## 1.8.0

- bug fixes
    - project tree: layout issue with deeply nested widgets
    - ios 10.3 regression
    - file browser: layout issue with long paths

- custom module
    - add `nativeRequire` function (allows loading native node modules or locally installed modules)

## 1.7.8

- bug fixes
    - canvas-based widgets not drawn when placed in a modal while having a conditional visibility set
    - text: missing `decimals` property
    - clone: fix usage of osc listener syntax (acts as if clone has an `address` property set to `auto`)

- widgets
    - clone: make `props` property dynamic (avoid full widget rebuild when possible)

- misc
    - increase client console history size and allow changing it with client url options

## 1.7.7

- bug fixes
    - startup regression

## 1.7.6

- bug fixes
    - (harmless) error raised when starting the server from the launcher with `debug` set to `true`

- editor
    - display/save color picked values with css rgba notation instead of hexadecimal

- widgets
    - modal: add `ignoreTabs` option (allows overflowing tab ancestors)
    - menu: add `ignoreTabs` option

## 1.7.5

- bug fixes
    - ios: cloned menu not displayed correctly
    - engine: downgrade to fix startup issue on windows

## 1.7.4

- bug fixes
    - editor: cloned `dropdown` and `input` widgets not opening when selected
    - widgets: prevent value-stateless widgets (tap buttons, clone, scripts, html and svg) from sending a value for cross-client synchronization (leads to unexpected script execution) and exclude them from state saves
    - input: apply `decimals` number before checking the value against the `validation` expression
    - range: `steps` and `dashed` property not working; remove `origin` property
    - config conflicts between launcher and server (affecting at least session history)

## 1.7.3

- bug fixes
    - custom module / theme: prevent reloading the module while the file is being written to
    - server: if a theme is used, attempt to resolve image urls against the theme file's location
    - modal/button: prevent error when `label` is updated

- widgets
    - encoder: add `ticks` property back

## 1.7.2

- bug fixes
    - midi: mtc parsing error
    - custom module: hot reload cache issue on windows

## 1.7.1

- bug fixes
    - regression causing server errors

## 1.7.0

**Important change**

Prebuilt binaries are now supplied only for 64bit Linux/MacOs/Windows. Other platforms should use the `node` package or build it from sources.

**MIDI support**

As of this version, packages except the `node` package are bundled with a midi binary that will be used whenever midi's `path` option is not set. It is no longer necessary to install `python` and `python-rtmidi`.

**Changelog**

- bug fixes
    - editor: missing context menu (copy, paste) in inspector inputs
    - widgets: osc listeners not resolving "auto" address
    - cli: `ELECTRON_RUN_AS_NODE` headless mode not working without `--no-gui` option
    - ios: clone widget not laid out properly in horizontal panels
    - ui: missing vertical scrollbar when root's height overflows the workspace
    - server: provide readable error when a file requested by the client file is not found
    - tab: content not drawn when changing visible property
    - matrix: addresses not generated property when matrix' address is `auto`

- ui
    - add console bottom panel with a simple script interpreter

- widgets
    - keyboard: add `velocity` property (allows mapping the touch coordinates between `off` (top) and `on` (bottom))
    - input: add `validation` property (allows defining a regular expression that the value must match)
    - modal: add `relative` position property

- midi
    - accept sending sysex strings without spaces between the bytes
    - load prebuilt midi binary on 64bit linux/windows/osx
    - add support for midi time code messages

- misc
    - sessions converted from v0 will use the widget's html property to display the former label property

## 1.6.2

- bug fixes
    - matrix: issues when changing non-dynamic properties (content not properly removed)
    - input: apply default value when receiving an empty value or no value at all

## 1.6.1

- bug fixes
    - keyboard: prevent `script` property from being copied to each key

- widgets
    - keyboard: make `on` and `off` properties dynamic
    - script: add `getIndex` function
    - matrix/keyboard: `id` variable in script is now the `id` of the child widget that triggered the event

## 1.6.0

- bug fixes
    - range: error when setting `default` property
    - range: fix `doubleTap` property

- widgets
    - all: add `html` property to allow inserting custom content in widgets (label, value, etc) and style it with the `css` property.

- scripting:
    - `send()`: ignore the widget's `bypass` property (allows bypassing default messages and define custom ones)
    - `set()`: add supports for wildcards in the id parameter
    - `set()`: add a 3rd optional parameter for preventing further script executions and/or osc messages from being sent

- custom module
    - automatically reload custom module when the file is modified
    - add support for loading submodules with `require()`

- theme
    - automatically reload theme when the file is modified

## 1.5.4

- bug fixes
    - ssl: generate unique certificates (with random serial numbers) to avoid reuse errors. Certificates generated with older versions of o-s-c will be updated automatically.
    - `~/` path prefix not recognized when using remote control commands like `/SESSION/SAVE`
    - `~/` path prefix not recognized in `remote-root` option
    - editor: paste ID+1: midi-related addresses should not be incremented

- remote control
    - add `/STATE/OPEN` and `/STATE/SAVE` commands
    - ignore unsaved changes when loading a session with `/SESSION/OPEN`
    - resolve relative file paths against `remote-root` setting

## 1.5.3

- bug fixes
    - editor: error when `preArgs` and `address` are modified at the same time (affects `/EDIT` command and matrix/clone widgets)

## 1.5.2

- bug fixes
    - launcher: midi device names containing multiple spaces not parsed correctly
    - fullscreen: lack of support not detected on some ios devices
    - multixy: labels not hidden when `ephemeral` is `true`

- remote control
    - add `/SESSION/OPEN` and `/SESSION/SAVE` commands

## 1.5.1

- bug fixes
    - widgets: touch state scripts not triggering some synchronization mechanism

- widgets
    - encoder: remove `steps`, `ticks` and `origin` properties
    - encoder: make `sensitivity` work with values below 1

## 1.5.0

- bug fixes
    - image: broken value validation
    - menu/dropdown: use correct z-index
    - dropdown: prevent dropdown from opening when selecting the widget for edition

- editor
    - holding `alt` extends the north-west handle to the widget's size to ease dragging
    - widget properties reordered (e.g. style-related properties, even widget-specific, are now under the "style" category)

- widgets
    - remove `colorBg` for all widgets except containers
    - widgets background color is now transparent by default (can be overridden with css)
    - keyboard: added `colorBlack` and `colorWhite` properties to customize key colors
    - dropdown/menu: add `label` property (with support easy key/value display)
    - dropdown/menu: add `icon` toggle property
    - modal: add `popupPadding` property to control the button's and the container's padding independently

## 1.4.1

- bug fixes
    - multixy/range: prevent some extra touch state events;`

## 1.4.0

- bug fixes
    - project tree: error when dropping a widget at its initial position

- editor
    - validate property change when clicking on a widget
    - cancel property change when hitting escape
    - add menu and keyboard shortcuts to reorder widgets
    - add keyboard shortcut to show widget in project tree
    - selected widget is not showed on top of the others anymore

- widgets
    - expose widgets unique identifiers with property name "uuid"
    - xy/multixy: add `ephemeral` property
    - fader/knob/xy/range/multixy: remove `touchAddress` property
    - fader/knob/xy/range/multixy: expose touch state in `script` property (`touchAddress` usages will be converted automatically)

## 1.3.0

- bug fixes
    - editor: hide impossible actions from context-menu (eg adding widgets in tab containers)
    - editor: error when selecting a tab/root widget while a property field contains unsubmitted changes
    - panel: layout issue with tabs & lineWidth property
    - input: extend focusable area

- midi
    - remove variable args in sysex messages (dynamic properties and scripting can be used to this effect)
    - add support for sending sysex bytes as integers
    - allow sending any system message (eg MIDI time code)
    - add support for receiving MIDI time code messages (as raw sysex) (requires adding the `mtc` flag to the midi configuration)

## 1.2.1

- scripting
    - expose toolbar menu actions

- remote control
    - optimise small changes made with /EDIT

- widgets
    - button: add `wrap` and `vertical` properties
    - root: add `width` and `height` properties (helps building mobile layouts)

## 1.2.0

- bug fixes
    - editor: id not incremented when pasting multiple widgets with id+1

- main
    - remove support for extra args in the `custom-module` option (fixes some path issues)

- widgets
    - all: add `lineWidth` style property
    - knob: add `solid` & `line` designs
    - fader: add `knobSize` property

- editor
    - preserve percentages in position/size
    - add 'Relative units (%)' option to use percents automatically on new widgets

## 1.1.0

- bug fixes
    - iOS 14+ scrolling issue

- midi
    - add support for channel pressure and key pressure messages

- widgets
    - svg: remove support for non-standard `%x` and `%y` units; fixed layout update when resized;
    - knob: add support for custom dash/gap size in `dashed` property

## 1.0.4

- bug fixes
    - script: broken `storage.getItem` and `storage.removeItem`
    - regression breaking `remote-root` option when starting with the launcher

## 1.0.3

- bug fixes
    - modal: layout issue on iOS

- widgets
    - panels: added `contain` property to allow scrolling in vertical/horizontal layouts

- midi
    - add support for named ports in midi configuration

## 1.0.2

- bug fixes
    - broken scrolling on iPhone iOS 13
    - window geometry issue

## 1.0.1

- UI
    - windows' dimensions and position are now saved upon closing and restored at startup

## 1.0.0

_This list is not exhaustive_

- compatibility
    - dropped support for iOS 9
    - firefox (75+) support

- UI
    - overhaul design reworked
    - foldable sidepanels
    - removed lobby
    - added toolbar menu
    - display loading (spinner) in a notification instead of a modal
    - mod + w to close window
    - context-menu now use click event to trigger actions, not mousedown/touchstart
    - no more uppercase text by default

- themes
    - built-in themes removed except `orange`

- translations
    - incomplete russian translation removed

- editor
    - project tree
    - dropdown for properties with multiple choices
    - color picker
    - preview numeric values for style-related properties set to auto
    - context menu: added "show in tree" action
    - context menu: removed "edit parent" action
    - allow copying tabs (to tab containers only)
    - shared clipboard across all clients
    - prevent interaction with widgets when `shift` or `ctrl` is held
    - ensure @{} bindings are always updated upon edition

- widget changes
    - all: removed `label` option except for buttons, tabs and modals (one should use `text` widgets if needed)
    - all: removed support for `null` and `"self"` targets
    - all: added `ignoreDefaults` property (allows ignoring the server's default targets)
    - all: `precision` property to `decimals`, don't set osc integer typetag when 0
    - all: added `typeTags` property
    - all: multiple style properties to control visibility, colors, alphas and padding
    - all: added `interaction` (=> css `pointer-events: none;`)
    - all: added `expand` (=> css `flex: 1;`)
    - all: prevent html tags in label
    - pads: removed `split` property -> use custom-module or script instead
    - root: can contain widgets or tabs
    - panels: added `layout`, `justify` and `gridTemplate` to help managing layouts (especially responsive ones)
    - panels: added `verticalTabs` property
    - panels: added `traversing` property, allow restricting `traversing` to a specific widget type
    - fader: removed `input`
    - fader: removed `meter`
    - fader: added `gradient`
    - fader: added `round` design style
    - fader: support setting dash size and gap size in `dashed` property
    - switch: added `layout` (including grid)
    - switch: added `click` mode
    - plot/eq: removed `smooth`
    - plots/sliders/pads: reversed `logScale` behavior to match standard implementations; can be either `false` (disabled), `true` (logarithmic scale) or `number` (manual log scale, negative for exponential scale)
    - visualizer: added `framerate` property
    - visualizer: added `freeze` property
    - menu: always centered menu
    - modal: modals can't overflow parent tab boundaries
    - input: removed `vertical`
    - pads, range: when `touchAddress` is set, one message per touched point is sent, in addition to the former touch state message
    - eq: removed `logScaleX` property, always draw logarithmic frequency response
    - eq: logarithmic x-axis scale fixed
    - eq: filters are now defined with the `filters` property, leaving the `value` to its default purpose
    - eq: added `rangeX`
    - html: allow `class`, `title` and `style` attributes
    - dropdown: close menu when receiving a value
    - dropdown: removed empty 1st option
    - switch: removed `showValues` (inconsistent with menu/dropdown, feature covered by `values` property)
    - frame: allow loading non local urls

- widget removals
    - `push`, `toggle`: merged into `button`
    - `strip`: features now covered by `panel`
    - `meter`: duplicate of `fader` with `design` to `compact` and `interaction` to `false`
    - `switcher`, `state`, `crossfader`: removed => state management functions added to the `script` widget
    - `keys`: merged with `script`
    - `gyroscope`: not compatible since chrome 74 unless o-s-c goes HTTPS

- remote control
    - removed /TABS
    - added /NOTIFY

- scripting (general)
    - removed MathJS language
    - reuse #{} syntax as as shorthand for JS{{}} (one liner, implicit return)
    - added `locals` variable, a variable store scoped to the widget
    - renamed `global` to `globals`
    - expose environment variables in `globals`: `url`, `env` (query parameters), `platform`, `screen` (width/height)

- script widget
    - always hidden except in project tree
    - `script` property must not be wrapped in a JS{{}} block anymore
    - added `stateGet` and `stateSet` functions
    - added `storage` object, proxy to the document's localStorage object (allows storing data that persist after refresh/close (cleared with the browser's cache)
    - added `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` function proxies with an extra `id` argument (they clear automatically when called multiple times and upon widget removal. `id` is scoped to the widget)

- state
    - quickstate (store/recall from menu) is now stored in the clients cache and persists after refresh/close (cleared with the browser's cache)

- custom module
    - `settings.read(name)`: `name` is now the long name of command-line options (not a camelCased one)
    - `receive()`: optional last argument to pass extra options such as `clientId`
    - client id persist upon page refresh and can be set manually with the client url option `id`

- launcher
    - config save/load
    - allow starting/stopping server without rebooting
    - syntax check on `--midi` option

- server
    - renamed `--url-options` to `--client-options` and make them apply even in remote browsers (can be overridden with url queries)
    - removed `--blank`, `--gui-only`, `--examples`
    - hide `--disable-gpu` (cli-only)
    - added cli-only `--cache-dir` and `--config-file`
    - added `--authentication` option
    - added `--use-ssl` option

- misc
    - canvas: better visibility checks to avoid unnecessary draw calls
    - visualizer: perf improvement (avoid data processing when not visible), all visualizers hook on the same loop to avoid concurrent timeouts
    - button: in 'tap' mode (formerly push with `noRelease`), never send/sync `off` value, automatically reset to `off` when receiving `on`
    - more detached DOM for lighter nested canvas widgets (ie multixy)
    - unified (kind of) dom html structure for widgets, known css tricks will require adjustments.
    - cache and config files are now stored in a folder named `open-stage-control` (located in the system's default location for config file). The `.open-stage-control` is no longer used.
    - added support for icons rotate/flip transform suffixes (example: `^cog.spin`, `^play.rotate-horizontal`)
