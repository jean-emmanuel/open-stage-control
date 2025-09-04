var fs = require("fs"),
    path = require("path"),
    settings = require("./settings"),
    chokidar = require("chokidar"),
    ipc;

class Theme {
    constructor() {
        this.themes = [];
        this.files = [];
        this.css = [];
        this.watcher = null;

        this.defaultColor = "#151a24";
        this.backgroundColor = this.defaultColor;
    }

    init() {
        this.themes = settings.read("theme") || [];
        this.files = [];

        if (!this.themes.length) return this;

        if (this.themes.length > 1 && fs.existsSync(this.themes.join(" "))) {
            this.files.push(this.themes.join(" "));
        } else {
            for (let theme of this.themes) {
                if (theme.includes(".css") && fs.existsSync(theme)) {
                    this.files.push(theme);
                } else if (
                    !theme.includes(".css") &&
                    fs.existsSync(
                        path.resolve(
                            __dirname + "/../assets/themes/" + theme + ".css"
                        )
                    )
                ) {
                    this.files.push(
                        path.resolve(
                            __dirname + "/../assets/themes/" + theme + ".css"
                        )
                    );
                } else {
                    console.error("(ERROR) Theme not found: \"" + theme);
                }
            }
        }

        if (this.files.length) {
            this.watcher = chokidar
                .watch(this.files, {
                    awaitWriteFinish: { stabilityThreshold: 200 }
                })
                .on("change", () => {
                    if (!ipc) ipc = require("./server").ipc;
                    this.load();
                    ipc.send("reloadCss");
                });
        }

        this.load();

        return this;
    }

    load() {
        this.css = [];

        for (let i in this.files) {
            try {
                this.css.push(fs.readFileSync(this.files[i], "utf-8"));
            } catch (err) {
                console.error("(ERROR) Could not load theme \"" + this.files[i]);
            }
        }

        var css = this.get();

        if (css.includes("--color-background:")) {
            this.backgroundColor = css
                .match(/--color-background:([^;\n]*)/)[1]
                .trim();
        } else {
            this.backgroundColor = this.defaultColor;
        }

        return this;
    }

    get() {
        return this.css.join("\n");
    }
}

var theme = new Theme();

module.exports = theme;
