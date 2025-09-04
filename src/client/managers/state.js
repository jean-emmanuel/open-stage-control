var ipc = require("../ipc"),
    widgetManager = require("./widgets"),
    cache = require("./cache"),
    uiFilebrowser = require("../ui/ui-filebrowser"),
    uiFileupload = require("../ui/ui-fileupload"),
    notifications = require("../ui/notifications"),
    { saveAs } = require("file-saver"),
    locales = require("../locales"),
    { deepCopy } = require("../utils");

var StateManager = class StateManager {
    constructor() {
        this.statePath = "";
        this.lastDir = null;

        this.quickState = cache.get("state.quickState") || null;

        this.valueStateQueue = {};
        this.valueOldPropQueue = {};
        this.valueNewPropQueue = {};
        this.queueCounter = 0;
    }

    get(filter) {
        var data = {};

        for (let i in widgetManager.widgets) {
            var widget = widgetManager.widgets[i];

            if (filter && !filter(widget)) continue;

            if (widget.setValue && widget.getValue && !widget.noValueState) {
                var v = widget.getValue();

                if (v !== undefined) {
                    data[widget.getProp("id")] = v;
                }
            }
        }

        return data;
    }

    set(preset, send) {
        for (let id in preset) {
            var value = preset[id],
                widgets = widgetManager.getWidgetById(id);

            if (widgets.length) {
                for (var j = widgets.length - 1; j >= 0; j--) {
                    if (widgets[j].setValue && !widgets[j].noValueState) {
                        widgets[j].setValue(value, {
                            send: send,
                            sync: true,
                            fromState: true
                        });
                    }
                }
            }
        }
    }

    send(options) {
        for (let i in widgetManager.widgets) {
            var widget = widgetManager.widgets[i];

            if (widget.sendValue && !widget.noValueState) {
                widget.sendValue(null, options);
            }
        }
    }

    save(path) {
        if (path) this.statePath = path;

        if (!this.statePath) return this.saveAs();

        ipc.send("stateSave", {
            session: JSON.stringify(this.get(), null, "  "),
            path: this.statePath
        });
    }

    saveAs() {
        uiFilebrowser(
            { extension: "state", save: true, directory: this.lastDir },
            (path) => {
                this.lastDir = path[0];
                this.save(path);
            }
        );
    }

    requestOpen(path) {
        ipc.send("stateOpen", { path: path });
    }

    browse() {
        uiFilebrowser(
            { extension: "state", directory: this.lastDir },
            (path) => {
                this.lastDir = path[0];
                this.requestOpen(path);
            }
        );
    }

    load(state, send, path) {
        if (!state) return;

        this.setStatePath(path);

        try {
            if (typeof state === "string") {
                state = JSON.parse(state);
            }

            if (Array.isArray(state)) {
                // backward compatibility
                var ostate = {};
                for (var i in state) {
                    ostate[state[i][0]] = state[i][1];
                }
                state = ostate;
            }

            this.set(state, send);
            notifications.add({
                icon: "sliders-h",
                class: "state-recall",
                message: locales("state_recallsuccess")
            });
        } catch (e) {
            this.loadError();
        }
    }

    loadError() {
        notifications.add({
            class: "error",
            message: locales("state_uploaderror")
        });
    }

    import() {
        uiFileupload(
            ".state",
            (path, result) => {
                this.load(result, true);
            },
            (e) => {
                this.loadError();
            }
        );
    }

    export() {
        var state = JSON.stringify(this.get(), null, "  ");
        var blob = new Blob([state], { type: "application/json" });
        saveAs(
            blob,
            new Date().toJSON().slice(0, 10) +
                "_" +
                new Date().toJSON().slice(11, 16) +
                ".state"
        );
    }

    quickSave() {
        this.quickState = deepCopy(this.get());
        localStorage.setItem(
            "osc.state.quickState",
            JSON.stringify(this.quickState)
        );
    }

    quickLoad() {
        this.load(this.quickState, true);
    }

    setStatePath(path) {
        if (!path) return;
        this.statePath = path;
    }

    pushValueState(id, value) {
        this.valueStateQueue[id] = value;
    }

    pushValueOldProp(id, value) {
        this.valueOldPropQueue[id] =
            typeof value == "object" ? JSON.stringify(value) : value;
    }

    pushValueNewProp(id, value) {
        this.valueNewPropQueue[id] =
            typeof value == "object" ? JSON.stringify(value) : value;
        if (this.queueCounter == 0) this.flush();
    }

    flush() {
        for (let id in this.valueStateQueue) {
            if (this.valueStateQueue[id] !== undefined) {
                for (let w of widgetManager.getWidgetById(id)) {
                    if (w.noValueState) continue;
                    w.setValue(this.valueStateQueue[id], {
                        sync: true,
                        fromState: true,
                        fromEdit: true
                    });
                }
            }
        }

        for (let id in this.valueNewPropQueue) {
            if (this.valueNewPropQueue[id] != this.valueOldPropQueue[id]) {
                for (let w of widgetManager.getWidgetById(id)) {
                    if (w.noValueState) continue;
                    w.setValue(w.getProp("value"), {
                        sync: true,
                        fromState: true
                    });
                }
            }
        }

        this.valueStateQueue = {};
        this.valueOldPropQueue = {};
        this.valueNewPropQueue = {};
    }

    incrementQueue() {
        this.queueCounter++;
    }

    decrementQueue() {
        this.queueCounter--;
        if (this.queueCounter == 0) {
            this.flush();
        }
    }
};

var stateManager = new StateManager();

module.exports = stateManager;
