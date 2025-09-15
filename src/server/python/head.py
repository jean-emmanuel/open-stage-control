from sys import argv, stdin, stdout, version_info, version, exit, platform
from binascii import hexlify, unhexlify
import traceback
import json as JSON
import re

def ipc_send(name, data):
    print(JSON.dumps([name, data]))
    stdout.flush()

prebuilt_bin = 'osc-midi' in argv[0]

try:
    import rtmidi
    from rtmidi.midiconstants import *

    API = rtmidi.API_UNIX_JACK if 'jack' in argv else rtmidi.API_UNSPECIFIED
    if API == rtmidi.API_UNIX_JACK and rtmidi.API_UNIX_JACK not in rtmidi.get_compiled_api():
        API = rtmidi.API_UNSPECIFIED
        ipc_send('log', '(ERROR, MIDI) python-rtmidi was not compiled with jack midi support, falling back to default API')

    JACK = API == rtmidi.API_UNIX_JACK

    in_dev = rtmidi.MidiIn(API, 'MIDI->OSC probe')
    out_dev = rtmidi.MidiOut(API, 'OSC->MIDI probe')

except Exception as e:
    if prebuilt_bin:
        ipc_send('log', '(ERROR, MIDI) error while loading MIDI bridge program:\n              %s' % (e.message if hasattr(e, 'message') else e))
    else:
        ipc_send('log', '(ERROR, MIDI) error while loading python-rtmidi library (running with python %s):\n              %s' % (".".join(map(str, version_info[:3])), e.message if hasattr(e, 'message') else e))
    exit()

if version_info.major == 3:
    raw_input = input

# option: print debug messages
debug = 'debug' in argv
# option: act as if displayed program is between 1-128 instead of 0-127
program_change_offset = 'pc_offset' in argv
# option: parse sysex
ignore_sysex = 'sysex' not in argv
# option: parse mtc
ignore_mtc = 'mtc' not in argv
# option: parse (n)rpn
ignore_rpn = 'rpn' not in argv and 'nrpn' not in argv
# option: parse active sensing
ignore_active_sensing = 'active_sensing' not in argv
# option: note off velocity (/note_on and /note_off instead of only /note and velocity 0 for note off)
note_off_velocity = 'note_off_velocity' in argv
# option: no auto note off (do not translate received note_on with velocity 0 to note off)
no_auto_note_off = 'no_auto_note_off' in argv
# option: list midi ports
list_midi = 'list' in argv
list_midi_exit = 'list-only' in argv
