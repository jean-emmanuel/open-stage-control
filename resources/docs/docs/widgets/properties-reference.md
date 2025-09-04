<!-- This file is generated automatically from the widget class declarations. See scripts/build-widget-reference.js -->

## Common

??? api "<div id="generic_properties">Generic properties<a class="headerlink" href="#generic_properties" title="Permanent link">#</a></div>"
    Properties shared by all widgets

    


=== "widget"

    | property | type |default | description |
    | --- | --- | --- | --- |
        | <h6 id="lock">lock<a class="headerlink" href="#lock" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to prevent modifying this widget with the editor. This will not prevent deleting the widget or moving it from a container to another. |
        | <h6 id="type">type<a class="headerlink" href="#type" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Widget type |
        | <h6 id="id">id<a class="headerlink" href="#id" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Widgets sharing the same `id` will act as clones and update each other's value(s) without sending extra osc messages (avoid doing so unless the widgets expect the exact same values). |
        | <h6 id="visible">visible<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#visible" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to hide the widget. |
        | <h6 id="interaction">interaction<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#interaction" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable pointer interactions. |
        | <h6 id="comments">comments<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#comments" title="Permanent link">#</a></h6> | `string` | <code>""</code> | User comments. |


=== "geometry"

    | property | type |default | description |
    | --- | --- | --- | --- |
        | <h6 id="left">left<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#left" title="Permanent link">#</a></h6> | `number`&vert;<br/>`string` | <code>"auto"</code> | When both top and left are set to auto, the widget is positioned according to the normal flow of the page (from left to right, by order of creation).<br/><br/>Otherwise, the widget will be positioned at absolute coordinates |
        | <h6 id="top">top<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#top" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"auto"</code> | When both top and left are set to auto, the widget is positioned according to the normal flow of the page (from left to right, by order of creation).<br/><br/>Otherwise, the widget will be positioned at absolute coordinates |
        | <h6 id="width">width<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#width" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"auto"</code> | Widget width |
        | <h6 id="height">height<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#height" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"auto"</code> | Widget height |
        | <h6 id="expand">expand<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#expand" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | If parent's layout is `vertical` or `horizontal`, set this to `true` to stretch the widget to use available space automatically. |


=== "style"

    | property | type |default | description |
    | --- | --- | --- | --- |
        | <h6 id="colorText">colorText<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#colorText" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Text color. Set to "auto" to inherit from parent widget. |
        | <h6 id="colorWidget">colorWidget<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#colorWidget" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Widget's default accent color. Set to "auto" to inherit from parent widget. |
        | <h6 id="colorStroke">colorStroke<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#colorStroke" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Stroke color. Set to "auto" to use `colorWidget`. |
        | <h6 id="colorFill">colorFill<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#colorFill" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Fill color. Set to "auto" to use `colorWidget`. |
        | <h6 id="alphaStroke">alphaStroke<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#alphaStroke" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Stroke color opacity. |
        | <h6 id="alphaFillOff">alphaFillOff<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#alphaFillOff" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Fill color opacity (off). |
        | <h6 id="alphaFillOn">alphaFillOn<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#alphaFillOn" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Fill color opacity (on). |
        | <h6 id="lineWidth">lineWidth<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#lineWidth" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Stroke width. |
        | <h6 id="borderRadius">borderRadius<a class="headerlink" href="#borderRadius" title="Permanent link">#</a></h6> | `number`&vert;<br/>`string` | <code>"auto"</code> | Border radius expressed as a number or a css string. This property may not work for all widgets. |
        | <h6 id="padding">padding<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#padding" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Inner spacing. |
        | <h6 id="html">html<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#html" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Custom html content to be inserted in the widget (before the widget's content). Elements are all unstyled by default, `css` should be used to customize their appearance.<br/><br/>The code is automatically wrapped in &lt;div class="html">&lt;/div><br/><br/>Allowed HTML tags:<br/><br/>&nbsp;&nbsp;h1-6, blockquote, p, a, ul, ol, nl, li,<br/><br/>&nbsp;&nbsp;b, i, strong, em, strike, code, hr, br, div,<br/><br/>&nbsp;&nbsp;table, thead, img, caption, tbody, tr, th, td, pre<br/><br/>Allowed attributes:<br/><br/>&nbsp;&nbsp;&lt;*>: class, style, title, name<br/><br/>&nbsp;&nbsp;&lt;img>: src, width, height |
        | <h6 id="css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke` |


=== "value"

    | property | type |default | description |
    | --- | --- | --- | --- |
        | <h6 id="value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#value" title="Permanent link">#</a></h6> | `*` | <code>""</code> | Define the widget's value depending on other widget's values / properties using the advanced property syntax |
        | <h6 id="default">default<a class="headerlink" href="#default" title="Permanent link">#</a></h6> | `*` | <code>""</code> | If set, the widget will be initialized with this value when the session is loaded. |
        | <h6 id="linkId">linkId<a class="headerlink" href="#linkId" title="Permanent link">#</a></h6> | `string`&vert;<br/>`array` | <code>""</code> | Widgets sharing the same `linkId` update each other's value(s) AND send their respective osc messages.<br/><br/>When prefixed with >>, the `linkId` will make the widget act as a master (sending but not receiving)<br/><br/>When prefixed with <<, the `linkId` will make the widget act as a slave (receiving but not sending) |


=== "osc"

    | property | type |default | description |
    | --- | --- | --- | --- |
        | <h6 id="address">address<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#address" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | OSC address for sending / receiving messages, it must start with a slash (`/`)<br/><br/>By default ("auto"), the widget's id is used: `/widget_id` |
        | <h6 id="preArgs">preArgs<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#preArgs" title="Permanent link">#</a></h6> | `*`&vert;<br/>`array` | <code>""</code> | A value or array of values that will be prepended to the widget's value in the OSC messages it sends.<br/><br/>Incoming messages must match these to affect by the widget. |
        | <h6 id="typeTags">typeTags<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#typeTags" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Defines the osc argument types, one letter per argument (including preArgs)<br/>- If empty, the types are inferred automatically from the values (with numbers casted to floats by default)<br/>- If there are more arguments than type letters, the last type is used for the extra arguments<br/><br/>See <a href="http://opensoundcontrol.org/">OSC 1.0 specification</a> for existing typetags |
        | <h6 id="decimals">decimals<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#decimals" title="Permanent link">#</a></h6> | `integer` | <code>2</code> | Defines the number of decimals to send. |
        | <h6 id="target">target<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#target" title="Permanent link">#</a></h6> | `string`&vert;<br/>`array`&vert;<br/>`null` | <code>""</code> | This defines the targets of the widget's OSC messages<br/>- A `string` or `array` of strings formatted as follow: `ip:port` or `["ip:portA", "ip:portB"]`<br/>- If midi is enabled, targets can be `midi:device_name`<br/>- If no target is set, messages can still be sent if the server has default targets |
        | <h6 id="ignoreDefaults">ignoreDefaults<a class="headerlink" href="#ignoreDefaults" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to ignore the server's default targets |
        | <h6 id="bypass">bypass<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#bypass" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to prevent the widget from sending any osc message |


=== "scripting"

    | property | type |default | description |
    | --- | --- | --- | --- |
        | <h6 id="onCreate">onCreate<a class="headerlink" href="#onCreate" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget (and its children) is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
        | <h6 id="onValue">onValue<a class="headerlink" href="#onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
## Basics

??? api "<div id="button">button<a class="headerlink" href="#button" title="Permanent link">#</a></div>"
    On / off button.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="button_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#button_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--color-text-on`: `colorTextOn` |
            | <h6 id="button_colorTextOn">colorTextOn<a class="headerlink" href="#button_colorTextOn" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Defines the widget's text color when active. |
            | <h6 id="button_label">label<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#button_label" title="Permanent link">#</a></h6> | `string`&vert;<br/>`boolean` | <code>"auto"</code> | Set to `false` to hide completely<br/>- Insert icons using the prefix ^ followed by the icon's name : `^play`, `^pause`, etc (see https://fontawesome.com/search?m=free&s=solid<br/>- Icons can be transformed with the following suffixes: `.flip-[horizontal|vertical|both]`, `.rotate-[90|180|270]`, `.spin`, `.pulse`. Example: `^play.flip-horizontal` |
            | <h6 id="button_vertical">vertical<a class="headerlink" href="#button_vertical" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to display the text vertically |
            | <h6 id="button_wrap">wrap<a class="headerlink" href="#button_wrap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to wrap long lines automatically. Set to `soft` to avoid breaking words.<br/><br/>Choices: `false`, `true`, `soft` |

    === "button"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="button_on">on<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#button_on" title="Permanent link">#</a></h6> | `*` | <code>1</code> | Set to `null` to send send no argument in the osc message. Ignored if `mode` is `momentary`. |
            | <h6 id="button_off">off<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#button_off" title="Permanent link">#</a></h6> | `*` | <code>0</code> | Set to `null` to send send no argument in the osc message. Must be different from `on`. Ignored if `mode` is `momentary` or `tap`. |
            | <h6 id="button_mode">mode<a class="headerlink" href="#button_mode" title="Permanent link">#</a></h6> | `string` | <code>"toggle"</code> | Interaction mode:<br/>- `toggle` (classic on/off switch)<br/>- `push` (press & release)<br/>- `momentary` (no release, no value sent with the address)<br/>- `tap` (no release, sends `on` as value)<br/><br/>Choices: `toggle`, `push`, `momentary`, `tap` |
            | <h6 id="button_doubleTap">doubleTap<a class="headerlink" href="#button_doubleTap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to make the button require a double tap to be pushed instead of a single tap |
            | <h6 id="button_decoupled">decoupled<a class="headerlink" href="#button_decoupled" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` make the local feedback update only when it receives a value from an osc/midi message that matches the `on` or `off` property.<br/><br/>When `decoupled`, the button's value is ambiguous: when interacted with, it will send the value that's requested (`on` or `off` for `toggle` and `push` modes, `on` for `tap` mode, `null` for `momentary`), otherwise it will return the value received from the feedback message (`on` or `off` property).<br/><br/>From a script property, feedback messages can be simulated with:<br/><br/>`set("widget_id", value, {external: true})` |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="button_onValue">onValue<a class="headerlink" href="#button_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Additional variables:<br/>- `locals.touchCoords`: `[x, y]` array representing the touch coordinates, normalized between 0 and 1.<br/>- `locals.external`: `true` if value was received from an osc/midi message, `false otherwise`. |

??? api "<div id="switch">switch<a class="headerlink" href="#switch" title="Permanent link">#</a></div>"
    Value selector button.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="switch_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#switch_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--color-text-on`: `colorTextOn` |
            | <h6 id="switch_colorTextOn">colorTextOn<a class="headerlink" href="#switch_colorTextOn" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Defines the widget's text color when active. |
            | <h6 id="switch_layout">layout<a class="headerlink" href="#switch_layout" title="Permanent link">#</a></h6> | `string` | <code>"vertical"</code> | Defines how items should be laid out<br/><br/>Choices: `vertical`, `horizontal`, `grid` |
            | <h6 id="switch_gridTemplate">gridTemplate<a class="headerlink" href="#switch_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |
            | <h6 id="switch_wrap">wrap<a class="headerlink" href="#switch_wrap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to wrap long lines automatically. Set to `soft` to avoid breaking words.<br/><br/>Choices: `false`, `true`, `soft` |

    === "switch"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="switch_values">values<a class="headerlink" href="#switch_values" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>\{<br/>&nbsp;"Value 1": 1,<br/>&nbsp;"Value 2": 2<br/>}</code> | `Array` of possible values to switch between : `[1,2,3]`<br/><br/>`Object` of `"label":value` pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won't be kept<br/><br/>`{"labels": [], "values": []}` `object` where `labels` and `values` arrays must be of the same length. This syntax allows using the same label for different values. |
            | <h6 id="switch_mode">mode<a class="headerlink" href="#switch_mode" title="Permanent link">#</a></h6> | `string` | <code>"tap"</code> | Interaction mode:<br/>- `tap`: activates when the pointer is down but prevents further scrolling<br/>- `slide`: same as `tap` but allows sliding between values<br/>- `click`: activates upon click only and allows further scrolling<br/>- `flip`: selects the next value upon click regardless of where the widget is touched<br/><br/>Choices: `tap`, `slide`, `click`, `flip` |

