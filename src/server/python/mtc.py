from head import *


def is_mtc(message):

    return message[0] == MIDI_TIME_CODE or (message[0] == SYSTEM_EXCLUSIVE and len(message) == 10 and message[1:5] == [0x7F, 0x7F, 0x01, 0x01])


# quarter frame accumulator
mtc = {}

def mtc_decode(message, port):
    # with bits ©jeffmikels @ https://github.com/jeffmikels/timecode_tools/blob/master/tools.py (MIT)
    # TODO: backward playback ?
    if message[0] == MIDI_TIME_CODE:

        if port not in mtc:
            mtc[port] = [0, 0, 0, 0, 0, 0 ,0 ,0]

        piece = (message[1] >> 4) & 0xF
        data = message[1] & 0xF
        mtc[port][piece] = data

        if piece == 7:
            mtc_bytes = [0, 0, 0, 0]
            for i in range(8):

                mtc_index = 3 - i // 2
                if i % 2 == 0:
                    # 'even' pieces came from the low nibble
                    mtc_bytes[mtc_index] += mtc[port][i]
                else:
                    # 'odd' pieces came from the high nibble
                    mtc_bytes[mtc_index] += mtc[port][i] * 16

        else:
            return None

    else:

        mtc_bytes = message[5:-1]


    mtc_bytes[0] = mtc_bytes[0] & 31

    return ":".join([str(x).zfill(2) for x in mtc_bytes])

def mtc_encode(args):

    if len(args) != 1:
        return None

    timecode = args[0]
    data = str(timecode).split(':')

    if len(data) != 4:
        return None
    else:
    	return [0xF0, 0x7F, 0x7F, 0x01, 0x01] + [int(x) & 0x7F for x in data] + [0xF7]
