var ipc = require("../server").ipc,
    settings = require("../settings"),
    tcpInPort = settings.read("tcp-port"),
    debug = settings.read("debug"),
    midi = settings.read("midi") ? require("../midi") : false,
    oscUDPServer = require("./udp"),
    oscTCPServer = require("./tcp"),
    EventEmitter = require("events").EventEmitter,
    CustomModule = require("../custom-module");

if (midi) midi = new midi();

class OscServer {
    constructor() {
        this.customModuleEventEmitter = new EventEmitter();
        this.customModule = settings.read("custom-module")
            ? new CustomModule(settings.read("custom-module"), {
                app: this.customModuleEventEmitter,
                tcpServer: oscTCPServer,
                sendOsc: this.sendOsc.bind(this),
                receiveOsc: this.receiveOsc.bind(this),
                send: (host, port, address, ...args) => {
                    if (host.indexOf(":") > -1) {
                        args.unshift(address);
                        address = port;
                        var split = host.split(":");
                        host = split[0];
                        port = parseInt(split[1]);
                    }

                    this.sendOsc({
                        host,
                        port,
                        address,
                        args: args.map((x) => this.parseArg(x))
                    });
                },
                receive: (host, port, address, ...args) => {
                    if (host[0] === "/") {
                        // host and port can be skipped
                        if (address !== undefined) args.unshift(address);
                        if (port !== undefined) args.unshift(port);
                        address = host;
                        host = port = undefined;
                    } else if (host.indexOf(":") > -1) {
                        args.unshift(address);
                        address = port;
                        var split = host.split(":");
                        host = split[0];
                        port = parseInt(split[1]);
                    }
                    var lastArg = args[args.length - 1],
                        options = {};
                    if (
                        typeof lastArg === "object" &&
                          lastArg !== null &&
                          lastArg.clientId !== undefined
                    ) {
                        options = args.pop();
                    }
                    this.receiveOsc(
                        {
                            host,
                            port,
                            address,
                            args: args.map((x) => this.parseArg(x)),
                            cm: 1
                        },
                        options.clientId
                    );
                }
            })
            : {};
    }

    parseArg(arg, type) {
        if (arg === null) return null;

        if (typeof arg === "object" && arg.type && arg.type.length === 1)
            return arg;

        if (type && type[0].match(/[bhtdscrmifTFNI]/)) {
            type = type[0];

            switch (type) {
                case "i":
                    return { type: type, value: parseInt(arg) };
                case "d":
                case "f":
                    return { type: type, value: parseFloat(arg) };
                case "T":
                case "F":
                case "N":
                    return { type: type };
                default:
                    return { type: type, value: arg };
            }
        }

        switch (typeof arg) {
            case "number":
                return { type: "f", value: arg };
            case "boolean":
                return { type: arg ? "T" : "F", value: arg };
            case "string":
                return { type: "s", value: arg };
            default:
                return { type: "s", value: JSON.stringify(arg) };
        }
    }

    sendOsc(data) {
        if (!data) return;

        if (data.host == "midi") {
            if (midi) midi.send(data);
        } else {
            if (typeof data.address !== "string" || data.address[0] !== "/") {
                console.error(
                    "(ERROR, OSC) Malformed address: " + data.address
                );
                return;
            }

            if (isNaN(parseInt(data.port))) {
                console.error("(ERROR, OSC) Invalid port: " + data.port);
                return;
            }

            if (
                tcpInPort &&
                oscTCPServer.clients[data.host] &&
                oscTCPServer.clients[data.host][data.port]
            ) {
                oscTCPServer.clients[data.host][data.port].send({
                    address: data.address,
                    args: data.args
                });
            } else {
                oscUDPServer.send(
                    {
                        address: data.address,
                        args: data.args
                    },
                    data.host,
                    data.port
                );
            }

            if (debug) {
                console.log(
                    "\x1b[35m(DEBUG, OSC) Out: ",
                    `{ address: '${data.address}', args: `,
                    data.args,
                    "} To: " + data.host + ":" + data.port,
                    "\x1b[0m"
                );
            }
        }
    }

    receiveOsc(data, clientId) {
        if (!data) return;

        for (var i in data.args) {
            data.args[i] = data.args[i].value;
        }

        if (data.args.length == 1) data.args = data.args[0];

        ipc.send("receiveOsc", data, clientId);

        if (debug)
            console.log(
                "\x1b[36m(DEBUG, OSC) In: ",
                { address: data.address, args: data.args },
                "From: " + data.host + ":" + data.port,
                "\x1b[0m"
            );
    }

    oscInFilter(data) {
        if (this.customModule.oscInFilter) {
            try {
                return this.customModule.oscInFilter(data);
            } catch (e) {
                console.error("(ERROR, CUSTOM MODULE)", e);
                return data;
            }
        } else {
            return data;
        }
    }
    oscOutFilter(data) {
        if (this.customModule.oscOutFilter) {
            try {
                return this.customModule.oscOutFilter(data);
            } catch (e) {
                console.error("(ERROR, CUSTOM MODULE)", e);
                return data;
            }
        } else {
            return data;
        }
    }

    oscInHandler(msg, timetag, info) {
        var data = this.oscInFilter({
            address: msg.address,
            args: msg.args,
            host: info.address,
            port: info.port
        });
        if (!data) return;
        this.receiveOsc(data);
    }

    oscInHandlerWrapper(msg, timetag, info) {
        var delay = timetag ? Math.max(0, timetag.native - Date.now()) : 0;
        if (delay) {
            setTimeout(() => {
                this.oscInHandler(msg, timetag, info);
            }, delay);
        } else {
            this.oscInHandler(msg, timetag, info);
        }
    }

    init() {
        if (midi)
            midi.init((data) => {
                data = this.oscInFilter({
                    address: data.address,
                    args: data.args,
                    host: data.host,
                    port: data.port
                });

                if (!data) return;

                this.receiveOsc(data);
            });

        oscUDPServer.on("message", this.oscInHandlerWrapper.bind(this));
        oscUDPServer.open();

        if (settings.read("tcp-port")) {
            oscTCPServer.on("message", this.oscInHandlerWrapper.bind(this));
            oscTCPServer.open();
        }

        if (this.customModule.init) {
            try {
                this.customModule.init();
            } catch (e) {
                console.error("(ERROR, CUSTOM MODULE)", e);
            }
        }
    }

    stop() {
        if (this.customModule.stop) this.customModule.stop();
        if (midi) midi.stop();
    }
}

var oscServer = new OscServer();
oscServer.init();

module.exports = {
    server: oscServer,
    send: function(host, port, address, args, typeTags, clientId) {
        var message = [];

        if (!Array.isArray(args)) args = [args];

        if (typeof args === "object" && args !== null) {
            var typeTag, arg;

            for (var i = 0; i < args.length; i++) {
                if (typeTags && typeTags[i]) typeTag = typeTags[i];
                arg = oscServer.parseArg(args[i], typeTag);

                if (arg !== null) message.push(arg);
            }
        }

        var data = oscServer.oscOutFilter({
            address: address,
            args: message,
            host: host,
            port: port,
            clientId: clientId
        });

        oscServer.sendOsc(data);
    },
    midi: midi
};