??? api "<div id="dropdown">dropdown<a class="headerlink" href="#dropdown" title="Permanent link">#</a></div>"
    Native dropdown menu.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="dropdown_label">label<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#dropdown_label" title="Permanent link">#</a></h6> | `string`&vert;<br/>`boolean` | <code>"auto"</code> | Displayed text (defaults to current value). Keywords `%key` and `%value` will be replaced by the widget's selected key/value. |
            | <h6 id="dropdown_icon">icon<a class="headerlink" href="#dropdown_icon" title="Permanent link">#</a></h6> | `boolean` | <code>"true"</code> | Set to `false` to hide the dropdown icon |
            | <h6 id="dropdown_align">align<a class="headerlink" href="#dropdown_align" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Set to `left` or `right` to change text alignment (otherwise center)<br/><br/>Choices: `center`, `left`, `right` |

    === "dropdown"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="dropdown_values">values<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#dropdown_values" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>\{<br/>&nbsp;"Value 1": 1,<br/>&nbsp;"Value 2": 2<br/>}</code> | `Array` of possible values to switch between : `[1,2,3]`<br/><br/>`Object` of label:value pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won't be kept<br/><br/>`{"labels": [], "values": []}` `object` where `labels` and `values` arrays must be of the same length. This syntax allows using the same label for different values. |

??? api "<div id="menu">menu<a class="headerlink" href="#menu" title="Permanent link">#</a></div>"
    Drag and drop menu with a circular or grid layout.

    === "geometry"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="menu_size">size<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#menu_size" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array` | <code>200</code> | - If `layout` is `circular`: diameter (in px)<br/>- Else: square size or `[width, height]` array |
            | <h6 id="menu_ignoreTabs">ignoreTabs<a class="headerlink" href="#menu_ignoreTabs" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to allow the menu overflowing its tab ancestors. |

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="menu_label">label<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#menu_label" title="Permanent link">#</a></h6> | `string`&vert;<br/>`boolean` | <code>"auto"</code> | Displayed text (defaults to current value). Keywords `%key` and `%value` will be replaced by the widget's selected key/value. |
            | <h6 id="menu_icon">icon<a class="headerlink" href="#menu_icon" title="Permanent link">#</a></h6> | `boolean` | <code>"true"</code> | Set to `false` to hide the dropdown icon |
            | <h6 id="menu_textAlign">textAlign<a class="headerlink" href="#menu_textAlign" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Set to `left` or `right` to change text alignment (otherwise center)<br/><br/>Choices: `center`, `left`, `right` |
            | <h6 id="menu_menuAlignV">menuAlignV<a class="headerlink" href="#menu_menuAlignV" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Set to `top` or `bottom` to change menu alignment (otherwise center)<br/><br/>Choices: `center`, `top`, `bottom` |
            | <h6 id="menu_menuAlignH">menuAlignH<a class="headerlink" href="#menu_menuAlignH" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Set to `left` or `right` to change menu alignment (otherwise center)<br/><br/>Choices: `center`, `left`, `right` |
            | <h6 id="menu_layout">layout<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#menu_layout" title="Permanent link">#</a></h6> | `string` | <code>"circular"</code> | Defines whether the menu's layout should be rendered in a circle or in a box<br/><br/>Choices: `circular`, `horizontal`, `vertical`, `grid` |
            | <h6 id="menu_gridTemplate">gridTemplate<a class="headerlink" href="#menu_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |

    === "menu"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="menu_mode">mode<a class="headerlink" href="#menu_mode" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Interaction modes:<br/>- `default`: opens on touch, closes and changes value on release<br/>- `toggle`: opens on click, closes and changes value on next click<br/>- `swipe`: opens on touch, changes value when the pointer moves above items, closes on release<br/>- `doubleTap`: same as `default` but opens on double tap<br/>- `doubleTap-toggle`: same as `toggle` but opens on double tap<br/><br/>Choices: `default`, `toggle`, `swipe`, `doubleTap`, `doubleTap-toggle` |
            | <h6 id="menu_values">values<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#menu_values" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>[<br/>&nbsp;1,<br/>&nbsp;2,<br/>&nbsp;3<br/>]</code> | `Array` of possible values to switch between : `[1,2,3]`<br/><br/>`Object` of label:value pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won't be kept<br/><br/>`{"labels": [], "values": []}` `object` where `labels` and `values` arrays must be of the same length. This syntax allows using the same label for different values. |
            | <h6 id="menu_weights">weights<a class="headerlink" href="#menu_weights" title="Permanent link">#</a></h6> | `array` | <code>""</code> | `Array` of `number` defining the weights of each value in `values`<br/><br/>Ignored when `mode` is `grid` |

??? api "<div id="input">input<a class="headerlink" href="#input" title="Permanent link">#</a></div>"
    Text input.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="input_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#input_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="input_align">align<a class="headerlink" href="#input_align" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Set to `left` or `right` to change text alignment (otherwise center)<br/><br/>Choices: `center`, `left`, `right` |
            | <h6 id="input_unit">unit<a class="headerlink" href="#input_unit" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Unit will be appended to the displayed widget's value (it doesn't affect osc messages) |

    === "input"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="input_asYouType">asYouType<a class="headerlink" href="#input_asYouType" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to make the input send its value at each keystroke |
            | <h6 id="input_numeric">numeric<a class="headerlink" href="#input_numeric" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to allow numeric values only and display a numeric keyboard on mobile devices<br/><br/>Can be a number to specify the stepping value for mousewheel interaction (only when the input is focused). |
            | <h6 id="input_validation">validation<a class="headerlink" href="#input_validation" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Regular expression: if the submitted value doesn't match the regular expression, it will be reset to the last valid value.<br/><br/>If leading and trailing slashes are omitted, they will be added automatically and the flag will be set to "gm"<br/><br/>Examples:<br/>- `^[0-9]*$` accepts digits only, any number of them<br/>- `/^[a-zs]{0,10}$/i` accept between 0 and 10 alphabetic characters and spaces (case insensitive) |
            | <h6 id="input_maxLength">maxLength<a class="headerlink" href="#input_maxLength" title="Permanent link">#</a></h6> | `number` | <code>""</code> | Maximum number of characters allowed |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="input_onValue">onValue<a class="headerlink" href="#input_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |

??? api "<div id="textarea">textarea<a class="headerlink" href="#textarea" title="Permanent link">#</a></div>"
    Text area (multi line input). Tip: hit shift + enter for new lines.

??? api "<div id="file">file<a class="headerlink" href="#file" title="Permanent link">#</a></div>"
    File/Folder selector (server-side).

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="file_align">align<a class="headerlink" href="#file_align" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Set to `left` or `right` to change text alignment (otherwise center)<br/><br/>Choices: `center`, `left`, `right` |
            | <h6 id="file_hidePath">hidePath<a class="headerlink" href="#file_hidePath" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to only display the filename (the whole path will still be used as value) |
            | <h6 id="file_mode">mode<a class="headerlink" href="#file_mode" title="Permanent link">#</a></h6> | `string` | <code>"open"</code> | File browser mode<br/><br/>Choices: `open`, `save` |

    === "file"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="file_directory">directory<a class="headerlink" href="#file_directory" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Default browsing directory |
            | <h6 id="file_extension">extension<a class="headerlink" href="#file_extension" title="Permanent link">#</a></h6> | `string`&vert;<br/>`array` | <code>"*"</code> | Only display files with this extension. Multiple extensions can be specified with an array of strings (`["jpg", "jpeg"]`) |
            | <h6 id="file_allowDir">allowDir<a class="headerlink" href="#file_allowDir" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Allow selecting a folder (by pressing "open" when no file is selected) |
## Containers

