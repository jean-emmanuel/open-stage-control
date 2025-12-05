# Scripting

Widgets can run [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) scripts upon specific events. These scripts are written in special properties under the scripting category.

!!! warning "Advanced syntaxes"
    Most [advanced syntaxes](../advanced-syntaxes/) should be avoided as much as possible in scripting properties:

    - `@{}`: use `get()` and `getProp()` instead
    - `OSC{}`: use `get()` instead (using another widget as receiver)
    - `VAR{}`: use `getVar()`instead
    - `JS{}` and `#{}` are useless (scripting properties are already interpreted as javascript code) unless you want to generate code procedurally

    The editor will always fail to recognize these syntaxes as they don't comply with the javacript language specification, even if the resulting code is valid.

## Events

### `onCreate`

This script is called when the widget is created. If the widget has children, it will be executed after the children are created.

!!! warning "Modifying parent container"
    Modifying a non-dynamic property on a parent container from this script **will not work**.

The following variables are available in this context:

- `value`: widget's value    

### `onValue`

This script is called when the widget's value updates and when it receives a value.

The following variables are available in this context:

- `id` (`string`): id of the widget that's responsible for the value update
- `value`: widget's value
- `touch`: see [Touch state](#touch-state)

??? infos "Keyboard & Matrix"
    In keyboards and matrices, `id` is the id of the child widget that triggered the event, and `value` is an array containing the children's values.
    The touched widget's value can be retrieved with:
    ```javascript
    value[getIndex(id)]
    ```

??? infos "Touch state (deprecated)"

    *This feature is deprecated, use `onTouch` instead*

    When some widgets are touched or released, a special value event can be caught to trigger custom actions.

    If the variable `touch` is not `undefined`, this means it holds the widget's current touch state:

    - `0/1` for the widget's touch state (`fader`, `knob` and `xy`, `range` and `multixy`)
    - `[i, 0/1]` if the widget is multi touch (`range` and `multixy`). In this case `i` is the touched handle's index, starting with `0`.

    ```js
    if (touch !== undefined) {
        // send multi touch state
        if (touch.length) send('/touch_address', touch[0], touch[1])
        // send global touch state
        else send('/touch_address', touch)
    } else {
        // do something with the value ?
    }
    ```

    To avoid unwanted script executions, touch state events will only be caught if the script contains the word `touch` and if `onTouch` is empty.


### `onTouch`

This script is executed when the widget is touched, and when it is released.

This script has access to the same variables and functions as the `script` property (except the event-specific ones), plus the following:

- `value`: widget value
- `event`: object containing the following:
    - `type`: `"start"` or `"stop"`
    - `handle`: `undefined` if the event concerns the widget, `integer` if it concerns one of it's handles (`multixy` and `range` widgets only)

[Canvas](../canvas/) and containers expose more informations in their `onTouch` script.

??? infos "Containers onTouch"

    Containers (root, panel, etc) can monitor touch events happening inside them, it works like with [Canvas](../canvas/#ontouch), with a few differences:

    - `event.firstTarget` will return the id of the first touched widget
    - setting `event.preventDefault` to `true` will prevent the event from reaching widgets in the container ('start' and 'move' events only)
    - setting `event.allowScroll` to `true` will allow touch scrolling where it would normally be prevented ('start' event only)
    - setting `event.inertia` will affect 'move' events (works like widget `sensitivity` in reverse (1 = normal, 10 = slow move))
    - `width` and `height` are undefined

    Containers with `traversing` enabled change how touch events are emitted:

    - a new 'stop' event is emitted whenever the pointer exits a touchable widget while pressed.
    - a new 'start' event is emitted whenever the pointer enters a touchable widget while pressed.


### `onDraw`

See [canvas](../canvas/).

### `onKeyboard`

*Script widget only*

This script is executed when the key(s) defined in the widget's `keyBinding` property are pressed.


The following variables are available in this context:


- `type` (`string`): `keydown` or `keyup`
- `key` (`string`): key name,
- `code` (`number`): key code
- `ctrl` (`boolean)`: `true` if ctrl key is pressed
- `shift` (`boolean`): `true` if shift key is pressed
- `alt` (`boolean`): `true` if alt key is pressed
- `meta` (`boolean`): `true` if meta key is pressed


### `onPreload`

This script is specific to the root widget, it's called before any other widget is created and can be used to create global variables / functions accessible in other scripts.

## Available variables

The following variables and functions are accessible in this context.


- `console`: javascript console
- `locals`: object for storing/reading arbitrary values. Changing its properties *does not* trigger any synchronisation even if the value is used somewhere else.
- `globals`: same as `locals` but shared between all widgets, contains a few useful variables:
    - `screen`: client screen informations (`{width, height, orientation}`)
    - `env`: client options (ie: url query options),
    - `ip`: client's ip address,
    - `url`: server url,
    - `platform`: operating system as seen by the client
    - `session`: session file path
    - `clipboard`: instance of navigator [Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard)
- `Image`: javascript's [Image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) constructor


!!! note "this"
    Unlike in most javascript contexts, the special keyword `this` doesn't point to an object but instead returns the string `"this"`.


----

#### `get(id)`
- `id`: widget `id` as a string.

Returns the value of the first matching widget. If the returned value is an object, a copy is returned to allow safe mutation.

----

#### `set(id, value, options)`
- `id`: widget `id` as a string. Can be `"this"` to target the host widget, or `"parent"` to target the parent widget. `id` may contains wildcards ('\*').
- `value`: new value for the widget.
- `options` (optional): `object`, accepts the following items:
    - `sync: false`: prevents widgets from triggering synchronization and scripts
    - `script: false`: prevents scripts but not synchronization
    - `send: false`: prevents widgets from sending osc messages
    - `external: true`: simulates a value coming from an osc/midi message (implies `send: false` automatically)

Sets the value of the first matching widget. If `ìd` contains wildcards, affects all matching widgets **except** the emitting widget.

If the event that triggered the script's execution was initiated by a user interaction, this will make the widget send its value as well (unless `options` is set to `{send: false}`).

----

#### `getVar(id, name)`
- `id`: widget `id` as a string.
- `name`: variable name as a string.

Returns the value of a widget's custom variable. If the returned value is an object, a copy is returned to allow safe mutation.

----

#### `setVar(id, name, value)`
- `id`: widget `id` as a string. Can be `"this"` to target the host widget, or `"parent"` to target the parent widget. `id` may contains wildcards ('\*').
- `name`: variable name as a string.
- `value`: new value for the variable.

Sets the value of a widget's custom variable (see [advanced syntaxes](./advanced-syntaxes.md##ustom-variables-varvariablename-default)). If `ìd` contains wildcards, affects all matching widgets.


----

#### `send(target, address, ...args)`
- `target` (optional): `"ip:port"` or `"midi:device_name"` string. If omitted, the widget's target (or the server's defaults) will be used.
- `address`: osc address, must start with a `/`
- `args`: values or `{type: "OSC_TYPE_LETTER", value: VALUE}` objects

Sends an osc message.

If the event that triggered the script's execution was not initiated by a user interaction, this function will have no effect.

This function ignores the widget's `bypass` and `ignoreDefaults` properties.

??? infos "Examples"
    ```javascript
    send('127.0.0.1:4444', '/address', 1)
    send('127.0.0.1:4444', '/address', 1, 2)
    send('/address', 1) // uses the widget's target
    send('/address', {type: 'i', value: 1}) // sends 1 as an integer
    ```


----

#### `getProp(id, name)`
- `id`: widget `id` as a string. Can be `"this"` to target the host widget, or `"parent"` to target the parent widget.
- `name`: property name.

Returns the property called `"name"` of the first matching widget. If the returned value is an object, a copy is returned to allow safe mutation.

----

#### `getIndex(id)`
- `id` (optional): widget `id` as a string. Defaults to `"this"`.

Returns the widget's index in its container.

----

#### `updateProp(id, name)`
- `id`: widget `id` as a string. Can be `"this"` to target the host widget, or `"parent"` to target the parent widget.
- `name`: property name.

Forces a widget to check if one of its properties has changed and update itself if needed.

----

#### `updateCanvas(id)`
- `id`: widget `id` as a string. Can be `"this"` to target the host widget.

Forces a canvas widget redraw.

----

#### `httpGet(url, callback)`

- `url`: url of the resource to fetch (local url only)
- `callback`: function executed when/if the http request succeeds, with the response text as argument

----

#### `stateGet(id)`
- `id`: widget `id` as a string, or array of `id` strings. Can be `"this"` to target the host widget, or `"parent"` to target the parent widget.

Returns a state object (`id:value`) for matching widget and all their children.

----

#### `stateSet(state, options)`

Loads a state object. If the event that triggered the script's execution was initiated by a user interaction, this will make the updated widgets send their value as well.

- `options` (optional): `object`, accepts the following items:
    - `send: false`: prevents widgets from sending osc messages

----

#### `storage`

Global [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) instance, allows storing data that persists upon refresh/relaunch.

----

#### `setTimeout(id, callback, delay)` / `setInterval(id, callback, delay)`

These work like almost their native equivalent, with an extra (optional) `id` argument.

- `id` (optional): unique identifier, if omitted, defaults to `undefined`. If a timeout with the same id is already running, it is cleared before the new one is created (even if `undefined`). `id`s are scoped to the widget's context: two timeouts with the same `id` in two different widgets can run concurrently
- `callback`: function to be executed
- `delay`: delay before execution is ms

Reference:

- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval


Usage note:

If no concurrent timeout / interval is needed, calling `setTimeout`, `setInterval`, `clearTimeout` and `clearInterval` with no `ìd` argument will do.

-----

#### `clearTimeout(id)` / `clearInterval(id)`

Clears timeout with matching `id`.

Reference:

- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout
- https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval

----

#### `setFocus(id)`

- `id` (optional): widget `id` as a string

Gives focus to a widget (ie input widget).

*Built-in client only*: tells the operating system to give the focus to the client window

----

#### `unfocus()`

*Built-in client only*: tells the operating system to give the focus to the window that was focused before.

----

#### `setFocusable(focusable)`

- `focusable`: `0` or `1`

*Built-in client only*: define whether the client window can be focused or not. Text inputs cannot be interacted with when the window is not focusable.

----

#### `getScroll(id)`
- `id`: widget `id` as a string.

Returns the scroll position of a container as a `[x, y]` array.

**Deprecated**

Scrollable panels expose their scroll position normalized between 0 and 1 with their value.

----

#### `setScroll(id, x, y)`
- `id`: widget `id` as a string. Can be `"this"` to target the host widget, or `"parent"` to target the parent widget.
- `x`: horizontal scroll, `undefined` to use current value
- `y`: vertical scroll, `undefined` to use current value

Sets the scroll state of a container.

**Deprecated**

Scrollable panels expose their scroll position normalized between 0 and 1 with their value.

----

#### `toolbar(i1, i2, ...)`
- `iX`: menu entry index

Triggers toolbar action at specified index.

!!! example "Examples"

    - `toolbar(0, 0)` -> Open a new session
    - `toolbar(4)` -> Toggle full screen

    Actions will only be triggered if initiated with a user interaction. Fullscreen cannot be toggled with a simulated interaction (i.e. using `/SET`)

----

#### `openUrl(url)`
- `url`: http(s) url

*Built-in client only*: opens url with the system's default browser
*External client only*: opens url in a new tab

If the event that triggered the script's execution was not initiated by a user interaction, this function will have no effect.

----

#### `runAs(id, callback)`
- `id`: widget `id` as a string.
- `callback`: function to be executed

Run `callback` function as if executed by another that widget matches specified id. This will not change the value of any local variable but `"this"` and `"parent"` arguments (accepted by functions such as `set()`) will be interpreted differently. Timeouts and intervals will be created and cleared in the target widget's scope.

----

#### `reload(keepState)`
- `keepState` (optional): `true` by default, set to false to discard the client's state.

Reload the client application. Cannot be called from the `onCreate` property.

If the event that triggered the script's execution was not initiated by a user interaction, this function will have no effect.


----

#### `getNavigator()`

Returns the instance of [Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator).

----

#### `browseFile(options, callback)`

Opens the file file browser and pass selected file to a callback function (does not create nor read files by itself).

- `options`: object with the following keys:
    - `extension`: allowed extension (default: "*")
    - `directory`: starting directory for browser (default: user's home)
    - `allowDir`: allow choosing a directory instead of a file (default: false)
    - `mode`: "save" or "open"
