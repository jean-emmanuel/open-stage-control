var path = require("path"),
    fs = require("fs"),
    settings = require("./settings"),
    osc = require("./osc"),
    { ipc } = require("./server"),
    { deepCopy, resolveHomeDir } = require("./utils"),
    child_process = require("child_process"),
    fragmentManager;

var widgetHashTable = {},
    clipboard = { clipboard: null, idClipboard: null };

module.exports = {
    open(data, clientId) {
        // client connected

        ipc.send("connected");

        var recentSessions = settings.read("recentSessions");

        ipc.send("sessionList", recentSessions, clientId);
        ipc.send("clipboard", clipboard, clientId);
        ipc.send("serverTargets", settings.read("send"), clientId);

        if (settings.read("load") && !data.hotReload)
            return this.sessionOpen({ path: settings.read("load") }, clientId);
    },

    close(data, clientId) {
        // client disconnected
    },

    created(data, clientId) {
        // client created or reconnected

        if (!widgetHashTable[clientId]) {
            widgetHashTable[clientId] = { CONSOLE: { typeTags: "" } };
        }
    },

    destroyed(data, clientId) {
        // client removed (timeout)

        // clear osc data cache
        if (widgetHashTable[clientId]) delete widgetHashTable[clientId];
    },

    clipboard(data, clientId) {
        // shared clipboard

        clipboard = data;
        ipc.send("clipboard", data, null, clientId);
    },

    sessionAddToHistory(data) {
        var recentSessions = settings.read("recentSessions");

        fs.lstat(data, (err, stats) => {
            if (err || !stats.isFile()) return;

            // add session to history
            recentSessions.unshift(path.resolve(data));
            // remove doubles from history
            recentSessions = recentSessions.filter(
                function(elem, index, self) {
                    return index == self.indexOf(elem);
                }
            );

            // history size limit
            if (recentSessions.length > 10)
                recentSessions = recentSessions.slice(0, 10);

            // save history
            settings.write("recentSessions", recentSessions);

            ipc.send("sessionList", recentSessions);
        });
    },

    sessionRemoveFromHistory(data) {
        var recentSessions = settings.read("recentSessions");
        if (recentSessions.indexOf(data) > -1) {
            recentSessions.splice(recentSessions.indexOf(data), 1);
            settings.write("recentSessions", recentSessions);
            ipc.send("sessionList", recentSessions);
        }
    },

    sessionSetPath(data, clientId) {
        // store client's current session file path

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        if (!settings.read("read-only")) {
            module.exports.sessionAddToHistory(data.path);
        }

        ipc.clients[clientId].sessionPath = data.path;

        ipc.send("setTitle", path.basename(data.path), clientId);
    },

    sessionOpen(data, clientId) {
        // attempt to read session file

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        module.exports.fileRead(
            data,
            clientId,
            true,
            (result) => {
                ipc.clients[clientId].sessionPath = data.path; // for resolving local file requests
                ipc.send(
                    "sessionOpen",
                    { path: data.path, fileContent: result },
                    clientId
                );
            },
            (error) => {
                ipc.send("error", `Could not open session file:\n ${error}`);
            }
        );
    },

    fragmentLoad(data, clientId) {
        // attempt to read session file

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        fragmentManager = fragmentManager || require("./fragment-manager");

        fragmentManager.loadFragment(data, clientId);
    },

    sessionOpened(data, clientId) {
        // session file opened successfully

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        if (settings.read("state")) {
            var send = true;
            for (var id in ipc.clients) {
                // only make the client send its osc state if there are no other active clients
                if (id !== clientId && ipc.clients[id].connected()) {
                    send = false;
                }
            }

            var stateContent = fs.readFileSync(settings.read("state"), "utf8");
            if (stateContent[0] === "\ufeff")
                stateContent = stateContent.slice(1); // remove BOM
            var state = {
                state: JSON.parse(stateContent),
                send: send
            };
            ipc.send("stateLoad", state, clientId);
        }

        ipc.send("stateSend", null, null, clientId);

        module.exports.sessionSetPath({ path: data.path }, clientId);
    },

    fileRead(data, clientId, ok, callback, errorCallback) {
        // private function

        if (!ok) return;

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        data.path = resolveHomeDir(data.path);

        if (!path.isAbsolute(data.path) && settings.read("remote-root"))
            data.path = path.resolve(
                resolveHomeDir(settings.read("remote-root")),
                data.path
            );

        fs.readFile(data.path, "utf8", (err, result) => {
            var error;

            if (err) {
                error = err;
            } else {
                try {
                    if (result[0] === "\ufeff") result = result.slice(1); // remove BOM
                    result = data.raw ? result : JSON.parse(result);
                    callback(result);
                } catch (err) {
                    error = err;
                }
            }

            if (error && errorCallback) errorCallback(error);
        });
    },

    fileSave(data, clientId, ok, callback) {
        // private function

        if (!ok) return;

        if (
            !data.path ||
            (settings.read("remote-saving") &&
                !RegExp(settings.read("remote-saving")).test(
                    ipc.clients[clientId].address
                ))
        ) {
            return ipc.send(
                "notify",
                {
                    icon: "save",
                    locale: "remotesave_forbidden",
                    class: "error"
                },
                clientId
            );
        }

        if (data.path) {
            if (Array.isArray(data.path))
                data.path = path.resolve(...data.path);

            data.path = resolveHomeDir(data.path);

            if (!path.isAbsolute(data.path) && settings.read("remote-root"))
                data.path = path.resolve(
                    settings.read("remote-root"),
                    data.path
                );

            var root = resolveHomeDir(settings.read("remote-root"));
            if (
                root &&
                !path.normalize(data.path).includes(path.normalize(root))
            ) {
                console.error(
                    "(ERROR) Could not save: path outside of remote-root"
                );
                return ipc.send(
                    "notify",
                    {
                        class: "error",
                        locale: "remotesave_fail",
                        message:
                            " (Could not save: path outside of remote-root)"
                    },
                    clientId
                );
            }

            try {
                JSON.parse(data.session);
            } catch (e) {
                return console.error("(ERROR) Could not save: invalid file");
            }

            fs.writeFile(data.path, data.session, function(err, fdata) {
                if (err)
                    return ipc.send(
                        "notify",
                        {
                            class: "error",
                            locale: "remotesave_fail",
                            message: " (" + err.message + ")"
                        },
                        clientId
                    );

                ipc.send(
                    "notify",
                    {
                        icon: "save",
                        locale: "remotesave_success",
                        class: "session-save",
                        message: " (" + path.basename(data.path) + ")"
                    },
                    clientId
                );

                callback();
            });
        }
    },

    stateOpen(data, clientId) {
        // attempt to open state file

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        module.exports.fileRead(
            data,
            clientId,
            true,
            (result) => {
                ipc.send(
                    "stateLoad",
                    { state: result, path: data.path, send: true },
                    clientId
                );
            },
            (error) => {
                ipc.send("error", `Could not open state file:\n ${error}`);
            }
        );
    },

    sessionSave(data, clientId) {
        // save session file (.json)

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        if (!path.basename(data.path).match(/.*\.json$/))
            return console.error(
                "(ERROR) Sessions must be saved as .json files"
            );

        if (data.backup) {
            var newpath,
                i = 0;
            for (;;) {
                newpath = data.path.replace(
                    /\.json$/,
                    "-backup" + String(i).padStart(3, 0) + ".json"
                );
                if (fs.existsSync(newpath)) i++;
                else {
                    data.path = newpath;
                    break;
                }
            }
        }

        module.exports.fileSave(data, clientId, true, () => {
            console.log("(INFO) Session file saved in " + data.path);

            if (!data.backup) ipc.send("sessionSaved", clientId);

            // reload session in other clients
            for (var id in ipc.clients) {
                if (
                    id !== clientId &&
                    ipc.clients[id].sessionPath === data.path
                ) {
                    module.exports.sessionOpen({ path: data.path }, id);
                }
            }

            if (!data.backup)
                module.exports.sessionSetPath({ path: data.path }, clientId);
        });
    },

    stateSave(data, clientId) {
        // save state file (.json)

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path);

        if (!path.basename(data.path).match(/.*\.state/))
            return console.error(
                "(ERROR) Statesaves must be saved as .state files"
            );

        module.exports.fileSave(data, clientId, true, () => {
            console.log("(INFO) State file saved in " + data.path);
        });
    },

    syncOsc(shortdata, clientId) {
        // sync osc (or midi) message with other clients

        // if widget hash is provided, look for cached data
        if (
            !(
                widgetHashTable[clientId] &&
                widgetHashTable[clientId][shortdata.h]
            )
        )
            return;

        var value = shortdata.v,
            data = shortdata.h ? widgetHashTable[clientId][shortdata.h] : {};

        data = deepCopy(data);
        for (var k in shortdata) {
            data[k] = shortdata[k];
        }

        // only rawTarget will be used
        delete data.target;

        data.args = data.preArgs ? data.preArgs.concat(value) : [value];

        if (!data.noSync) ipc.send("receiveOsc", data, null, clientId);
    },

    sendOsc(shortdata, clientId) {
        // send osc (or midi) message and sync with other clients
        // shortdata
        //     {
        //         h: 'widget_uuid',
        //         v: widget_value,
        //         ... // target, preArgs, address, typeTags
        //             // override cached data
        //             // required if data.h is not provided
        //     }

        // if widget hash is provided, look for cached data
        if (
            shortdata.h &&
            !(
                widgetHashTable[clientId] &&
                widgetHashTable[clientId][shortdata.h]
            )
        )
            return;

        var value = shortdata.v,
            data = shortdata.h ? widgetHashTable[clientId][shortdata.h] : {};

        data = deepCopy(data);
        for (var k in shortdata) {
            data[k] = shortdata[k];
        }

        if (data.target) {
            var targets = [];

            if (!shortdata.i && settings.read("send") && !shortdata.target)
                Array.prototype.push.apply(targets, settings.read("send"));
            if (data.target) Array.prototype.push.apply(targets, data.target);

            data.args = data.preArgs ? data.preArgs.concat(value) : [value];

            for (var i in targets) {
                if (targets[i] === "self") {
                    ipc.send("receiveOsc", data, clientId);
                    continue;
                } else if (targets[i] === null) {
                    continue;
                }

                var host = targets[i].split(":")[0],
                    port = targets[i].split(":")[1];

                if (port) {
                    osc.send(
                        host,
                        port,
                        data.address,
                        data.args,
                        data.typeTags,
                        clientId
                    );
                }
            }
        }

        if (!data.noSync) ipc.send("receiveOsc", data, null, clientId);
    },

    addWidget(data, clientId) {
        // cache widget osc data to reduce bandwidth usage
        // data
        //     {
        //         hash: 'widget_uuid',
        //         data: {
        //             target: ['host:port', ...],
        //             preArgs: [arg1, ...],
        //             address: '/address',
        //             typeTags: 'iif' // one letter per arg typetag
        //         }
        //     }
        //     preArgs, target and typeTags can be empty strings

        if (!widgetHashTable[clientId][data.hash]) {
            widgetHashTable[clientId][data.hash] = {};
        }

        var cache = widgetHashTable[clientId][data.hash],
            widgetData = data.data;

        for (var k in widgetData) {
            if (k === "target" || k === "preArgs") {
                if (widgetData[k] !== "") {
                    cache[k] = Array.isArray(widgetData[k])
                        ? widgetData[k]
                        : [widgetData[k]];
                } else {
                    cache[k] = [];
                }
            } else {
                cache[k] = widgetData[k];
            }
        }

        // store raw target for client sync widget matching
        cache._rawTarget = widgetData.target;
    },

    removeWidget(data, clientId) {
        // clear widget osc data

        delete widgetHashTable[clientId][data.hash];
    },

    reload(data) {
        // (dev) hot reload
        ipc.send("reload");
    },

    reloadCss() {
        // (dev) hot css reload
        ipc.send("reloadCss");
    },

    log(data) {
        console.log(data);
    },

    error(data) {
        console.error(data);
    },

    errorLog(data) {
        console.error(data);
    },

    errorPopup(data) {
        ipc.send("error", data);
    },

    listDir(data, clientId) {
        // remote file browser backend

        if (data.path) {
            // path is requested
            data.path[0] = resolveHomeDir(data.path[0]);
        } else if (
            settings.read("last-dir") &&
            fs.existsSync(settings.read("last-dir"))
        ) {
            // attempt to use last visited directory
            data.path = [settings.read("last-dir")];
        } else {
            // default directory fallback
            data.path = [resolveHomeDir("~/")];
        }

        var p = path.resolve(...data.path),
            root = resolveHomeDir(settings.read("remote-root"));

        if (root && !path.normalize(p).includes(path.normalize(root))) p = root;

        if (process.platform === "win32" && !root) {
            // Drive list hack on windows
            if (
                data.path.length === 2 &&
                data.path[1] === ".." &&
                (data.path[0].match(/^[A-Z]:\\$/) || data.path[0] === "\\")
            ) {
                child_process.exec(
                    "(get-wmiobject win32_volume | ? { $_.DriveType -eq 3 } | % { get-psdrive $_.DriveLetter[0] }).Root -join \" \"",
                    { shell: "powershell.exe" },
                    (error, stdout) => {
                        if (error) {
                            ipc.send(
                                "notify",
                                {
                                    class: "error",
                                    message:
                                        "Failed to list available drives (see server console)."
                                },
                                clientId
                            );
                            console.error(
                                "(ERROR) Failed to list available drives."
                            );
                            console.error(error.stack);
                        } else {
                            ipc.send(
                                "listDir",
                                {
                                    path: "\\",
                                    files: stdout
                                        .split(" ")
                                        .filter((value) =>
                                            /[A-Za-z]:/.test(value)
                                        )
                                        .map((value) => {
                                            return {
                                                name: value.trim(),
                                                folder: true
                                            };
                                        })
                                },
                                clientId
                            );
                        }
                    }
                );
                return;
            }
        }

        fs.readdir(p, (err, files) => {
            if (err) {
                ipc.send(
                    "notify",
                    { class: "error", message: err.message },
                    clientId
                );
                throw err;
            } else {
                var extRe = data.extension
                    ? new RegExp(".*\\." + data.extension + "$")
                    : /.*/;
                var list = files
                    .filter((x) => x[0] !== ".")
                    .map((x) => {
                        var folder = false;
                        try {
                            folder = fs
                                .statSync(path.resolve(p, x))
                                .isDirectory();
                        } catch (e) {}
                        return {
                            name: x,
                            folder
                        };
                    });
                list = list.filter((x) => x.folder || x.name.match(extRe));
                ipc.send(
                    "listDir",
                    {
                        path: p,
                        files: list
                    },
                    clientId
                );
                settings.write("last-dir", p, false, false);
            }
        });
    }
};