??? api "<div id="panel">panel<a class="headerlink" href="#panel" title="Permanent link">#</a></div>"
    Widgets or Tabs container.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="panel_colorBg">colorBg<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#panel_colorBg" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Panel background color. Set to "auto" to inherit from parent widget. |
            | <h6 id="panel_layout">layout<a class="headerlink" href="#panel_layout" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Defines how children are laid out.<br/><br/>Choices: `default`, `vertical`, `horizontal`, `grid` |
            | <h6 id="panel_justify">justify<a class="headerlink" href="#panel_justify" title="Permanent link">#</a></h6> | `string` | <code>"start"</code> | If `layout` is `vertical` or `horizontal`, defines how widgets should be justified.<br/><br/>Choices: `start`, `end`, `center`, `space-around`, `space-between` |
            | <h6 id="panel_gridTemplate">gridTemplate<a class="headerlink" href="#panel_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |
            | <h6 id="panel_contain">contain<a class="headerlink" href="#panel_contain" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | If `layout` is `vertical` or `horizontal`, prevents children from overflowing the panel. |
            | <h6 id="panel_scroll">scroll<a class="headerlink" href="#panel_scroll" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable scrollbars |
            | <h6 id="panel_innerPadding">innerPadding<a class="headerlink" href="#panel_innerPadding" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to make the `padding` property apply only between children and not at the container's inner boundaries. |
            | <h6 id="panel_tabsPosition">tabsPosition<a class="headerlink" href="#panel_tabsPosition" title="Permanent link">#</a></h6> | `string` | <code>"top"</code> | Defines the position of the navigation bar if the panel contains tabs<br/><br/>Choices: `top`, `bottom`, `left`, `right`, `hidden` |

    === "panel"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="panel_variables">variables<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#panel_variables" title="Permanent link">#</a></h6> | `*` | <code>"@\{parent.variables}"</code> | Defines one or more arbitrary variables that can be inherited by children widgets |
            | <h6 id="panel_traversing">traversing<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#panel_traversing" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to enable traversing gestures in this widget. Set to `smart` to limit affected widgets by the type of the first touched widget<br/><br/>Choices: `false`, `true`, `smart` |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="panel_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#panel_value" title="Permanent link">#</a></h6> | `integer`&vert;<br/>`array` | <code>""</code> | If the panel contains tabs, its value defines which tab is selected selected (by index, starting with 0).<br/><br/>If the panel contains widgets and `scroll` is `true`, its value is an array that contains the scrolling state between 0 and 1 for the x and y axis.  |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="panel_onTouch">onTouch<a class="headerlink" href="#panel_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the session is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |

    === "children"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="panel_widgets">widgets<a class="headerlink" href="#panel_widgets" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously. |
            | <h6 id="panel_tabs">tabs<a class="headerlink" href="#panel_tabs" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a tab object. A panel cannot contain widgets and tabs simultaneously |

??? api "<div id="modal">modal<a class="headerlink" href="#modal" title="Permanent link">#</a></div>"
    A toggle button that opens a popup panel. Cannot contain tabs directly.

    === "geometry"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="modal_popupWidth">popupWidth<a class="headerlink" href="#modal_popupWidth" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"80%"</code> | Modal popup's size |
            | <h6 id="modal_popupHeight">popupHeight<a class="headerlink" href="#modal_popupHeight" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"80%"</code> | Modal popup's size |
            | <h6 id="modal_popupLeft">popupLeft<a class="headerlink" href="#modal_popupLeft" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"auto"</code> | Modal popup's position |
            | <h6 id="modal_popupTop">popupTop<a class="headerlink" href="#modal_popupTop" title="Permanent link">#</a></h6> | `number`&vert;<br/>`percentage` | <code>"auto"</code> | Modal popup's position |
            | <h6 id="modal_relative">relative<a class="headerlink" href="#modal_relative" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to make the modal's position relative to the button's position. |
            | <h6 id="modal_ignoreTabs">ignoreTabs<a class="headerlink" href="#modal_ignoreTabs" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to allow the modal overflowing its tab ancestors. |

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="modal_colorBg">colorBg<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_colorBg" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Panel background color. Set to "auto" to inherit from parent widget. |
            | <h6 id="modal_layout">layout<a class="headerlink" href="#modal_layout" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Defines how children are laid out.<br/><br/>Choices: `default`, `vertical`, `horizontal`, `grid` |
            | <h6 id="modal_justify">justify<a class="headerlink" href="#modal_justify" title="Permanent link">#</a></h6> | `string` | <code>"start"</code> | If `layout` is `vertical` or `horizontal`, defines how widgets should be justified.<br/><br/>Choices: `start`, `end`, `center`, `space-around`, `space-between` |
            | <h6 id="modal_gridTemplate">gridTemplate<a class="headerlink" href="#modal_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |
            | <h6 id="modal_contain">contain<a class="headerlink" href="#modal_contain" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | If `layout` is `vertical` or `horizontal`, prevents children from overflowing the panel. |
            | <h6 id="modal_scroll">scroll<a class="headerlink" href="#modal_scroll" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable scrollbars |
            | <h6 id="modal_innerPadding">innerPadding<a class="headerlink" href="#modal_innerPadding" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to make the `padding` property apply only between children and not at the container's inner boundaries. |
            | <h6 id="modal_label">label<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_label" title="Permanent link">#</a></h6> | `string`&vert;<br/>`boolean` | <code>"auto"</code> | Set to `false` to hide completely<br/>- Insert icons using the prefix ^ followed by the icon's name : `^play`, `^pause`, etc (see https://fontawesome.com/icons?d=gallery&s=solid&m=free)<br/>- Icons can be transformed with the following suffixes: `.flip-[horizontal|vertical|both]`, `.rotate-[90|180|270]`, `.spin`, `.pulse`. Example: `^play.flip-horizontal` |
            | <h6 id="modal_popupLabel">popupLabel<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_popupLabel" title="Permanent link">#</a></h6> | `string`&vert;<br/>`boolean` | <code>"auto"</code> | Alternative label for the modal popup |
            | <h6 id="modal_popupPadding">popupPadding<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_popupPadding" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Modal's inner spacing. |

    === "modal"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="modal_variables">variables<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_variables" title="Permanent link">#</a></h6> | `*` | <code>"@\{parent.variables}"</code> | Defines one or more arbitrary variables that can be inherited by children widgets |
            | <h6 id="modal_traversing">traversing<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_traversing" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to enable traversing gestures in this widget. Set to `smart` to limit affected widgets by the type of the first touched widget<br/><br/>Choices: `false`, `true`, `smart` |
            | <h6 id="modal_doubleTap">doubleTap<a class="headerlink" href="#modal_doubleTap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to make the modal require a double tap to open instead of a single tap |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="modal_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#modal_value" title="Permanent link">#</a></h6> | `integer` | <code>""</code> | Defines the modal's state:`0` for closed, `1` for opened |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="modal_onTouch">onTouch<a class="headerlink" href="#modal_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the session is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |

    === "children"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="modal_widgets">widgets<a class="headerlink" href="#modal_widgets" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously. |
            | <h6 id="modal_tabs">tabs<a class="headerlink" href="#modal_tabs" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a tab object. A panel cannot contain widgets and tabs simultaneously |

??? api "<div id="clone">clone<a class="headerlink" href="#clone" title="Permanent link">#</a></div>"
    Widget replication with overridable properties.

    === "clone"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="clone_widgetId">widgetId<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#clone_widgetId" title="Permanent link">#</a></h6> | `string` | <code>""</code> | `id` of the widget to clone |
            | <h6 id="clone_props">props<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#clone_props" title="Permanent link">#</a></h6> | `object` | <code>\{}</code> | Cloned widget's properties to override |

??? api "<div id="fragment">fragment<a class="headerlink" href="#fragment" title="Permanent link">#</a></div>"
    Embedded session or fragment file with overridable properties.

    === "fragment"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="fragment_file">file<a class="headerlink" href="#fragment_file" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Fragment file path (relative to the session or theme file location by default, falling back to absolute path) |
            | <h6 id="fragment_fallback">fallback<a class="headerlink" href="#fragment_fallback" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Fallack fragment file path, loaded if `file` can't be opened |
            | <h6 id="fragment_props">props<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fragment_props" title="Permanent link">#</a></h6> | `object` | <code>\{}</code> | Fragment widget's properties to override |

??? api "<div id="matrix">matrix<a class="headerlink" href="#matrix" title="Permanent link">#</a></div>"
    Generic matrix for creating rows/columns of widgets.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="matrix_colorBg">colorBg<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#matrix_colorBg" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Panel background color. Set to "auto" to inherit from parent widget. |
            | <h6 id="matrix_layout">layout<a class="headerlink" href="#matrix_layout" title="Permanent link">#</a></h6> | `string` | <code>"horizontal"</code> | Defines how children are laid out.<br/><br/>Choices: `horizontal`, `vertical`, `grid` |
            | <h6 id="matrix_justify">justify<a class="headerlink" href="#matrix_justify" title="Permanent link">#</a></h6> | `string` | <code>"start"</code> | If `layout` is `vertical` or `horizontal`, defines how widgets should be justified.<br/><br/>Choices: `start`, `end`, `center`, `space-around`, `space-between` |
            | <h6 id="matrix_gridTemplate">gridTemplate<a class="headerlink" href="#matrix_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |
            | <h6 id="matrix_contain">contain<a class="headerlink" href="#matrix_contain" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | If `layout` is `vertical` or `horizontal`, prevents children from overflowing the panel. |
            | <h6 id="matrix_scroll">scroll<a class="headerlink" href="#matrix_scroll" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable scrollbars |
            | <h6 id="matrix_innerPadding">innerPadding<a class="headerlink" href="#matrix_innerPadding" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to make the `padding` property apply only between children and not at the container's inner boundaries. |

    === "matrix"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="matrix_variables">variables<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#matrix_variables" title="Permanent link">#</a></h6> | `*` | <code>"@\{parent.variables}"</code> | Defines one or more arbitrary variables that can be inherited by children widgets |
            | <h6 id="matrix_traversing">traversing<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#matrix_traversing" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to enable traversing gestures in this widget. Set to `smart` to limit affected widgets by the type of the first touched widget<br/><br/>Choices: `false`, `true`, `smart` |
            | <h6 id="matrix_widgetType">widgetType<a class="headerlink" href="#matrix_widgetType" title="Permanent link">#</a></h6> | `string` | <code>"button"</code> | Defines the type of the widgets in the matrix |
            | <h6 id="matrix_quantity">quantity<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#matrix_quantity" title="Permanent link">#</a></h6> | `number` | <code>4</code> | Defines the number of widgets in the matrix |
            | <h6 id="matrix_props">props<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#matrix_props" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"label": "#{$}"<br/>}</code> | Defines a set of property to override the widgets' defaults.<br/><br/>JS{} and #{} blocks in this field are resolved with an extra variable representing each widget's index: `$` (e.g. `#{$}`)<br/><br/>Advanced syntax blocks (@{}, OSC{}, JS{}, VAR{} and #{}) are resolved at the matrix' scope (ie @{this.variables} returns the matrix' variables property)<br/><br/>Advanced syntax blocks can be passed to children without being resolved at the matrix' scope by adding an underscore before the opening bracket.<br/><br/>Note: unless overridden, children inherit from the matrix' `id` and osc properties (`id` and `address` are appended with `/$`) |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="matrix_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#matrix_value" title="Permanent link">#</a></h6> | `integer`&vert;<br/>`array` | <code>""</code> | If the panel contains tabs, its value defines which tab is selected selected (by index, starting with 0).<br/><br/>If the panel contains widgets and `scroll` is `true`, its value is an array that contains the scrolling state between 0 and 1 for the x and y axis.  |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="matrix_onTouch">onTouch<a class="headerlink" href="#matrix_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the session is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |

    === "children"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="matrix_widgets">widgets<a class="headerlink" href="#matrix_widgets" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously. |
            | <h6 id="matrix_tabs">tabs<a class="headerlink" href="#matrix_tabs" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a tab object. A panel cannot contain widgets and tabs simultaneously |

