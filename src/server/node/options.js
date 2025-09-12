import fs from 'fs'

export default {
    's': {alias: 'send', type: 'array', describe: 'default targets for all widgets (ip: port / domain: port / midi: port_name pairs)',
        check: (s)=>{
            return s.some(item=>!item.match(/^[^:]*:[0-9]{4,5}$/) && !item.match(/^midi:.*$/)) ?
                'Targets must be ip:port or hostname:port pairs (port must be >= 1024) or midi:port_name pairs' : true
        }
    },
    'l': {alias: 'load', type: 'string', file: {name: 'OSC Session (.json)', extensions: ['json']}, describe: 'session file to load (.json)',
        check: (arg)=>{
            return fs.existsSync(arg) ? true : 'Session file not found: ' + arg
        }
    },
    'state': {type: 'string', file: {name: 'OSC State (.state)', extensions: ['state']}, describe: 'state file to load (.state)',
        check: (arg)=>{
            return fs.existsSync(arg) ? true : 'State file not found: ' + arg
        }
    },
    'c': {alias: 'custom-module', type: 'string', file: {name: 'OSC Custom module (.js)', extensions: ['js']}, describe: 'custom module file to load (.js)\n WARNING: custom module can access the file system, use at your own risk.',
        check: (arg)=>{
            return fs.existsSync(arg) ? true : 'Custom module file not found: ' + arg
        },
    },
    'p': {alias: 'port', type: 'number', describe: 'http port of the server (default to 8080)',
        check: (p)=>{
            return (!isNaN(p) && p > 1023 && parseInt(p)===p) ?
                true : 'Port must be an integer >= 1024'
        }
    },
    'o': {alias: 'osc-port', type: 'number', describe: 'osc input port (default to --port)',
        check: (o)=>{
            return (!isNaN(o) && o > 1023 && parseInt(o)===o) ?
                true : 'Port must be an integer >= 1024'
        }
    },
    'tcp-port': {type: 'number', describe: 'tcp server input port',
        check: (t, argv)=>{
            var h = argv['port']
            if (t === h) return 'Tcp input port must different from --port'
            return (!isNaN(t) && t > 1023 && parseInt(t)===t) ?
                true : 'Port must be an integer >= 1024'
        }
    },
    'tcp-targets': {type: 'array', describe: 'tcp servers to connect to (ip: port pairs), does not substitute for --send',
        check: (s, argv)=>{
            if (!argv['tcp-port']) return '--tcp-port must be set'
            return s.some(item=>!item.match(/^[^:]*:[0-9]{4,5}$/)) ?
                'Targets must be ip:port or hostname:port pairs (port must be >= 1024)' : true
        }
    },
    'm': {alias: 'midi', type: 'array', describe: 'midi router settings',
        check: (o)=>{
            var err = o.filter(item=>!item.match(/^(list|debug|jack|sysex|mtc|rpn|nrpn|active_sensing|note_off_velocity|pc_offset|path=(.*)|[^:]+:(virtual|[^,]+,[^,]+))$/))
            return err.length ? `Invalid option${err.length > 1 ? 's' : ''}: ${err.join(', ')}` : true
        }
    },
    'd': {alias: 'debug', type: 'boolean', describe: 'log received osc messages in the console'},
    'n': {alias: 'no-gui', type: 'boolean', describe: 'disable default gui'},
    'fullscreen': {type: 'boolean', describe: 'launch in fullscreen mode (only affects the default client gui)'},
    't': {alias: 'theme', type: 'array', file: {name: 'css file (.css)', extensions: ['css']}, describe: 'theme name or path (multiple values allowed)'},
    'client-options': {type: 'array', describe: 'client options (opt=value pairs)',
        check: (o)=>{
            return o.some(item=>!item.match(/^[^=]*=[^=]*$/)) ?
                'Options must be key=value pairs' : true
        }
    },
    'disable-vsync': {type: 'boolean', describe: 'disable gui\'s vertical synchronization', restart: true},
    'force-gpu': {type: 'boolean', describe: 'ignore chrome\'s gpu blacklist', restart: true},
    'read-only': {type: 'boolean', describe: 'disable session editing and session history changes'},
    'remote-saving': {type: 'string', describe: 'disable remote session saving for hosts that don\'t match the regular expression',
        check: (r, argv)=>{
            var msg = true
            try {
                RegExp(r)
            } catch (e) {
                msg = e
            }
            return msg
        }
    },
    'remote-root': {type: 'string', describe: 'set remote file browsing root folder', file: {folder: true}},
    'authentication': {type: 'string', describe: 'restrict access to "user:password" (remote clients will be prompted for these credentials)',
        check: (a, argv)=>{
            return a.match(/[^:]*:[^:]+/) ? true : 'Auth must be a user:password pair.'
        }
    },
    'instance-name': {type: 'string', describe: 'used to differentiate multiple instances in a zeroconf network'},
    'use-ssl': {type: 'boolean', describe: 'set to true to use HTTPS protocol instead of HTTP (a self-signed certificate will be created)'},

    // cli only
    'disable-gpu': {type: 'boolean', describe: 'disable hardware acceleration', launcher: false},
    'inspect': {type: 'boolean', describe: 'enable node/electron inspector', launcher: false},
    'cache-dir': {type: 'string', describe: 'override default cache directory', launcher: false},
    'config-file': {type: 'string', describe: 'override default config file (defaults to cache-dir/config.json)', launcher: false},
    'docs': {type: 'boolean', describe: 'serve documentation website locally and open it with the system\'s default browser', launcher: false},
    'client-position': {type: 'string', describe: 'position of the client window ("x,y" pair of integers)', launcher: false,
        check: (s)=>{
            return !s.match(/^[0-9]+,[0-9]+$/) ?
                'Position must a x,y pair of integers' : true
        }
    },
    'client-size': {type: 'string', describe: 'size of the client window ("width,height" pair of integers)', launcher: false,
        check: (s)=>{
            return !s.match(/^[0-9]+,[0-9]+$/) ?
                'Size must a x,y pair of integers' : true
        }
    },
    'no-qrcode': {type: 'boolean', describe: 'disable qrcode when the server starts', launcher: false}
}
