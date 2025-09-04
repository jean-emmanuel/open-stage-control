var browserify = require("browserify"),
    exorcist = require("exorcist"),
    licensify = require("licensify"),
    fs = require("fs"),
    path = require("path");

module.exports = (opt) => {
    var { input, output, options, ignore, exclude, transforms, plugins } = opt,
        inputPath = path.resolve(__dirname + "/" + input),
        outputPath = path.resolve(__dirname + "/" + output),
        b;

    if (!plugins) plugins = [];
    if (!plugins.includes(licensify)) plugins.push(licensify);

    b = browserify(inputPath, options);

    if (ignore) b.ignore(ignore);
    if (exclude) b.exclude(exclude);

    for (var plugin of plugins) {
        b.plugin(plugin);
    }

    if (transforms) {
        for (var transform of transforms) {
            var [t, opts] = transform;
            b.transform(t, opts);
        }
    }

    function bundle() {
        // Ensure output directory exists
        var outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        var output = b.bundle();

        var toWrite = output.pipe(exorcist(outputPath + ".map"));
        toWrite.pipe(fs.createWriteStream(outputPath));

        return output;
    }

    bundle.b = b;

    return bundle;
};
