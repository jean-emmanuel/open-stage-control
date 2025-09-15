## Installation


=== "Linux / Windows / OSX"

    Open Stage Control comes bundled with built-in MIDI support if you're using the official package for Linux, OSX or Windows.


=== "Other systems / Node"

    Enabling MIDI support on other systems or when building Open Stage Control from sources requires additional softwares to be installed on the server's system:

    - [python 3](https://www.python.org/downloads/)
    - python package [python-rtmidi](https://spotlightkid.github.io/python-rtmidi/installation.html#from-pypi)


    ??? example "Linux"

        Install `python3-rtmidi` from your distribution's package repository, or if it's not available:

        - Install `python3` and `python3-pip` from your distribution's package repository
        - Run this command in a terminal
        ```bash
        python3 -m pip install python-rtmidi --upgrade
        ```

    ??? example "Mac"

        - Download and install [Python 3 for Mac OS](https://www.python.org/downloads/mac-osx/)
        - Open a terminal
        - Install `pip` (package installer for python) by executing these commands
        ```
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
        python get-pip.py
        ```
        - Install `python-rtmidi` by executing this command
        ```bash
        python -m pip install python-rtmidi --upgrade
        ```

    ??? example "Windows"

        - Download and install [Python 3 for Windows](https://www.python.org/downloads/windows/)
        - **make sure to check the option** "Add Python 3.x to PATH"
        - Open a terminal (++win+r++)
        - Install `pip` (package installer for python) by executing these commands
        ```
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
        python get-pip.py
        ```
        - Install `python-rtmidi` by executing this command
        ```bash
        python -m pip install python-rtmidi --upgrade
        ```

## Configuration

The server's `midi` option accepts the following parameters, separated by spaces.

!!! warning ""
    If an option contains space characters, it must be quoted.

**`list`**

Print the available MIDI ports to the console when the server starts. This action is also available in the launcher's menu.

**`device_name:input,output`**

Create a virtual MIDI device that will translate OSC messages to MIDI messages

- `device_name` is an arbitrary identifier that can be used as a target by widgets (see [Widget setup](#widget-setup)). It doesn't have to match any device's real name.
- `input` / `output` can be port numbers or strings (as reported by the `list` action). If a string is specified, the first port whose name contains the string will be used (comparison is case-insensitive).

**`sysex`**

Enable parsing of system exclusive messages (disabled by default).

**`mtc`**

Enable parsing of midi time code messages (disabled by default).

**`rpn`**

Enable sending and receiving [RPN/NRPN](https://en.wikipedia.org/wiki/NRPN) controls on as single `/rpn` / `/nrpn` messages instead of 3 or 4 control changes that constitute them.


**`active_sensing`**

Enable parsing of midi active sensing messages (disabled by default). Active sensing messages will be received as sysex.

**`pc_offset`**

Send program changes with a `-1` offset to match some software/hardware implementations

**`note_off_velocity`**

Use `/note_on` for noteOn messages and `/note_off` for noteOff messages instead of the defaut `/note` and velocity 0 for note off.

**`auto_note_off`**

Prevent converting outgoing noteOn messages with velocity 0 to noteOff messages.


**`device_name:virtual`** (*Linux / Mac only*): creates a virtual midi device with one input port and one output port


**`jack`** (*Linux only*): use JACK MIDI instead of ALSA. `python-rtmidi` must be compiled with [jack support](https://spotlightkid.github.io/python-rtmidi/installation.html#linux) for this to work.


**`path=/path/to/python`**

*Only use this if you know what you are doing. This option should not be set when using the official Linux / Windows / OSX packages.*

Indicates where to find python binary in case open stage control doesn't (`Error: spawn python3 ENOENT`).


## Widget setup

In order to send MIDI messages, a widget must have at least one `target` formatted as follows:

`midi:device_name` (where `device_name` is one of the declared midi devices)

Its `address` and `preArgs` properties must be set according to Open Stage Control's [midi messages](../midi-messages) specification.

!!! warning
    Messages received from a MIDI port only affect widgets that send to this port.

## Debug

Enabling the server's `debug` options will print some extra information (sent/received midi messages, midi setup information, etc)

## Example configuration

Setting the server's `midi` option as follows:

```
sysex synth:1,2 daw:3,3
```

- enables sysex support (sysex messages will not be ignored)
- creates a midi device "synth" connected with input 1 and output 2
- creates a midi device "daw" connected with input 3 and output 3

If a widget has its `target` set to `midi:synth`, it will receive MIDI from port 1 and send MIDI to port 2.
