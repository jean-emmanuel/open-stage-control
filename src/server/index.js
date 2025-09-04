require("source-map-support").install({ handleUncaughtExceptions: false });

var dev = process.argv[0].includes("node_modules"),
    settings = require("./settings"),
    docsServer,
    app = null,
    launcher = null,
    tray = null,
    clientWindows = [],
    serverProcess = null,
    node = false;

function openDocs() {
    if (!docsServer) {
        var DocsServer = require("./docs-server");
        docsServer = new DocsServer();
    }

    docsServer.open();
}

function nodeMode() {
    if (!settings.read("no-gui") && !process.env.OSC_SERVER_PROCESS) {
        settings.write("no-gui", true, true);
        console.warn(
            "(INFO) Headless mode (--no-gui) enabled automatically (running with node)"
        );
    }

    process.on("uncaughtException", (err) => {
        console.error(
            "(ERROR) A JavaScript error occurred in the main process:"
        );
        console.error(err.stack);
    });

    node = true;
}
if (!process.versions.electron || process.env.ELECTRON_RUN_AS_NODE) {
    nodeMode();
} else {
    try {
        require("electron").dialog.showErrorBox = (title, err) => {
            console.error(title + ": " + err);
        };
    } catch (e) {
        nodeMode();
    }
}

function openClient() {
    var app = require("./electron-app");
    var address = settings.appAddresses()[0];

    var launch = () => {
        var win = require("./electron-window")({
            address: address,
            shortcuts: true,
            fullscreen: settings.read("fullscreen"),
            noFocus:
                settings.read("client-options") &&
                settings
                    .read("client-options")
                    .some((x) => x.match(/nofocus=1/i)),
            id: "client"
        });
        win.on("error", () => {
            console.log("ERR");
        });
        clientWindows.push(win);
    };
    if (app.isReady()) {
        launch();
    } else {
        app.on("ready", function() {
            launch();
        });
    }
}

function showQRCode() {
    var QRCode = require("qrcode"),
        addresses = settings
            .appAddresses()
            .filter(
                (a) => !a.includes("127.0.0.1") && !a.includes("localhost")
            );

    for (var add of addresses) {
        if (launcher) {
            QRCode.toString(
                add,
                { type: "svg", small: true, margin: 1 },
                (err, qr) => {
                    launcher.webContents.send(
                        "stdout",
                        "<div class=\"qrcode\" title=\"" +
                            add +
                            "\">" +
                            qr +
                            "</div>"
                    );
                }
            );
            if (addresses.length > 1) {
                launcher.webContents.send("stdout", "(" + add + ")");
            }
        } else {
            QRCode.toString(
                add,
                { type: "terminal", small: true },
                (err, qr) => {
                    console.log("\n" + qr.replace(/^/gm, "    "));
                }
            );
            if (addresses.length > 1) {
                console.log("    (" + add + ")");
            }
        }
    }
}

function startServerProcess() {
    var args = ["--no-gui"];

    for (var k in settings.read("options")) {
        args.push("--" + k);
        var val = settings.read(k);
        if (typeof val === "object") {
            args = args.concat(val);
        } else if (typeof val !== "boolean") {
            args.push(val);
        }
    }

    var { fork } = require("child_process");

    serverProcess = fork(app.getAppPath(), args, {
        stdio: "pipe",
        env: { ...process.env, OSC_SERVER_PROCESS: 1 }
    });

    var cb = (data) => {
        if (data.indexOf("(INFO) Server started") > -1) {
            if (!settings.read("no-gui")) openClient();
            if (!settings.read("no-qrcode"))
                setTimeout(() => {
                    showQRCode();
                });
            serverProcess.stdout.off("data", cb);
        }
    };
    serverProcess.stdout.on("data", cb);

    serverProcess.stdout.on("data", (data) => {
        console.log(String(data).trim());
    });

    serverProcess.stderr.on("data", (data) => {
        var str = String(data).trim();
        if (str.includes("--debug")) return;
        console.error(str);
    });

    serverProcess.on("message", (data) => {
        var [command, args] = data;
        if (command === "settings.write") {
            settings.write(args[0], args[1], false);
        }
    });

    serverProcess.on("close", (code) => {
        console.log("(INFO) Server stopped");
        serverProcess = null;
        if (global.defaultClient) global.defaultClient.close();
    });

    if (launcher) {
        serverProcess.on("close", (code) => {
            if (!launcher.isDestroyed())
                launcher.webContents.send("server-stopped");
        });
        launcher.webContents.send("server-starting");
    }
}

