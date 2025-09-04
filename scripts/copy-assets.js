var cpr = require("cpr"),
    fs = require("fs"),
    path = require("path");

// Ensure base app directory exists
var appDir = path.resolve(__dirname + "/../app");
if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
}

// Ensure required app subdirectories exist
var requiredDirs = [
    "/assets",
    "/assets/themes",
    "/assets/fonts",
    "/client",
    "/client/workers",
    "/docs",
    "/launcher",
    "/server"
];

requiredDirs.forEach((dir) => {
    var fullPath = path.resolve(appDir + dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

var files = [
    ["../src/index.js", "../app/index.js"],
    ["../resources/images/logo_nobadge.png", "../app/assets/favicon.png"],
    ["../resources/images/logo.png", "../app/assets/logo.png"],
    ["../resources/images/logo_tray.png", "../app/assets/logo_tray.png"],
    ["../resources/images/logo_tray@x2.png", "../app/assets/logo_tray@x2.png"],
    ["../LICENSE", "../app/LICENSE"],
    ["../src/python/", "../app/server/python/"],
    ["../resources/fonts/", "../app/assets/fonts/"],
    ["../src/html/launcher.html", "../app/launcher/index.html"],
    ["../node_modules/fsevents/fsevents.node", "../app/server/fsevents.node"],
    [
        "../node_modules/ace-builds/src-min/worker-css.js",
        "../app/client/workers/worker-css.js"
    ],
    [
        "../node_modules/ace-builds/src-min/worker-html.js",
        "../app/client/workers/worker-html.js"
    ],
    [
        "../node_modules/ace-builds/src-min/worker-javascript.js",
        "../app/client/workers/worker-javascript.js"
    ],
    ["../resources/docs/.htaccess", "../app/docs/.htaccess"]
];

if (process.platform === "darwin") {
    files.push([
        "../resources/images/logo_16x16.png",
        "../app/assets/logo_16x16.png"
    ]);
}

for (var i in files) {
    var [src, dest] = files[i].map((f) => path.resolve(__dirname + "/" + f));
    
    // Special handling for index.js to transform require path
    if (dest.endsWith("app/index.js")) {
        var content = fs.readFileSync(src, "utf8")
            .replace("./server/index", "./server/open-stage-control-server");
        fs.writeFileSync(dest, content);
    } else {
        cpr(src, dest, {
            overwrite: true
        });
    }
}

var packageJson = require("../package.json"),
    appJson = {},
    copiedProps = [
        "name",
        "productName",
        "description",
        "version",
        "author",
        "repository",
        "homepage",
        "license",
        "yargs",
        "engines"
    ];

for (var k of copiedProps) {
    appJson[k] = packageJson[k];
}

appJson.main = appJson.bin = "index.js";
appJson.scripts = {
    start: "electron index.js",
    "start-node": "node index.js"
};

appJson.optionalDependencies = {
    electron: packageJson.optionalDependencies.electron
};

fs.writeFileSync(
    path.resolve(__dirname + "/../app/package.json"),
    JSON.stringify(appJson, null, "  ")
);

var clientHtml = fs
    .readFileSync(path.resolve(__dirname + "/../src/html/client.html"))
    .toString()
    .replace(/\$\{([^\}]+)\}/g, (m, p1) => {
        return appJson[p1];
    });

fs.writeFileSync(
    path.resolve(__dirname + "/../app/client/index.html"),
    clientHtml
);
