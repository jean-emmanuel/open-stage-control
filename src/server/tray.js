var { Menu, Tray, ipcMain } = require("electron"),
    settings = require("./settings"),
    tray = null,
    contextMenu = null,
    isServerRunning = false;

module.exports = function(options = {}) {
    var icon = __dirname + "/../assets/logo.png";
    if (process.platform === "darwin") {
        icon = __dirname + "/../assets/logo_tray.png";
    }

    tray = new Tray(icon);
    contextMenu = Menu.buildFromTemplate([
        {
            label: "Show launcher",
            id: "show",
            click: () => {
                options.window.show();
            }
        },
        {
            label: "Hide launcher",
            id: "hide",
            click: () => {
                options.window.hide();
            }
        },
        {
            label: "Start server",
            id: "start",
            click: () => {
                ipcMain.emit("start");
            }
        },
        {
            label: "Stop server",
            id: "stop",
            click: () => {
                ipcMain.emit("stop");
            }
        },
        {
            label: "New client window",
            id: "new",
            click: () => {
                if (isServerRunning) {
                    options.openClient();
                }
            }
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            click: () => {
                options.app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip(settings.infos.productName);

    function updateMenu() {
        contextMenu.getMenuItemById("start").visible = !isServerRunning;
        contextMenu.getMenuItemById("stop").visible = isServerRunning;
        contextMenu.getMenuItemById("show").visible =
            !options.window.isVisible();
        contextMenu.getMenuItemById("hide").visible =
            options.window.isVisible();
        contextMenu.getMenuItemById("new").visible = isServerRunning;
        tray.setContextMenu(contextMenu);
    }

    ipcMain.on("start", function(e, options) {
        isServerRunning = true;
        updateMenu();
    });

    ipcMain.on("stop", function(e, options) {
        isServerRunning = false;
        updateMenu();
    });

    options.window.on("show", updateMenu);
    options.window.on("hide", updateMenu);

    return tray;
};
