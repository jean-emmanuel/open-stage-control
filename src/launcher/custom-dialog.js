const { dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

class CustomDialog {
    constructor() {
        this.isNativeDialogWorking = true; // Will be set to false if native dialog fails
    }

    async createCustomWindow(options) {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            },
            parent: options.parent,
            modal: true
        });

        // Load a basic HTML file dialog
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${options.title || "File Dialog"}</title>
                <style>
                    body { 
                        font-family: system-ui; 
                        padding: 20px;
                        background: #2a2a2a;
                        color: #fff;
                    }
                    input[type="file"] { 
                        width: 100%;
                        padding: 10px;
                        margin: 10px 0;
                        background: #333;
                        color: #fff;
                        border: 1px solid #444;
                    }
                    button {
                        padding: 8px 16px;
                        margin: 5px;
                        background: #444;
                        color: #fff;
                        border: 1px solid #555;
                        cursor: pointer;
                    }
                    button:hover {
                        background: #555;
                    }
                </style>
            </head>
            <body>
                <h3>${options.title || "Select File"}</h3>
                <input type="file" id="fileInput" ${options.properties.includes("openDirectory") ? "webkitdirectory" : ""} 
                    ${options.properties.includes("multiSelections") ? "multiple" : ""} 
                    accept="${
                        options.filters
                            ? options.filters
                                  .map((f) => f.extensions.map((e) => "." + e))
                                  .flat()
                                  .join(",")
                            : "*"
                    }">
                <br>
                <button onclick="confirm()">Confirm</button>
                <button onclick="cancel()">Cancel</button>
                <script>
                    const fileInput = document.getElementById('fileInput');
                    function confirm() {
                        const files = Array.from(fileInput.files).map(f => f.path);
                        window.postMessage({ type: 'files-selected', files });
                    }
                    function cancel() {
                        window.postMessage({ type: 'dialog-canceled' });
                    }
                </script>
            </body>
            </html>
        `;

        // Write the HTML to a temporary file
        const tempPath = path.join(app.getPath("temp"), "custom-dialog.html");
        fs.writeFileSync(tempPath, htmlContent);
        await win.loadFile(tempPath);

        return new Promise((resolve) => {
            win.webContents.on("message", (event, data) => {
                if (data.type === "files-selected") {
                    win.close();
                    resolve({ canceled: false, filePaths: data.files });
                } else if (data.type === "dialog-canceled") {
                    win.close();
                    resolve({ canceled: true, filePaths: [] });
                }
            });

            win.on("closed", () => {
                resolve({ canceled: true, filePaths: [] });
                fs.unlinkSync(tempPath);
            });
        });
    }

    async showOpenDialog(options) {
        if (this.isNativeDialogWorking) {
            try {
                const result = await dialog.showOpenDialog(options);
                return result;
            } catch (error) {
                console.log(
                    "Native dialog failed, falling back to custom implementation"
                );
                this.isNativeDialogWorking = false;
            }
        }

        return this.createCustomWindow(options);
    }

    async showSaveDialog(options) {
        if (this.isNativeDialogWorking) {
            try {
                const result = await dialog.showSaveDialog(options);
                return result;
            } catch (error) {
                console.log(
                    "Native dialog failed, falling back to custom implementation"
                );
                this.isNativeDialogWorking = false;
            }
        }

        // For save dialogs, we'll modify the custom window slightly
        options.title = options.title || "Save File";
        const result = await this.createCustomWindow(options);

        // If user selected a file, we'll use that as the save location
        if (!result.canceled && result.filePaths.length > 0) {
            result.filePath = result.filePaths[0];
        }

        return result;
    }
}

module.exports = new CustomDialog();
