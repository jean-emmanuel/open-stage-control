from head import *
from list import *
from utils import *
from mtc import *
from rpn import *

argv = argv[argv.index('--params') + 1:]

if list_midi or list_midi_exit:
    list()
    if list_midi_exit:
        exit()

inputs = {}
outputs = {}

for arg in argv:

    if type(arg) == str and ':' in arg:

        name, *ports = arg.split(':')
        ports = ':'.join(ports) # port names may contain colons

        inputs[name] = rtmidi.MidiIn(API, name if not JACK else name + '_in')
        outputs[name] = rtmidi.MidiOut(API, name if not JACK else name + '_out')

        if debug:
            ipc_send('debug','device "%s" created' % name)


        if ports == 'virtual':

            try:

                if platform == 'darwin':
                    inputs[name].open_virtual_port('%s-in' % name)
                    outputs[name].open_virtual_port('%s-out' % name)
                else:
                    inputs[name].open_virtual_port('midi_in')
                    outputs[name].open_virtual_port('midi_out')

                if debug:
                    ipc_send('debug','virtual ports opened for device "%s"' % name)
            except:
                ipc_send('error', 'failed to open virtual ports for device "%s"' % name)
                ipc_send('error', traceback.format_exc())
                inputs[name] = None
                outputs[name] = None

        elif ',' in ports:

            in_port, out_port = ports.split(',')

            if in_port.isdigit() or in_port == '-1':
                in_port = int(in_port)
            else:
                for i in range(in_dev.get_port_count()):
                    if in_port.lower() in in_dev.get_port_name(i).lower():
                        in_port = i
                        break

            if out_port.isdigit() or out_port == '-1':
                out_port = int(out_port)
            else:
                for i in range(out_dev.get_port_count()):
                    if out_port.lower() in out_dev.get_port_name(i).lower():
                        out_port = i
                        break

            if in_port != -1:

                try:
                    inputs[name].open_port(in_port, 'midi_in')
                    if debug:
                        ipc_send('debug','device "%s" connected to input port %s (%s)' % (name, in_port, in_dev.get_port_name(in_port)))
                except:
                    if type(in_port) != int or in_port >= in_dev.get_port_count():
                        ipc_send('error', 'can\'t connect "%s" to input port "%s" (port not in list)' % (name, in_port))
                    else:
                        ipc_send('error', 'failed to connect "%s" to input port %s' % (name, in_port))
                        ipc_send('error', traceback.format_exc())
                    inputs[name] = None

            if out_port != -1:

                try:
                    outputs[name].open_port(out_port, 'midi_out')
                    if debug:
                        ipc_send('debug','device "%s" connected to output port %s (%s)' % (name, out_port, out_dev.get_port_name(out_port)))
                except:
                    if type(out_port) != int or out_port >= out_dev.get_port_count():
                        ipc_send('error', 'can\'t connect "%s" to output port "%s" (port not in list)' % (name, out_port))
                    else:
                        ipc_send('error', 'failed to connect "%s" to output port %s' % (name, out_port))
                        ipc_send('error', traceback.format_exc())
                    outputs[name] = None


def create_callback(name):

    def receive_midi(event, data):

        osc = {}
        osc['args'] = []
        osc['host'] = 'midi'
        osc['port'] = name

        message, deltatime = event
        mtype = message[0] & 0xF0

        if mtype in MIDI_TO_OSC:

            osc['address'] = MIDI_TO_OSC[mtype]

            if not ignore_mtc and is_mtc(message):

                mtc = mtc_decode(message, name)
                if mtc == None:
                    return
                else:
                    osc['address'] = MIDI_TO_OSC[MIDI_TIME_CODE]
                    osc['args'].append({'type': 'string', 'value': mtc})

            elif mtype == SYSTEM_EXCLUSIVE:
                # Parse the provided data into a hex MIDI data string of the form  'f0 7e 7f 06 01 f7'.
                v = ' '.join([hex(x).replace('0x', '').zfill(2) for x in message])
                osc['args'].append({'type': 'string', 'value': v})


            elif mtype == CONTROL_CHANGE and not ignore_rpn and is_rpn(message):
                rpn = rpn_decode(message, name)
                if rpn is not None:
                    osc['address'] = MIDI_TO_OSC[rpn[0]]
                    osc['args'].append({'type': 'i', 'value': rpn[1]})
                    osc['args'].append({'type': 'i', 'value': rpn[2]})
                    osc['args'].append({'type': 'i', 'value': rpn[3]})
                    ipc_send('osc', osc)
                    if debug:
                        t = 'NRPN' if rpn[0] == NRPN else 'RPN'
                        s = '%s: channel=%i, parameter=%i, value=%i'% (t, rpn[1], rpn[2], rpn[3])
                        ipc_send('debug','in: %s From: midi:%s' % (s, name))
                # bypass (n)rpn CCs
                return

            else:

                status = message[0]
                channel = (status & 0x0F) + 1

                osc['args'].append({'type': 'i', 'value': channel})

                if mtype == NOTE_OFF:
                    if not note_off_velocity:
                        message[2] = 0

                elif mtype == PITCH_BEND:
                    message = message[:1] + [message[1] + message[2] * 128] # convert  0-127 pair -> 0-16384 ->

                elif mtype == PROGRAM_CHANGE and program_change_offset:
                    message[-1] = message[-1] + 1

                for data in message[1:]:
                    osc['args'].append({'type': 'i', 'value': data})


            if debug:
                ipc_send('debug','in: %s From: midi:%s' % (midi_str(message, name), name))

            ipc_send('osc', osc)



    def callback_error_wrapper(event, data):

        try:
            receive_midi(event, data)
        except:
            ipc_send('error', traceback.format_exc())

    return callback_error_wrapper

