var build = require("./build"),
    fs = require("fs"),
    path = require("path");

// Ensure output directory exists
var outputDir = path.resolve(__dirname + "/../app/launcher");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

build({
    input: "../src/launcher/index.js",
    output: "../app/launcher/open-stage-control-launcher.js",
    options: {
        debug: true,
        ignoreMissing: false,
        detectGlobals: false,
        bare: true,
        noParse: ["**/mathjs/dist/math.min.js"]
    },
    exclude: ["electron"]
})();
