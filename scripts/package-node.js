var cpr = require("cpr"),
    path = require("path"),
    files = ["../app", "../dist/open-stage-control-node"];

cpr(
    ...files.map((f) => path.resolve(__dirname + "/" + f)),
    {
        filter: /node_modules\/(serialport|uws)/,
        overwrite: true
    },
    () => {
        console.warn(
            "\x1b[36m%s\x1b[0m",
            "=> Build artifacts created in " +
                path.resolve(__dirname + "/../dist")
        );
    }
);
