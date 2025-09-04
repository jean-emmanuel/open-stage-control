var sass = require("sass"),
    path = require("path"),
    fs = require("fs");

var indir = path.resolve(__dirname + "/../src/scss/"),
    outdir = path.resolve(__dirname + "/../app/assets/");

// Ensure output directories exist
if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
}
if (!fs.existsSync(outdir + "/themes")) {
    fs.mkdirSync(outdir + "/themes", { recursive: true });
}

fs.readdirSync(indir + "/themes/").forEach((file) => {
    if (file.includes(".scss") && file !== "default.scss") {
        let result = sass.renderSync({
            file: indir + "/themes/" + file,
            outputStyle: "compressed",
            silenceDeprecations: [
                "mixed-decls",
                "slash-div",
                "import",
                "legacy-js-api"
            ]
        });

        fs.writeFileSync(
            outdir + "/themes/" + file.split("/").pop().replace("scss", "css"),
            result.css
        );
    }
});

var result = sass.renderSync({
    file: indir + "/index.scss",
    outFile: outdir + "/open-stage-control.css",
    outputStyle: "compressed",
    sourceMap: true,
    silenceDeprecations: ["mixed-decls", "slash-div", "import", "legacy-js-api"]
});

fs.writeFileSync(outdir + "/open-stage-control.css", result.css);
fs.writeFileSync(outdir + "/open-stage-control.css.map", result.map);

if (process.argv.includes("--reload")) {
    var WS = require("../node_modules/ws");

    var ipc = new WS("ws://127.0.0.1:8080/dev/");

    ipc.on("error", () => {});
    ipc.on("open", () => {
        ipc.send('["reloadCss"]');
        process.exit();
    });
}