??? api "<div id="keyboard">keyboard<a class="headerlink" href="#keyboard" title="Permanent link">#</a></div>"
    Piano keyboard.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="keyboard_colorWhite">colorWhite<a class="headerlink" href="#keyboard_colorWhite" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | White keys color. |
            | <h6 id="keyboard_colorBlack">colorBlack<a class="headerlink" href="#keyboard_colorBlack" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Black keys color. |

    === "keyboard"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="keyboard_keys">keys<a class="headerlink" href="#keyboard_keys" title="Permanent link">#</a></h6> | `number` | <code>25</code> | Defines the number keys |
            | <h6 id="keyboard_start">start<a class="headerlink" href="#keyboard_start" title="Permanent link">#</a></h6> | `number` | <code>48</code> | MIDI note number to start with (default is C4)<br/><br/>Standard keyboards settings are: `[25, 48]`, `[49, 36]`, `[61, 36]`, `[88, 21]` |
            | <h6 id="keyboard_traversing">traversing<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#keyboard_traversing" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable traversing gestures |
            | <h6 id="keyboard_on">on<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#keyboard_on" title="Permanent link">#</a></h6> | `*` | <code>1</code> | Set to `null` to send send no argument in the osc message |
            | <h6 id="keyboard_off">off<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#keyboard_off" title="Permanent link">#</a></h6> | `*` | <code>0</code> | Set to `null` to send send no argument in the osc message |
            | <h6 id="keyboard_velocity">velocity<a class="headerlink" href="#keyboard_velocity" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to map the touch coordinates between `off` (top) and `on` (bottom). Requires `on` and `off` to be numbers |
            | <h6 id="keyboard_mode">mode<a class="headerlink" href="#keyboard_mode" title="Permanent link">#</a></h6> | `string` | <code>"push"</code> | Interaction mode:<br/>- `push` (press & release)<br/>- `toggle` (on/off switches)<br/>- `tap` (no release)<br/><br/>Choices: `push`, `toggle`, `tap` |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="keyboard_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#keyboard_value" title="Permanent link">#</a></h6> | `array` | <code>""</code> | The keyboard widget accepts the following values:<br/>- a `[note, value]` array to set the value of a single key where `note` is the note number and `value` depends on the `on` and `off` properties (any value different from `off` will be interpreted as `on`).<br/>- an array of values with one item per key in the keyboard |

??? api "<div id="patchbay">patchbay<a class="headerlink" href="#patchbay" title="Permanent link">#</a></div>"
    Connect inputs to outputs.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="patchbay_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#patchbay_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |

    === "patchbay"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="patchbay_inputs">inputs<a class="headerlink" href="#patchbay_inputs" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>[<br/>&nbsp;"input_1",<br/>&nbsp;"input_2"<br/>]</code> | - `Array` of input names : `['input_1', 'input_2']`<br/>- `Object` of `"label_1": "input_1"` pairs (example: `{"label a": "name 1", "label b": "name 2"}`). Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won't be kept<br/><br/><br/><br/>Patchbay inputs can be connected to one or more outputs and will send messages of the following form when they are connected/disconnected: <br/><br/>`/patchbay_address input_x output_x output_y etc`<br/><br/>If no output is connected to the input, the message will be `/patchbay_address input_x`<br/><br/>The inputs values can be consumed with the property inheritance syntax: `@{patchbay_id/input_1}` returns an array of output names connected to `input_1`.<br/><br/>To change connections via scripting, one must target the input nodes as follows: `set('patchbay_id/input_name', ['output_x', 'output_y'])` |
            | <h6 id="patchbay_outputs">outputs<a class="headerlink" href="#patchbay_outputs" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>[<br/>&nbsp;"output_1",<br/>&nbsp;"output_2"<br/>]</code> | List of output values the inputs can connect to (see `inputs`). |
            | <h6 id="patchbay_exclusive">exclusive<a class="headerlink" href="#patchbay_exclusive" title="Permanent link">#</a></h6> | `string` | <code>false</code> | - `in`: allows only one connection per input<br/>- `out`: allows only one connection per output<br/>- `both`: allows only one connection per input and output<br/><br/>Choices: `false`, `in`, `out`, `both` |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="patchbay_onValue">onValue<a class="headerlink" href="#patchbay_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |

??? api "<div id="folder">folder<a class="headerlink" href="#folder" title="Permanent link">#</a></div>"
    Flat container that doesn't affect layout. Mostly useful for grouping widgets in the tree.

    === "folder"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="folder_variables">variables<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#folder_variables" title="Permanent link">#</a></h6> | `*` | <code>"@\{parent.variables}"</code> | Defines one or more arbitrary variables that can be inherited by children widgets |

    === "children"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="folder_widgets">widgets<a class="headerlink" href="#folder_widgets" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously. |
            | <h6 id="folder_tabs">tabs<a class="headerlink" href="#folder_tabs" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a tab object. A panel cannot contain widgets and tabs simultaneously |

??? api "<div id="root">root<a class="headerlink" href="#root" title="Permanent link">#</a></div>"
    Main (unique) container

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="root_colorBg">colorBg<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#root_colorBg" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Panel background color. Set to "auto" to inherit from parent widget. |
            | <h6 id="root_layout">layout<a class="headerlink" href="#root_layout" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Defines how children are laid out.<br/><br/>Choices: `default`, `vertical`, `horizontal`, `grid` |
            | <h6 id="root_justify">justify<a class="headerlink" href="#root_justify" title="Permanent link">#</a></h6> | `string` | <code>"start"</code> | If `layout` is `vertical` or `horizontal`, defines how widgets should be justified.<br/><br/>Choices: `start`, `end`, `center`, `space-around`, `space-between` |
            | <h6 id="root_gridTemplate">gridTemplate<a class="headerlink" href="#root_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |
            | <h6 id="root_contain">contain<a class="headerlink" href="#root_contain" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | If `layout` is `vertical` or `horizontal`, prevents children from overflowing the panel. |
            | <h6 id="root_scroll">scroll<a class="headerlink" href="#root_scroll" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable scrollbars |
            | <h6 id="root_innerPadding">innerPadding<a class="headerlink" href="#root_innerPadding" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to make the `padding` property apply only between children and not at the container's inner boundaries. |
            | <h6 id="root_tabsPosition">tabsPosition<a class="headerlink" href="#root_tabsPosition" title="Permanent link">#</a></h6> | `string` | <code>"top"</code> | Defines the position of the navigation bar if the panel contains tabs<br/><br/>Choices: `top`, `bottom`, `left`, `right`, `hidden` |
            | <h6 id="root_hideMenu">hideMenu<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#root_hideMenu" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to hide the main menu button. |

    === "root"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="root_variables">variables<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#root_variables" title="Permanent link">#</a></h6> | `*` | <code>"@\{parent.variables}"</code> | Defines one or more arbitrary variables that can be inherited by children widgets |
            | <h6 id="root_traversing">traversing<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#root_traversing" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to enable traversing gestures in this widget. Set to `smart` to limit affected widgets by the type of the first touched widget<br/><br/>Choices: `false`, `true`, `smart` |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="root_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#root_value" title="Permanent link">#</a></h6> | `integer`&vert;<br/>`array` | <code>""</code> | If the panel contains tabs, its value defines which tab is selected selected (by index, starting with 0).<br/><br/>If the panel contains widgets and `scroll` is `true`, its value is an array that contains the scrolling state between 0 and 1 for the x and y axis.  |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="root_onTouch">onTouch<a class="headerlink" href="#root_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the session is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |
            | <h6 id="root_onPreload">onPreload<a class="headerlink" href="#root_onPreload" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed before any other widget is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

    === "children"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="root_widgets">widgets<a class="headerlink" href="#root_widgets" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously. |
            | <h6 id="root_tabs">tabs<a class="headerlink" href="#root_tabs" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a tab object. A panel cannot contain widgets and tabs simultaneously |

