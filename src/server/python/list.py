from head import *

def list():

    message = []

    message.append('(INFO, MIDI) Inputs')
    message.append('    -1: Void (bypass)')

    for i in range(in_dev.get_port_count()):
        message.append('    %i: %s' % (i, in_dev.get_port_name(i)))

    message.append('(INFO, MIDI) Outputs')
    message.append('    -1: Void (bypass)')

    for i in range(out_dev.get_port_count()):
        message.append('    %i: %s' % (i, out_dev.get_port_name(i)))

    ipc_send('log', '\n'.join(message))


if __name__ == '__main__':

    list()
