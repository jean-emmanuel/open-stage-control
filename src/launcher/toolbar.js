var { ipcRenderer } = require("electron"),
    remote = require("@electron/remote"),
    { Menu, MenuItem } = remote.require("electron"),
    menu = new Menu(),
    terminal = require("./terminal"),
    settings = require("./settings"),
    keyboardJS = require("keyboardjs/dist/keyboard.min.js"),
    { midilist, openDocs } = remote.getGlobal("launcherSharedGlobals"),
    serverStarting = false,
    serverStart = () => {
        if (serverStarting) return;
        ipcRenderer.send("start");
    },
    serverStop = () => {
        if (!serverStarting) return;
        ipcRenderer.send("stop");
    },
    showQRCode = () => {
        ipcRenderer.send("showQRCode");
    };

var start = new MenuItem({
    label: "Start",
    click: serverStart,
    accelerator: "f5"
});
var stop = new MenuItem({
    label: "Stop",
    click: serverStop,
    accelerator: "f6"
});
var qrcode = new MenuItem({
    label: "Show QR code",
    click: showQRCode,
    accelerator: "f7"
});
var newWindow = new MenuItem({
    label: "New window",
    visible: false,
    click: () => {
        ipcRenderer.send("openClient");
    },
    accelerator: "CmdOrCtrl + n"
});
menu.append(start);
menu.append(stop);
menu.append(qrcode);
menu.append(newWindow);
menu.append(
    new MenuItem({
        type: "separator"
    })
);
menu.append(
    new MenuItem({
        label: "Load",
        click: () => {
            settings.load();
        },
        accelerator: "CmdOrCtrl + o"
    })
);
menu.append(
    new MenuItem({
        label: "Save",
        click: () => {
            settings.save();
        },
        accelerator: "CmdOrCtrl + s"
    })
);
menu.append(
    new MenuItem({
        label: "Save as...",
        click: () => {
            settings.saveAs();
        },
        accelerator: "CmdOrCtrl + shift + s"
    })
);
menu.append(
    new MenuItem({
        type: "separator"
    })
);
menu.append(
    new MenuItem({
        label: "List MIDI Devices",
        click: () => {
            midilist();
        },
        accelerator: "ctrl + m"
    })
);
menu.append(
    new MenuItem({
        type: "submenu",
        label: "Console",
        submenu: [
            new MenuItem({
                label: "Clear",
                click: () => {
                    terminal.clear();
                },
                accelerator: "CmdOrCtrl + l"
            }),
            new MenuItem({
                label: "Autoscroll",
                type: "checkbox",
                checked: true,
                click: function(e) {
                    terminal.autoSroll = e.checked;
                }
            }),
            new MenuItem({
                label: "Check for updates at startup",
                type: "checkbox",
                checked: settings.remote.read("checkForUpdates"),
                click: (e) => {
                    settings.remote.write("checkForUpdates", e.checked);
                }
            })
        ]
    })
);
menu.append(
    new MenuItem({
        type: "submenu",
        label: "Launcher",
        submenu: [
            new MenuItem({
                label: "Autostart",
                type: "checkbox",
                checked: settings.remote.read("autoStart"),
                click: (e) => {
                    settings.remote.write("autoStart", e.checked);
                    remote.getCurrentWindow().setAlwaysOnTop(e.checked);
                }
            }),
            new MenuItem({
                label: "Always on top",
                type: "checkbox",
                checked: settings.remote.read("alwaysOnTop"),
                click: (e) => {
                    settings.remote.write("alwaysOnTop", e.checked);
                    remote.getCurrentWindow().setAlwaysOnTop(e.checked);
                }
            }),
            new MenuItem({
                label: "Use tray icon",
                type: "checkbox",
                checked: settings.remote.read("useTray"),
                click: (e) => {
                    settings.remote.write("useTray", e.checked);
                }
            }),
            new MenuItem({
                label: "Start minimized",
                type: "checkbox",
                checked: settings.remote.read("startMinimized"),
                click: (e) => {
                    settings.remote.write("startMinimized", e.checked);
                }
            })
        ]
    })
);
menu.append(
    new MenuItem({
        type: "separator"
    })
);
// menu.append(new MenuItem({
//     label: 'Restart',
//     click: ()=>{
//         app.relaunch()
//         app.exit(0)
//     }
// }))
menu.append(
    new MenuItem({
        label: "Documentation",
        click: () => {
            openDocs();
        }
    })
);

if (settings.remote.read("useTray")) {
    menu.append(
        new MenuItem({
            label: "Hide",
            click: () => {
                ipcRenderer.send("hide");
            }
        })
    );
}

menu.append(
    new MenuItem({
        role: "Quit"
    })
);

function bindShortcuts(menu) {
    for (let m of menu.items) {
        if (m.type === "submenu") {
            bindShortcuts(m.submenu);
        } else if (m.accelerator && m.click) {
            keyboardJS.bind(m.accelerator.replace("CmdOrCtrl", "mod"), (e) => {
                m.click();
            });
        }
    }
}

bindShortcuts(menu);

class Toolbar {
    constructor() {
        this.container = DOM.get("osc-toolbar#menu")[0];
        this.startButton = DOM.get("osc-toolbar#start")[0];

        this.container.addEventListener("click", (e) => {
            this.container.classList.add("on");
            start.visible = !serverStarting;
            stop.visible = !!serverStarting;
            qrcode.visible = !!serverStarting;
            newWindow.visible = !!serverStarting;
            menu.popup({
                window: remote.getCurrentWindow(),
                x: parseInt(PXSCALE),
                y: parseInt(40 * PXSCALE)
            });
        });

        menu.on("menu-will-close", () => {
            this.container.classList.remove("on");
        });

        this.startButton.addEventListener("click", (e) => {
            if (!serverStarting) serverStart();
            else serverStop();
        });

        ipcRenderer.on("server-starting", () => {
            serverStarting = true;
            this.startButton.classList.add("started");
        });
        ipcRenderer.on("server-stopped", () => {
            serverStarting = false;
            this.startButton.classList.remove("started");
        });
    }
}

module.exports = new Toolbar();