??? api "<div id="tab">tab<a class="headerlink" href="#tab" title="Permanent link">#</a></div>"
    Tabbed panel widget

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="tab_colorBg">colorBg<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#tab_colorBg" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Panel background color. Set to "auto" to inherit from parent widget. |
            | <h6 id="tab_layout">layout<a class="headerlink" href="#tab_layout" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Defines how children are laid out.<br/><br/>Choices: `default`, `vertical`, `horizontal`, `grid` |
            | <h6 id="tab_justify">justify<a class="headerlink" href="#tab_justify" title="Permanent link">#</a></h6> | `string` | <code>"start"</code> | If `layout` is `vertical` or `horizontal`, defines how widgets should be justified.<br/><br/>Choices: `start`, `end`, `center`, `space-around`, `space-between` |
            | <h6 id="tab_gridTemplate">gridTemplate<a class="headerlink" href="#tab_gridTemplate" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number` | <code>""</code> | If `layout` is `grid`, can be either a number of columns or a valid value for the css property "grid-template". |
            | <h6 id="tab_contain">contain<a class="headerlink" href="#tab_contain" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | If `layout` is `vertical` or `horizontal`, prevents children from overflowing the panel. |
            | <h6 id="tab_scroll">scroll<a class="headerlink" href="#tab_scroll" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to disable scrollbars |
            | <h6 id="tab_innerPadding">innerPadding<a class="headerlink" href="#tab_innerPadding" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to make the `padding` property apply only between children and not at the container's inner boundaries. |
            | <h6 id="tab_tabsPosition">tabsPosition<a class="headerlink" href="#tab_tabsPosition" title="Permanent link">#</a></h6> | `string` | <code>"top"</code> | Defines the position of the navigation bar if the panel contains tabs<br/><br/>Choices: `top`, `bottom`, `left`, `right`, `hidden` |
            | <h6 id="tab_label">label<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#tab_label" title="Permanent link">#</a></h6> | `string`&vert;<br/>`boolean` | <code>"auto"</code> | Set to `false` to hide completely<br/>- Insert icons using the prefix ^ followed by the icon's name : `^play`, `^pause`, etc (see https://fontawesome.com/icons?d=gallery&s=solid&m=free)<br/>- Icons can be transformed with the following suffixes: `.flip-[horizontal|vertical|both]`, `.rotate-[90|180|270]`, `.spin`, `.pulse`. Example: `^play.flip-horizontal` |

    === "tab"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="tab_variables">variables<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#tab_variables" title="Permanent link">#</a></h6> | `*` | <code>"@\{parent.variables}"</code> | Defines one or more arbitrary variables that can be inherited by children widgets |
            | <h6 id="tab_traversing">traversing<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#tab_traversing" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to enable traversing gestures in this widget. Set to `smart` to limit affected widgets by the type of the first touched widget<br/><br/>Choices: `false`, `true`, `smart` |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="tab_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#tab_value" title="Permanent link">#</a></h6> | `integer`&vert;<br/>`array` | <code>""</code> | If the panel contains tabs, its value defines which tab is selected selected (by index, starting with 0).<br/><br/>If the panel contains widgets and `scroll` is `true`, its value is an array that contains the scrolling state between 0 and 1 for the x and y axis.  |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="tab_onTouch">onTouch<a class="headerlink" href="#tab_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the session is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |

    === "children"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="tab_widgets">widgets<a class="headerlink" href="#tab_widgets" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a widget object. A panel cannot contain widgets and tabs simultaneously. |
            | <h6 id="tab_tabs">tabs<a class="headerlink" href="#tab_tabs" title="Permanent link">#</a></h6> | `array` | <code>[]</code> | Each element of the array must be a tab object. A panel cannot contain widgets and tabs simultaneously |
## Frames

??? api "<div id="frame">frame<a class="headerlink" href="#frame" title="Permanent link">#</a></div>"
    Embed a web page in a frame. Note: some websites do not allow this.

    === "frame"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="frame_allow">allow<a class="headerlink" href="#frame_allow" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Content for the iframe element's <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/allow">allow</a> attribute |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="frame_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#frame_value" title="Permanent link">#</a></h6> | `string` | <code>""</code> | External web page URL. |

??? api "<div id="svg">svg<a class="headerlink" href="#svg" title="Permanent link">#</a></div>"
    Svg parser.

    === "svg"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="svg_svg">svg<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#svg_svg" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Svg xml definition (will be wrapped in a `< svg />` element) |

??? api "<div id="html">html<a class="headerlink" href="#html" title="Permanent link">#</a></div>"
    Simple HTML parser.

??? api "<div id="image">image<a class="headerlink" href="#image" title="Permanent link">#</a></div>"
    Load a image (url or base64-encoded).

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="image_size">size<a class="headerlink" href="#image_size" title="Permanent link">#</a></h6> | `string` | <code>"cover"</code> | CSS background-size<br/><br/>Choices: `cover`, `contain`, `auto` |
            | <h6 id="image_position">position<a class="headerlink" href="#image_position" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | CSS background-position<br/><br/>Choices: `center`, `left`, `right`, `top`, `bottom`, `left top`, `left bottom`, `right top`, `right bottom` |
            | <h6 id="image_repeat">repeat<a class="headerlink" href="#image_repeat" title="Permanent link">#</a></h6> | `string` | <code>"no-repeat"</code> | CSS background-repeat<br/><br/>Choices: `no-repeat`, `repeat`, `repeat-x`, `repeat-y`, `space`, `round` |

    === "image"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="image_cache">cache<a class="headerlink" href="#image_cache" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to false to disable image caching (forces file reload when updating or editing the widget).<br/><br/>When true, sending `reload` to the widget reloads its image without changing its value |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="image_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#image_value" title="Permanent link">#</a></h6> | `string` | <code>""</code> | - File `url` or `path` (relative to the session or theme file location by default, falling back to absolute path)<br/>- Base64 encoded image : `data:image/...`<br/>- Enter "qrcode" to display the server's address QR code |
## Graphs

??? api "<div id="plot">plot<a class="headerlink" href="#plot" title="Permanent link">#</a></div>"
    XY coordinates plot.

    === "widget"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="plot_interaction">interaction<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#plot_interaction" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `false` to disable pointer interactions. |

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="plot_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#plot_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="plot_dots">dots<a class="headerlink" href="#plot_dots" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Draw dots on the line |
            | <h6 id="plot_bars">bars<a class="headerlink" href="#plot_bars" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to use draw bars instead (disables `logScaleX` and forces `x axis` even spacing) |
            | <h6 id="plot_pips">pips<a class="headerlink" href="#plot_pips" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to hide the scale |

    === "plot"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="plot_rangeX">rangeX<a class="headerlink" href="#plot_rangeX" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the x axis |
            | <h6 id="plot_rangeY">rangeY<a class="headerlink" href="#plot_rangeY" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the y axis |
            | <h6 id="plot_logScaleX">logScaleX<a class="headerlink" href="#plot_logScaleX" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the x axis. Set to `-1` for exponential scale. |
            | <h6 id="plot_logScaleY">logScaleY<a class="headerlink" href="#plot_logScaleY" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the y axis. Set to `-1` for exponential scale. |
            | <h6 id="plot_origin">origin<a class="headerlink" href="#plot_origin" title="Permanent link">#</a></h6> | `number`&vert;<br/>`boolean` | <code>"auto"</code> | Defines the y axis origin. Set to `false` to disable it |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="plot_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#plot_value" title="Permanent link">#</a></h6> | `array`&vert;<br/>`string` | <code>""</code> | - `Array` of `y` values: `[y1, y2, ...]`<br/>- `Array` of `[x, y]` `array` values: `[[x1 , y1], [x2, y2], ...]`<br/>- `String` `array`: `"[y1, y2, ...]"` or `"[[x1 , y1], [x2, y2], ...]"`<br/>- `String` `object` to update specific coordinates only: `"{0: y1, 1: y2}"` or `"{0: [x1, y1], 1: [x2, y2]}"` |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="plot_onValue">onValue<a class="headerlink" href="#plot_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |

??? api "<div id="eq">eq<a class="headerlink" href="#eq" title="Permanent link">#</a></div>"
    Draws logarithmic frequency response from an array of filter objects.

    === "widget"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="eq_interaction">interaction<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#eq_interaction" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `false` to disable pointer interactions. |

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="eq_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#eq_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="eq_dots">dots<a class="headerlink" href="#eq_dots" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Draw dots on the line |
            | <h6 id="eq_bars">bars<a class="headerlink" href="#eq_bars" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to use draw bars instead (disables `logScaleX` and forces `x axis` even spacing) |
            | <h6 id="eq_pips">pips<a class="headerlink" href="#eq_pips" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to hide the scale |

    === "eq"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="eq_rangeX">rangeX<a class="headerlink" href="#eq_rangeX" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 20,<br/>&nbsp;"max": 22000<br/>}</code> | Defines the min and max values for the x axis (in Hz, logarithmic scale)<br/><br/>The sampling frequency used to compute the response curve will be 2 * rangeX.max |
            | <h6 id="eq_rangeY">rangeY<a class="headerlink" href="#eq_rangeY" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": -6,<br/>&nbsp;"max": 6<br/>}</code> | Defines the min and max values for the y axis (in dB) |
            | <h6 id="eq_origin">origin<a class="headerlink" href="#eq_origin" title="Permanent link">#</a></h6> | `number`&vert;<br/>`boolean` | <code>"auto"</code> | Defines the y axis origin. Set to `false` to disable it |
            | <h6 id="eq_filters">filters<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#eq_filters" title="Permanent link">#</a></h6> | `array` | <code>""</code> | Each item must be an object with the following properties<br/>- `type`: string ("highpass", "highshelf", "lowpass", "lowshelf", "peak", "bandpass" or "notch", default: "peak")<br/>- `freq`: number (filter's resonant frequency, default: 1000)<br/>- `q`: number (Q factor, default: 1)<br/>- `gain`: number (default: 0)<br/>- `on`: boolean (default: true)<br/>- `poles`: if `type` is "highpass" or "lowpass", indicates the number of poles for the filter (if omitted or 0, a biquad filter with Q factor is used). Set to 1 for 6dB/otaves roll-off, 2 for 12dB/octaves, etc.<br/><br/>See https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode |
            | <h6 id="eq_pips">pips<a class="headerlink" href="#eq_pips" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to false to hide the scale |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="eq_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#eq_value" title="Permanent link">#</a></h6> | `array`&vert;<br/>`string` | <code>""</code> | - `Array` of `y` values: `[y1, y2, ...]`<br/>- `Array` of `[x, y]` `array` values: `[[x1 , y1], [x2, y2], ...]`<br/>- `String` `array`: `"[y1, y2, ...]"` or `"[[x1 , y1], [x2, y2], ...]"`<br/>- `String` `object` to update specific coordinates only: `"{0: y1, 1: y2}"` or `"{0: [x1, y1], 1: [x2, y2]}"` |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="eq_onValue">onValue<a class="headerlink" href="#eq_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |

??? api "<div id="visualizer">visualizer<a class="headerlink" href="#visualizer" title="Permanent link">#</a></div>"
    Display its value over time.

    === "widget"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="visualizer_interaction">interaction<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#visualizer_interaction" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `false` to disable pointer interactions. |

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="visualizer_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#visualizer_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="visualizer_pips">pips<a class="headerlink" href="#visualizer_pips" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to hide the scale |

    === "visualizer"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="visualizer_rangeX">rangeX<a class="headerlink" href="#visualizer_rangeX" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the x axis |
            | <h6 id="visualizer_rangeY">rangeY<a class="headerlink" href="#visualizer_rangeY" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the y axis |
            | <h6 id="visualizer_logScaleX">logScaleX<a class="headerlink" href="#visualizer_logScaleX" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the x axis. Set to `-1` for exponential scale. |
            | <h6 id="visualizer_logScaleY">logScaleY<a class="headerlink" href="#visualizer_logScaleY" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the y axis (base 10). Set to a `number` to define the logarithm's base. |
            | <h6 id="visualizer_origin">origin<a class="headerlink" href="#visualizer_origin" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Defines the y axis origin. Set to `false` to disable it |
            | <h6 id="visualizer_duration">duration<a class="headerlink" href="#visualizer_duration" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines visualization duration in seconds |
            | <h6 id="visualizer_framerate">framerate<a class="headerlink" href="#visualizer_framerate" title="Permanent link">#</a></h6> | `number` | <code>30</code> | Defines visualization framerate |
            | <h6 id="visualizer_freeze">freeze<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#visualizer_freeze" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to freeze current view and ignore incoming values |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="visualizer_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#visualizer_value" title="Permanent link">#</a></h6> | `array`&vert;<br/>`string` | <code>""</code> | - `Array` of `y` values: `[y1, y2, ...]`<br/>- `Array` of `[x, y]` `array` values: `[[x1 , y1], [x2, y2], ...]`<br/>- `String` `array`: `"[y1, y2, ...]"` or `"[[x1 , y1], [x2, y2], ...]"`<br/>- `String` `object` to update specific coordinates only: `"{0: y1, 1: y2}"` or `"{0: [x1, y1], 1: [x2, y2]}"` |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="visualizer_onValue">onValue<a class="headerlink" href="#visualizer_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |
## Indicators

??? api "<div id="led">led<a class="headerlink" href="#led" title="Permanent link">#</a></div>"
    Intensity display.

    === "widget"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="led_interaction">interaction<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#led_interaction" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `false` to disable pointer interactions. |

    === "led"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="led_mode">mode<a class="headerlink" href="#led_mode" title="Permanent link">#</a></h6> | `string` | <code>"intensity"</code> | Defines how value is interpreted (see `value`)<br/><br/>Choices: `intensity`, `color` |
            | <h6 id="led_range">range<a class="headerlink" href="#led_range" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Value range |
            | <h6 id="led_alphaRange">alphaRange<a class="headerlink" href="#led_alphaRange" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Alpha range (if `mode` is `color`) |
            | <h6 id="led_logScale">logScale<a class="headerlink" href="#led_logScale" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | If `mode` is `intensity`, set to `true` to use logarithmic scale. |

    === "value"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="led_value">value<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#led_value" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>""</code> | If `mode` is `intensity`:<br/>- `Number`: `intensity` between `range.min` and `range.max`<br/><br/>If `mode` is `color`:<br/>- `Array`: `[r, g, b]` (`r`, `g` and `b` between `range.min` and `range.max`)<br/>- `Array`: `[r, g, b, alpha]` (`alpha` between `alphaRange.min` and `alphaRange.max`)<br/>- `String`: CSS color |

??? api "<div id="text">text<a class="headerlink" href="#text" title="Permanent link">#</a></div>"
    Display text.

    === "widget"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="text_interaction">interaction<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#text_interaction" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `false` to disable pointer interactions. |

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="text_vertical">vertical<a class="headerlink" href="#text_vertical" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to display the text vertically |
            | <h6 id="text_wrap">wrap<a class="headerlink" href="#text_wrap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to wrap long lines automatically. Set to `soft` to avoid breaking words.<br/><br/>Choices: `false`, `true`, `soft` |
            | <h6 id="text_align">align<a class="headerlink" href="#text_align" title="Permanent link">#</a></h6> | `string` | <code>"center"</code> | Text alignment.<br/><br/>Choices: `center`, `left`, `right`, `top`, `bottom`, `left top`, `left bottom`, `right top`, `right bottom` |
## Pads

??? api "<div id="xy">xy<a class="headerlink" href="#xy" title="Permanent link">#</a></div>"
    Two-dimensional slider.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="xy_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#xy_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="xy_pointSize">pointSize<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#xy_pointSize" title="Permanent link">#</a></h6> | `integer` | <code>20</code> | Defines the points' size (may be in %) |
            | <h6 id="xy_ephemeral">ephemeral<a class="headerlink" href="#xy_ephemeral" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the point will be drawn only while touched. |
            | <h6 id="xy_pips">pips<a class="headerlink" href="#xy_pips" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to hide the scale |
            | <h6 id="xy_label">label<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#xy_label" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Text displayed in the handle |

    === "xy"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="xy_snap">snap<a class="headerlink" href="#xy_snap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | By default, the points are dragged from their initial position.<br/><br/>If set to `true`, touching anywhere on the widget's surface will make them snap to the touching coordinates |
            | <h6 id="xy_spring">spring<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#xy_spring" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the widget will go back to its default value when released |
            | <h6 id="xy_rangeX">rangeX<a class="headerlink" href="#xy_rangeX" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the x axis (see fader) |
            | <h6 id="xy_rangeY">rangeY<a class="headerlink" href="#xy_rangeY" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the y axis (see fader) |
            | <h6 id="xy_logScaleX">logScaleX<a class="headerlink" href="#xy_logScaleX" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the x axis. Set to `-1` for exponential scale. |
            | <h6 id="xy_logScaleY">logScaleY<a class="headerlink" href="#xy_logScaleY" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the y axis. Set to `-1` for exponential scale. |
            | <h6 id="xy_stepsX">stepsX<a class="headerlink" href="#xy_stepsX" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>false</code> | Defines `steps` for the x axis (see fader) |
            | <h6 id="xy_stepsY">stepsY<a class="headerlink" href="#xy_stepsY" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>false</code> | Defines `steps` for the x axis (see fader) |
            | <h6 id="xy_axisLock">axisLock<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#xy_axisLock" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Restrict movements to one of the axes only unless `Shift` is held.<br/><br/>When left empty, holding `Shift` while dragging will lock the pad according the first movement. `auto` will do the opposite.<br/><br/>Choices: ``, `x`, `y`, `auto` |
            | <h6 id="xy_doubleTap">doubleTap<a class="headerlink" href="#xy_doubleTap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to make the knob reset to its `default` value when receiving a double tap.<br/><br/>Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).<br/><br/>If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. <br/><br/>Choices: `false`, `true`, `script` |
            | <h6 id="xy_sensitivity">sensitivity<a class="headerlink" href="#xy_sensitivity" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines the pad's sensitivity when `snap` is `false`  |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="xy_onValue">onValue<a class="headerlink" href="#xy_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |
            | <h6 id="xy_onTouch">onTouch<a class="headerlink" href="#xy_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

??? api "<div id="rgb">rgb<a class="headerlink" href="#rgb" title="Permanent link">#</a></div>"
    Color picker with optional alpha slider.

    === "rgb"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="rgb_snap">snap<a class="headerlink" href="#rgb_snap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | By default, the points are dragged from their initial position.<br/><br/>If set to `true`, touching anywhere on the widget's surface will make them snap to the touching coordinates |
            | <h6 id="rgb_spring">spring<a class="headerlink" href="#rgb_spring" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the widget will go back to its default value when released |
            | <h6 id="rgb_range">range<a class="headerlink" href="#rgb_range" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 255<br/>}</code> | Defines the widget's output scale. |
            | <h6 id="rgb_alpha">alpha<a class="headerlink" href="#rgb_alpha" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to enable alpha channel |
            | <h6 id="rgb_rangeAlpha">rangeAlpha<a class="headerlink" href="#rgb_rangeAlpha" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the widget's output scale for the alpha channel. |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="rgb_onTouch">onTouch<a class="headerlink" href="#rgb_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

??? api "<div id="multixy">multixy<a class="headerlink" href="#multixy" title="Permanent link">#</a></div>"
    Multi-point XY pad.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="multixy_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#multixy_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="multixy_pointSize">pointSize<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#multixy_pointSize" title="Permanent link">#</a></h6> | `integer` | <code>20</code> | Defines the points' default size (may be in %) |
            | <h6 id="multixy_ephemeral">ephemeral<a class="headerlink" href="#multixy_ephemeral" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the points will be drawn only while touched. |
            | <h6 id="multixy_pips">pips<a class="headerlink" href="#multixy_pips" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to hide the scale |

    === "multixy"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="multixy_points">points<a class="headerlink" href="#multixy_points" title="Permanent link">#</a></h6> | `integer`&vert;<br/>`array` | <code>2</code> | Defines the number of points on the pad<br/><br/>Can be an array of strings that will be used as labels for the points (ex: `['A', 'B']`) |
            | <h6 id="multixy_pointsAttr">pointsAttr<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#multixy_pointsAttr" title="Permanent link">#</a></h6> | `object` | <code>[]</code> | Defines per-point properties that are otherwise inherited from the multixy. Must be an array of objects (one per point) that may contain the following keys:<br/>- visible (visibility and interactability)<br/>- colorFill (background color)<br/>- colorStroke (outline color)<br/>- colorText (label color)<br/>- color (shorthand for colorFill and colorStroke)<br/>- alphaFillOn (background opacity)<br/>- pointSize<br/>- label |
            | <h6 id="multixy_snap">snap<a class="headerlink" href="#multixy_snap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | By default, the points are dragged from their initial position.<br/><br/>If set to `true`, touching anywhere on the widget's surface will make them snap to the touching coordinates |
            | <h6 id="multixy_spring">spring<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#multixy_spring" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the widget will go back to its default value when released |
            | <h6 id="multixy_rangeX">rangeX<a class="headerlink" href="#multixy_rangeX" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the x axis (see fader) |
            | <h6 id="multixy_rangeY">rangeY<a class="headerlink" href="#multixy_rangeY" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the min and max values for the y axis (see fader) |
            | <h6 id="multixy_logScaleX">logScaleX<a class="headerlink" href="#multixy_logScaleX" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the x axis. Set to `-1` for exponential scale. |
            | <h6 id="multixy_logScaleY">logScaleY<a class="headerlink" href="#multixy_logScaleY" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale for the y axis. Set to `-1` for exponential scale. |
            | <h6 id="multixy_stepsX">stepsX<a class="headerlink" href="#multixy_stepsX" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>false</code> | Defines `steps` for the x axis (see fader) |
            | <h6 id="multixy_stepsY">stepsY<a class="headerlink" href="#multixy_stepsY" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>false</code> | Defines `steps` for the x axis (see fader) |
            | <h6 id="multixy_axisLock">axisLock<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#multixy_axisLock" title="Permanent link">#</a></h6> | `string` | <code>""</code> | Restrict movements to one of the axes only.<br/><br/>When left empty, holding `Shift` while dragging will lock the pad according the first movement. `auto` will do the opposite.<br/><br/>Choices: ``, `x`, `y`, `auto` |
            | <h6 id="multixy_doubleTap">doubleTap<a class="headerlink" href="#multixy_doubleTap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to make the knob reset to its `default` value when receiving a double tap.<br/><br/>Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).<br/><br/>If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. <br/><br/>Choices: `false`, `true`, `script` |
            | <h6 id="multixy_sensitivity">sensitivity<a class="headerlink" href="#multixy_sensitivity" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines the pad's sensitivity when `snap` is `false`  |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="multixy_onValue">onValue<a class="headerlink" href="#multixy_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |
            | <h6 id="multixy_onTouch">onTouch<a class="headerlink" href="#multixy_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

??? api "<div id="canvas">canvas<a class="headerlink" href="#canvas" title="Permanent link">#</a></div>"
    Multitouch canvas widget with user-defined drawing functions and touch reactions.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="canvas_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#canvas_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |

    === "canvas"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="canvas_valueLength">valueLength<a class="headerlink" href="#canvas_valueLength" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines the number of values accepted by the widget (minimum 1). Incoming messages that don't comply will be ignored<br/><br/>When calling `set()` from a script, submitted value should be an array only if `valueLength` is greater than 1. |
            | <h6 id="canvas_autoClear">autoClear<a class="headerlink" href="#canvas_autoClear" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | If set to `false`, the canvas context won't be cleared automatically and `ctx.clearRect()` will need to be called in `onDraw`. |
            | <h6 id="canvas_continuous">continuous<a class="headerlink" href="#canvas_continuous" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | If set to `true`, `onDraw` will be called at each frame, otherwise it will be called only when the widget is touched and when it receives a value.<br/><br/>Can be a number between 1 and 60 to specify the framerate (default: 30 fps). |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="canvas_onCreate">onCreate<a class="headerlink" href="#canvas_onCreate" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
            | <h6 id="canvas_onValue">onValue<a class="headerlink" href="#canvas_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed whenever the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
            | <h6 id="canvas_onTouch">onTouch<a class="headerlink" href="#canvas_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released, and when the pointer moves when the widget is touched. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |
            | <h6 id="canvas_onDraw">onDraw<a class="headerlink" href="#canvas_onDraw" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is redrawn. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |
            | <h6 id="canvas_onResize">onResize<a class="headerlink" href="#canvas_onResize" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is resized. See <a href="https://openstagecontrol.ammd.net/docs/widgets/canvas/">documentation</a>. |
## Sliders

??? api "<div id="fader">fader<a class="headerlink" href="#fader" title="Permanent link">#</a></div>"
    Vertical / horizontal slider.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="fader_borderRadius">borderRadius<a class="headerlink" href="#fader_borderRadius" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Border radius expressed as a number (same for all corners, applies only for compact design). |
            | <h6 id="fader_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fader_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="fader_design">design<a class="headerlink" href="#fader_design" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Design style<br/><br/>Choices: `default`, `round`, `compact` |
            | <h6 id="fader_knobSize">knobSize<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fader_knobSize" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Fader knob size |
            | <h6 id="fader_colorKnob">colorKnob<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fader_colorKnob" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Fader knob color |
            | <h6 id="fader_horizontal">horizontal<a class="headerlink" href="#fader_horizontal" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to display the fader horizontally |
            | <h6 id="fader_pips">pips<a class="headerlink" href="#fader_pips" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to show range breakpoints (ignored if `design` is `compact`) |
            | <h6 id="fader_dashed">dashed<a class="headerlink" href="#fader_dashed" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`array` | <code>false</code> | Set to `true` to display a dashed gauge. Can be set as an `array` of two numbers : `[dash_size, gap_size]` |
            | <h6 id="fader_gradient">gradient<a class="headerlink" href="#fader_gradient" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>[]</code> | When set, the meter's gauge will be filled with a linear color gradient<br/>- each item must be a CSS color string.<br/>- as an `object`: each key must be a number between 0 and 1<br/>- each item must be a CSS color string.<br/><br/>Examples: `['blue', 'red']`, {'0': 'blue', '0.9': 'blue', '1': 'red'}  |

    === "fader"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="fader_snap">snap<a class="headerlink" href="#fader_snap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | By default, dragging the widget will modify it's value starting from its last value. Setting this to `true` will make it snap directly to the mouse/touch position |
            | <h6 id="fader_touchZone">touchZone<a class="headerlink" href="#fader_touchZone" title="Permanent link">#</a></h6> | `string` | <code>"all"</code> | Restrict interaction to a part of the widget:<br/>- `all`: touching the widget anywhere will start an interaction<br/>- `knob`: touching the knob will start an interaction<br/>- `gauge`: touching anywhere in the knob's moving range will start an interaction<br/><br/>This setting is ignored in containers with `traversing` set to `true`<br/><br/>Choices: `all`, `knob`, `gauge` |
            | <h6 id="fader_spring">spring<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fader_spring" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the widget will go back to its `default` value when released |
            | <h6 id="fader_doubleTap">doubleTap<a class="headerlink" href="#fader_doubleTap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to make the knob reset to its `default` value when receiving a double tap.<br/><br/>Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).<br/><br/>If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. <br/><br/>Choices: `false`, `true`, `script` |
            | <h6 id="fader_range">range<a class="headerlink" href="#fader_range" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the breakpoints of the fader's scale:<br/>- keys can be percentages and/or `min` / `max`<br/>- values can be `number` or `object` if a custom label is needed<br/><br/>Example: (`{min:{"-inf": 0}, "50%": 0.25, max: {"+inf": 1}}`) |
            | <h6 id="fader_logScale">logScale<a class="headerlink" href="#fader_logScale" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale. Set to `-1` for exponential scale. |
            | <h6 id="fader_sensitivity">sensitivity<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fader_sensitivity" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines the fader's sensitivity when `snap` is `false`  |
            | <h6 id="fader_steps">steps<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#fader_steps" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>""</code> | Restricts the widget's value:<br/>- `number`: define a number of evenly spaced steps<br/>- `array` of numbers: use arbitrary values as steps<br/>- `auto`: use values defined in `range` |
            | <h6 id="fader_origin">origin<a class="headerlink" href="#fader_origin" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Defines the starting point's value of the fader's gauge |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="fader_onValue">onValue<a class="headerlink" href="#fader_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |
            | <h6 id="fader_onTouch">onTouch<a class="headerlink" href="#fader_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

??? api "<div id="knob">knob<a class="headerlink" href="#knob" title="Permanent link">#</a></div>"
    Rotative knob slider.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="knob_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#knob_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="knob_design">design<a class="headerlink" href="#knob_design" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Design style<br/><br/>Note: "solid" design uses "colorStroke" for the central knob color.<br/><br/>Choices: `default`, `solid`, `line` |
            | <h6 id="knob_colorKnob">colorKnob<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#knob_colorKnob" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Knob color |
            | <h6 id="knob_pips">pips<a class="headerlink" href="#knob_pips" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to show the scale's breakpoints |
            | <h6 id="knob_dashed">dashed<a class="headerlink" href="#knob_dashed" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`array` | <code>false</code> | Set to `true` to display a dashed gauge. Can be set as an `array` of two numbers : `[dash_size, gap_size]` |
            | <h6 id="knob_angle">angle<a class="headerlink" href="#knob_angle" title="Permanent link">#</a></h6> | `number` | <code>270</code> | Defines the angle's width of the knob, in degrees |

    === "knob"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="knob_mode">mode<a class="headerlink" href="#knob_mode" title="Permanent link">#</a></h6> | `string` | <code>"vertical"</code> | - `vertical`: relative move in vertical motion<br/>- `circular`: relative move in circular motion<br/>- `snap`: snap to touch position<br/>- `snap-alt`: alternative snap mode that allow jumping from `range.min` to `range.max`. `sensitivity` is ignored with this mode.<br/><br/>Choices: `vertical`, `circular`, `snap`, `snap-alt` |
            | <h6 id="knob_spring">spring<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#knob_spring" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the widget will go back to its `default` value when released |
            | <h6 id="knob_doubleTap">doubleTap<a class="headerlink" href="#knob_doubleTap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to make the knob reset to its `default` value when receiving a double tap.<br/><br/>Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).<br/><br/>If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. <br/><br/>Choices: `false`, `true`, `script` |
            | <h6 id="knob_range">range<a class="headerlink" href="#knob_range" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the breakpoints of the fader's scale:<br/>- keys can be percentages and/or `min` / `max`<br/>- values can be `number` or `object` if a custom label is needed<br/><br/>Example: (`{min:{"-inf": 0}, "50%": 0.25, max: {"+inf": 1}}`) |
            | <h6 id="knob_logScale">logScale<a class="headerlink" href="#knob_logScale" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale. Set to `-1` for exponential scale. |
            | <h6 id="knob_sensitivity">sensitivity<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#knob_sensitivity" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines the knob's sensitivity when `mode` is not `snap`  |
            | <h6 id="knob_steps">steps<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#knob_steps" title="Permanent link">#</a></h6> | `string`&vert;<br/>`number`&vert;<br/>`array` | <code>""</code> | Restricts the widget's value:<br/>- `number`: define a number of evenly spaced steps<br/>- `array` of numbers: use arbitrary values as steps<br/>- `auto`: use values defined in `range` |
            | <h6 id="knob_origin">origin<a class="headerlink" href="#knob_origin" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Defines the starting point's value of the knob's gauge |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="knob_onValue">onValue<a class="headerlink" href="#knob_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |
            | <h6 id="knob_onTouch">onTouch<a class="headerlink" href="#knob_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

??? api "<div id="encoder">encoder<a class="headerlink" href="#encoder" title="Permanent link">#</a></div>"
    A knob that sends a relative direction information instead of an absolute value.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="encoder_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#encoder_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |

    === "encoder"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="encoder_mode">mode<a class="headerlink" href="#encoder_mode" title="Permanent link">#</a></h6> | `string` | <code>"circular"</code> | - `circular`: relative move in circular motion<br/>- `snap`: snap to touch position and move in vertical motion<br/>- `vertical`: relative move in vertical motion<br/><br/>Choices: `circular`, `snap`, `vertical` |
            | <h6 id="encoder_doubleTap">doubleTap<a class="headerlink" href="#encoder_doubleTap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to make the fader reset to its `default` value when receiving a double tap.<br/><br/>Can also be an osc address, in which case the widget will just send an osc message (`/<doubleTap> <preArgs>`)<br/><br/>Choices: `false`, `true`, `script` |
            | <h6 id="encoder_range">range<a class="headerlink" href="#encoder_range" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the breakpoints of the fader's scale:<br/>- keys can be percentages and/or `min` / `max`<br/>- values can be `number` or `object` if a custom label is needed<br/><br/>Example: (`{min:{"-inf": 0}, "50%": 0.25, max: {"+inf": 1}}`) |
            | <h6 id="encoder_logScale">logScale<a class="headerlink" href="#encoder_logScale" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale. Set to `-1` for exponential scale. |
            | <h6 id="encoder_sensitivity">sensitivity<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#encoder_sensitivity" title="Permanent link">#</a></h6> | `number` | <code>1</code> | When set between 0 and 1, reduces the encoder's verbosity |
            | <h6 id="encoder_ticks">ticks<a class="headerlink" href="#encoder_ticks" title="Permanent link">#</a></h6> | `number` | <code>""</code> | Defines the granularity / verbosity of the encoder (number of step for a 360° arc) |
            | <h6 id="encoder_back">back<a class="headerlink" href="#encoder_back" title="Permanent link">#</a></h6> | `*` | <code>-1</code> | Defines which value is sent when rotating the encoder anticlockwise |
            | <h6 id="encoder_forth">forth<a class="headerlink" href="#encoder_forth" title="Permanent link">#</a></h6> | `*` | <code>1</code> | Defines which value is sent when rotating the encoder clockwise |
            | <h6 id="encoder_release">release<a class="headerlink" href="#encoder_release" title="Permanent link">#</a></h6> | `number` | <code>""</code> | Defines which value is sent when releasing the encoder:<br/>- Set to `null` to send send no argument in the osc message<br/>- Can be an `object` if the type needs to be specified |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="encoder_onValue">onValue<a class="headerlink" href="#encoder_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height`<br/><br/>Additional variables:<br/>- `locals.speed`: encoder's speed (reduce `sensitivity` to increase averaging)<br/>- `locals.angle`: encoder's angle in degrees |
            | <h6 id="encoder_onTouch">onTouch<a class="headerlink" href="#encoder_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |

??? api "<div id="range">range<a class="headerlink" href="#range" title="Permanent link">#</a></div>"
    A fader with two heads for setting a range.

    === "style"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="range_borderRadius">borderRadius<a class="headerlink" href="#range_borderRadius" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Border radius expressed as a number (same for all corners, applies only for compact design). |
            | <h6 id="range_css">css<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#range_css" title="Permanent link">#</a></h6> | `string` | <code>""</code> | CSS rules. See <a href="https://openstagecontrol.ammd.net/docs/customization/css-tips/">documentation</a>.<br/><br/>Some style-related properties can be set or read from css using css variables:<br/>- `--color-background`: `colorBg`<br/>- `--color-widget`: `colorWidget`<br/>- `--color-fill`: `colorFill`<br/>- `--color-stroke`: `colorStroke`<br/>- `--color-text`: `colorText`<br/>- `--widget-padding`: `padding`<br/>- `--line-width`: `lineWidth`<br/>- `--border-radius`: `borderRadius`<br/>- `--alpha-fill-on`: `alphaFillOn`<br/>- `--alpha-fill-off`: `alphaFillOff`<br/>- `--alpha-stroke`: `alphaStroke`<br/>- `--alpha-pips`: `alphaPips`<br/>- `--alpha-pips-text`: `alphaPipsText`<br/><br/>Canvas-based widget have their computed width and height available as css variables (read-only):<br/>- `--widget-width`<br/>- `--widget-height` |
            | <h6 id="range_design">design<a class="headerlink" href="#range_design" title="Permanent link">#</a></h6> | `string` | <code>"default"</code> | Design style<br/><br/>Choices: `default`, `round`, `compact` |
            | <h6 id="range_knobSize">knobSize<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#range_knobSize" title="Permanent link">#</a></h6> | `number` | <code>"auto"</code> | Fader knob size |
            | <h6 id="range_colorKnob">colorKnob<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#range_colorKnob" title="Permanent link">#</a></h6> | `string` | <code>"auto"</code> | Fader knob color |
            | <h6 id="range_horizontal">horizontal<a class="headerlink" href="#range_horizontal" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to display the fader horizontally |
            | <h6 id="range_pips">pips<a class="headerlink" href="#range_pips" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | Set to `true` to show range breakpoints (ignored if `design` is `compact`) |
            | <h6 id="range_dashed">dashed<a class="headerlink" href="#range_dashed" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`array` | <code>false</code> | Set to `true` to display a dashed gauge. Can be set as an `array` of two numbers : `[dash_size, gap_size]` |
            | <h6 id="range_gradient">gradient<a class="headerlink" href="#range_gradient" title="Permanent link">#</a></h6> | `array`&vert;<br/>`object` | <code>[]</code> | When set, the meter's gauge will be filled with a linear color gradient<br/>- each item must be a CSS color string.<br/>- as an `object`: each key must be a number between 0 and 1<br/>- each item must be a CSS color string.<br/><br/>Examples: `['blue', 'red']`, {'0': 'blue', '0.9': 'blue', '1': 'red'}  |

    === "range"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="range_snap">snap<a class="headerlink" href="#range_snap" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | By default, dragging the widget will modify it's value starting from its last value. Setting this to `true` will make it snap directly to the mouse/touch position |
            | <h6 id="range_touchZone">touchZone<a class="headerlink" href="#range_touchZone" title="Permanent link">#</a></h6> | `string` | <code>"all"</code> | Restrict interaction to a part of the widget:<br/>- `all`: touching the widget anywhere will start an interaction<br/>- `knob`: touching the knob will start an interaction<br/>- `gauge`: touching anywhere in the knob's moving range will start an interaction<br/><br/>This setting is ignored in containers with `traversing` set to `true`<br/><br/>Choices: `all`, `knob`, `gauge` |
            | <h6 id="range_spring">spring<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#range_spring" title="Permanent link">#</a></h6> | `boolean` | <code>false</code> | When set to `true`, the widget will go back to its `default` value when released |
            | <h6 id="range_doubleTap">doubleTap<a class="headerlink" href="#range_doubleTap" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`string` | <code>false</code> | Set to `true` to make the knob reset to its `default` value when receiving a double tap.<br/><br/>Can be an osc address, in which case the widget will just send an osc message with no value (but `preArgs` included).<br/><br/>If set to "script", `onTouch` will be called with `event.type` set to `doubleTap`. <br/><br/>Choices: `false`, `true`, `script` |
            | <h6 id="range_range">range<a class="headerlink" href="#range_range" title="Permanent link">#</a></h6> | `object` | <code>\{<br/>&nbsp;"min": 0,<br/>&nbsp;"max": 1<br/>}</code> | Defines the breakpoints of the fader's scale:<br/>- keys can be percentages and/or `min` / `max`<br/>- values can be `number` or `object` if a custom label is needed<br/><br/>Example: (`{min:{"-inf": 0}, "50%": 0.25, max: {"+inf": 1}}`) |
            | <h6 id="range_logScale">logScale<a class="headerlink" href="#range_logScale" title="Permanent link">#</a></h6> | `boolean`&vert;<br/>`number` | <code>false</code> | Set to `true` to use logarithmic scale. Set to `-1` for exponential scale. |
            | <h6 id="range_sensitivity">sensitivity<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#range_sensitivity" title="Permanent link">#</a></h6> | `number` | <code>1</code> | Defines the fader's sensitivity when `snap` is `false`  |
            | <h6 id="range_steps">steps<sup><i class="fas fa-bolt" title="dynamic"></i></sup><a class="headerlink" href="#range_steps" title="Permanent link">#</a></h6> | `number`&vert;<br/>`array`&vert;<br/>`string` | <code>""</code> | Restricts the widget's value:<br/>- `number`: define a number of evenly spaced steps<br/>- `array` of numbers: use arbitrary values as steps<br/>- `auto`: use values defined in `range` |

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="range_onValue">onValue<a class="headerlink" href="#range_onValue" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget's value updates. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.<br/><br/>Canvas-based widget have their computed width and height available as local variables:<br/>- `locals.width`<br/>- `locals.height` |
            | <h6 id="range_onTouch">onTouch<a class="headerlink" href="#range_onTouch" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is touched and released. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