for name in inputs:

    if inputs[name] != None:

        inputs[name].set_callback(create_callback(name))

        # sysex / mtc / active sensing support
        inputs[name].ignore_types(ignore_sysex, ignore_mtc, ignore_active_sensing)


def midi_message(status, channel, data1=None, data2=None):

    msg = [(status & 0xF0) | (channel - 1 & 0x0F)]

    if data1 != None:
        msg.append(data1 & 0x7F)

        if data2 != None:
            msg.append(data2 & 0x7F)

    return msg


sysexRegex = re.compile(r'([^0-9A-Fa-f])\1(\1\1)*')

def send_midi(name, event, *args):

    if name not in outputs:
        ipc_send('error','unknown device "%s"' % name)
        return

    if outputs[name] == None:
        ipc_send('error','device "%s" has no opened output port' % name)
        return

    if event not in OSC_TO_MIDI:
        ipc_send('error','invalid address (%s)' % event)
        return

    m = None

    mtype = OSC_TO_MIDI[event]

    if mtype == SYSTEM_EXCLUSIVE or mtype == MIDI_TIME_CODE:

        if mtype == MIDI_TIME_CODE:

            m = mtc_encode(args)

        else:
            try:
                m = []
                for arg in args:
                    if type(arg) is str:
                        arg = arg.replace(' ', '')                          # remove spaces
                        arg = [arg[i:i+2] for i in range(0, len(arg), 2)]   # split in 2 chars bytes
                        arg = [int(x, 16) for x in arg]                     # parse hex bytes
                        for x in arg:
                            m.append(x)
                    else:
                        m.append(int(arg) & 0x7F)

            except:
                pass

    elif mtype == NRPN or mtype == RPN:
        m = rpn_encode(mtype, args)
        if m is not None:
            for x in m:
                outputs[name].send_message(x)
            if debug:
                t = 'NRPN' if mtype == NRPN else 'RPN'
                s = '%s: channel=%i, parameter=%i, value=%i'% (t, args[0], args[1], args[2])
                ipc_send('debug','out: %s To: midi:%s' % (s, name))
            return
    else:

        args = [int(round(x)) for x in args]
        m = [mtype, args[0]]

        if mtype == NOTE_ON:
            if args[2] == 0 and not no_auto_note_off:
                mtype = NOTE_OFF

        elif mtype == PITCH_BEND:
            args = args[:1] + [args[1] & 0x7F, (args[1] >> 7) & 0x7F] # convert 0-16383 -> 0-127 pair

        elif mtype == PROGRAM_CHANGE and program_change_offset:
            args[-1] = args[-1] - 1

        m = midi_message(mtype, *args)

    if m == None:

        ipc_send('error','could not convert osc to midi (%s %s)' % (event, " ".join([str(x) for x in args])))

    else:

        outputs[name].send_message(m)
        if debug:
            ipc_send('debug','out: %s To: midi:%s' % (midi_str(m, name), name))


while True:

    try:
        msg = raw_input()
    except:
        break

    try:
        msg = JSON.loads(msg)
        msg[1] = msg[1].lower()
        send_midi(*msg)
    except:
        ipc_send('error', traceback.format_exc())
