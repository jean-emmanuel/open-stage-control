from head import *
from mtc import *
from rpn import *

MIDI_TO_OSC = {
    NOTE_ON: '/note',
    NOTE_OFF: '/note',
    CONTROL_CHANGE: '/control',
    PROGRAM_CHANGE: '/program',
    PITCH_BEND: '/pitch',
    SYSTEM_EXCLUSIVE: '/sysex',
    MIDI_TIME_CODE: '/mtc',
    CHANNEL_PRESSURE: '/channel_pressure',
    POLY_PRESSURE: '/key_pressure'
}

OSC_TO_MIDI = {
    '/note': NOTE_ON,
    '/note_off': NOTE_OFF,
    '/control': CONTROL_CHANGE,
    '/program': PROGRAM_CHANGE,
    '/pitch': PITCH_BEND,
    '/sysex': SYSTEM_EXCLUSIVE,
    '/mtc': MIDI_TIME_CODE,
    '/channel_pressure': CHANNEL_PRESSURE,
    '/key_pressure': POLY_PRESSURE
}

if note_off_velocity:
    MIDI_TO_OSC[NOTE_OFF] = '/note_off'

if not ignore_rpn:
    MIDI_TO_OSC[NRPN] = '/nrpn'
    MIDI_TO_OSC[RPN] = '/rpn'
    OSC_TO_MIDI['/nrpn'] = NRPN
    OSC_TO_MIDI['/rpn'] = RPN


def midi_str(message, port):

    mtype = message[0] & 0xF0
    s = 'UNKNOWN'


    if is_mtc(message):

        s = 'MTC: timecode=%s' % mtc_decode(message, None)

    elif mtype == SYSTEM_EXCLUSIVE:

        s = 'SYSTEM_EXCLUSIVE: sysex=%s' % ' '.join([hex(x).replace('0x', '').zfill(2) for x in message])

    else:

        status = message[0]
        channel = (status & 0x0F) + 1

        try:

            if mtype == NOTE_ON:
                s = 'NOTE_ON: channel=%i, note=%i, velocity=%i' % (channel, message[1], message[2])
            elif mtype == NOTE_OFF:
                s = 'NOTE_OFF: channel=%i, note=%i, velocity=%i' % (channel, message[1], message[2])
            elif mtype == CONTROL_CHANGE:
                s = 'CONTROL_CHANGE: channel=%i, cc=%i, value=%i'% (channel, message[1], message[2])
            elif mtype == PROGRAM_CHANGE:
                s = 'PROGRAM_CHANGE: channel=%i, program=%i' % (channel, message[1])
            elif mtype == PITCH_BEND:
                s = 'PITCH_BEND: channel=%i, pitch=%i' % (channel, message[1] + message[2] * 128 if len(message) == 3 else message[1])
            elif mtype == CHANNEL_PRESSURE:
                s = 'CHANNEL_PRESSURE: channel=%i, pressure=%i' % (channel, message[1])
            elif mtype == POLY_PRESSURE:
                s = 'KEY_PRESSURE: channel=%i, note=%i, pressure=%i' % (channel, message[1], message[2])

        except IndexError:

            s = 'NONE (ERROR: wrong number of argument for %s)' % MIDI_TO_OSC[mtype]

    return s