## Scripts

??? api "<div id="script">script<a class="headerlink" href="#script" title="Permanent link">#</a></div>"
    Scripting widget utility with keyboard bindings

    === "scripting"

        | property | type |default | description |
        | --- | --- | --- | --- |
            | <h6 id="script_onCreate">onCreate<a class="headerlink" href="#script_onCreate" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed when the widget is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
            | <h6 id="script_onKeyboard">onKeyboard<a class="headerlink" href="#script_onKeyboard" title="Permanent link">#</a></h6> | `script` | <code>""</code> | Script executed whenever the widget receives a keyboard event if `keyBinding` is set). See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>. |
            | <h6 id="script_keyBinding">keyBinding<a class="headerlink" href="#script_keyBinding" title="Permanent link">#</a></h6> | `string`&vert;<br/>`array` | <code>""</code> | Key combo `string` or `array` of strings (see <a href="https://github.com/RobertWHurst/KeyboardJS">KeyboardJS</a> documentation).<br/><br/>If the editor is enabled, some keys / combos will not work.<br/><br/>To process all keystroke events, write `['']` |
            | <h6 id="script_keyRepeat">keyRepeat<a class="headerlink" href="#script_keyRepeat" title="Permanent link">#</a></h6> | `boolean` | <code>true</code> | Set to `false` to prevent keydown repeats when holding the key combo pressed |
            | <h6 id="script_keyType">keyType<a class="headerlink" href="#script_keyType" title="Permanent link">#</a></h6> | `string` | <code>"keydown"</code> | Determines which key event trigger the script's execution<br/><br/>Choices: `keydown`, `keyup`, `both` |

??? api "<div id="variable">variable<a class="headerlink" href="#variable" title="Permanent link">#</a></div>"
    Receives / stores a value, to be used in scripts (using the get function) or in properties (using the @{} syntax).