function stopServerProcess() {
    if (settings.read("no-gui")) {
        if (serverProcess) serverProcess.kill("SIGINT");
        serverProcess = null;
        return;
    }

    var toClose = clientWindows.filter((w) => w && !w.isDestroyed()),
        closed = 0;

    if (toClose.length === 0) {
        serverProcess.kill("SIGINT");
        serverProcess = null;
    }

    for (var w of toClose) {
        w.on("closed", () => {
            closed++;
            if (closed === toClose.length) {
                clientWindows = [];
                if (serverProcess) {
                    serverProcess.kill("SIGINT");
                    serverProcess = null;
                }
            }
        });
        w.close();
    }
}

function startLauncher() {
    global.launcherSharedGlobals = {
        settings: settings,
        openDocs: openDocs,
        midilist: require("./midi").list
    };
    var path = require("path"),
        address =
            "file://" +
            path.resolve(__dirname + "/../launcher/" + "index.html"),
        { ipcMain } = require("electron");

    // @electron/remote won't work without this hack
    process.mainModule = { require };

    require("@electron/remote/main").initialize();

    app.on("ready", function() {
        launcher = require("./electron-window")({
            address: address,
            shortcuts: dev,
            width: 680,
            height:
                40 +
                200 +
                20 +
                (24 *
                    Object.keys(settings.options).filter(
                        (x) => settings.options[x].launcher !== false
                    ).length) /
                    2,
            node: true,
            color: "#151a24",
            id: "launcher"
        });
        require("@electron/remote/main").enable(launcher.webContents);

        if (settings.read("useTray")) {
            tray = require("./tray")({
                window: launcher,
                openClient: openClient,
                app: app,
                startServer: startServerProcess,
                stopServer: stopServerProcess
            });

            launcher.on("will-close", () => {
                if (clientWindows.some((w) => w && !w.isDestroyed())) {
                    launcher.hide();
                    e.preventDefault();
                }
            });
        }

        launcher.on("close", (e) => {
            if (
                tray &&
                clientWindows.some((w) => w && !w.isDestroyed()) &&
                serverProcess
            ) {
                launcher.hide();
                e.preventDefault();
                return;
            }
            process.stdout.write = stdoutWrite;
            process.stderr.write = stderrWrite;
            if (process.log) process.log = processLog;
            if (tray) tray.destroy();
        });
    });

    let processLog = process.log,
        stdoutWrite = process.stdout.write,
        stderrWrite = process.stderr.write;

    if (process.log) {
        process.log = function(string, encoding, fd) {
            processLog.apply(process, arguments);
            launcher.webContents.send("stdout", string);
        };
    }

    process.stdout.write = function(string, encoding, fd) {
        stdoutWrite.apply(process.stdout, arguments);
        launcher.webContents.send("stdout", string);
    };

    process.stderr.write = function(string, encoding, fd) {
        stderrWrite.apply(process.stderr, arguments);
        launcher.webContents.send("stderr", string);
    };

    ipcMain.on("start", function(e, options) {
        startServerProcess();
    });

    ipcMain.on("stop", function(e, options) {
        stopServerProcess();
    });

    ipcMain.on("openClient", function(e, options) {
        openClient();
    });

    ipcMain.on("showQRCode", function(e, options) {
        showQRCode();
    });

    ipcMain.on("hide", function(e, options) {
        launcher.hide();
    });
}

if (settings.read("docs")) {
    openDocs();
} else if (node || (settings.cli && settings.read("no-gui"))) {
    // node mode: minimal server startup

    var server = require("./server"),
        osc = require("./osc"),
        callbacks = require("./callbacks"),
        zeroconf = require("./zeroconf");

    server.bindCallbacks(callbacks);

    serverStarted = true;

    var closeServer = () => {
        osc.server.stop();
        zeroconf.unpublishAll();
    };

    try {
        let { app } = require("electron");
        app.on("ready", () => {
            process.on("SIGINT", function() {
                closeServer();
                process.exit(0);
            });
        });
    } catch (e) {
        process.on("SIGINT", function() {
            closeServer();
            process.exit(0);
        });
    }

    if (!process.env.OSC_SERVER_PROCESS)
        server.eventEmitter.on("serverStarted", () => {
            if (!settings.read("no-qrcode")) showQRCode();
        });
} else {
    // normal mode:
    // - electron process: launcher and/or built-in client(s)
    // - node process: server (node mode in a forked process)

    app = require("./electron-app");

    app.on("ready", () => {
        process.on("SIGINT", function() {
            if (serverProcess) {
                serverProcess.kill("SIGINT");
                serverProcess = null;
            }
            process.exit(0);
        });
    });

    app.on("before-quit", () => {
        if (serverProcess) {
            serverProcess.kill("SIGINT");
            serverProcess = null;
        }
    });

    if (settings.cli) {
        startServerProcess();
    } else {
        startLauncher();
    }
}
