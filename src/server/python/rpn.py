from head import *

NRPN = 256
RPN = 257
RPN_REGISTER = {}


def is_rpn(message):

    return (
        message[1] == DATA_ENTRY_MSB or
        message[1] == DATA_ENTRY_LSB or
        message[1] == RPN_MSB or
        message[1] == RPN_LSB or
        message[1] == NRPN_MSB or
        message[1] == NRPN_LSB
    )

def rpn_decode(message, port):
    if port not in RPN_REGISTER:
        RPN_REGISTER[port] = []
        for i in range(16):
            RPN_REGISTER[port].append({
                'type': '',
                'control_msb': -1,
                'control_lsb': -1,
                'value_msb': 0,
                'value_lsb': 0
            })

    status = message[0]
    channel = (status & 0x0F)# + 1
    send = False
    check_reset = False

    if message[1] == NRPN_MSB:
        RPN_REGISTER[port][channel]['type'] = NRPN
        RPN_REGISTER[port][channel]['control_msb'] = message[2]

    elif message[1] == NRPN_LSB:
        RPN_REGISTER[port][channel]['type'] = NRPN
        RPN_REGISTER[port][channel]['control_lsb'] = message[2]
        check_reset = True

    elif message[1] == RPN_MSB:
        RPN_REGISTER[port][channel]['type'] = RPN
        RPN_REGISTER[port][channel]['control_msb'] = message[2]

    elif message[1] == RPN_LSB:
        RPN_REGISTER[port][channel]['type'] = RPN
        RPN_REGISTER[port][channel]['control_lsb'] = message[2]
        check_reset = True

    elif message[1] == DATA_ENTRY_MSB:
        RPN_REGISTER[port][channel]['value_msb'] = message[2]
        RPN_REGISTER[port][channel]['value_lsb'] = 0
        send = True

    elif message[1] == DATA_ENTRY_LSB:
        RPN_REGISTER[port][channel]['value_lsb'] = message[2]
        send = True

    if check_reset:
        # (n)rpn null value
        if (
            RPN_REGISTER[port][channel]['control_msb'] == 127 and
            RPN_REGISTER[port][channel]['control_lsb'] == 127
           ):
           RPN_REGISTER[port][channel]['control_msb'] = -1


    if send and RPN_REGISTER[port][channel]['control_msb'] != -1:
        return [
            RPN_REGISTER[port][channel]['type'],
            channel + 1,
            RPN_REGISTER[port][channel]['control_msb'] * 128 + RPN_REGISTER[port][channel]['control_lsb'],
            RPN_REGISTER[port][channel]['value_msb'] * 128 + RPN_REGISTER[port][channel]['value_lsb']
        ]

    return None


def rpn_encode(mtype, args):

    if len(args) != 3:
        return None

    channel, control, value = args
    status = CONTROL_CHANGE | (channel - 1 & 0x0F)
    return (
        [status, 99 if mtype == NRPN else 101, control >> 7],
        [status, 98 if mtype == NRPN else 100, control & 0x7F],
        [status, 6, value >> 7],
        [status, 38, value & 0x7F]
    )

    # rtmidi doesn't support running status
    # return [
    #     0xF0,0xF7,
    #     CONTROL_CHANGE | (channel - 1 & 0x0F),
    #     99 if mtype == NRPN else 101,
    #     control >> 7,
    #     98 if mtype == NRPN else 100,
    #     control & 0x7F,
    #     6,
    #     value >> 7,
    #     38,
    #     value & 0x7F
    # ]
