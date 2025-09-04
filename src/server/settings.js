var path = require("path"),
    fs = require("fs"),
    yargs = require("yargs"),
    infos = require("../../package.json"),
    options = require("./options"),
    address = require("./address"),
    argv = process.argv.slice();

// Note : on windows, electron stops parsing after the first argument containing a colon
// https://github.com/electron/electron/pull/13039
// windows cli users need to add a double dash (--) before their options to avoid that
// it must be stripped to let yargs work normally

// rmeove all args before the first actual cli arg
while (argv.length) {
    if (argv[0][0] != "-" || argv[0] == "--") {
        argv.splice(0, 1);
    } else if (argv[0][0] == "-") {
        break;
    }
}

argv = yargs(argv)
    .parserConfiguration({ "boolean-negation": false })
    .help("help")
    .usage("\nUsage:\n  $0 [options]")
    .alias("h", "help")
    .options(options)
    .check((argv) => {
        var err = [];
        for (key in options) {
            if (options[key].check && argv[key] != undefined) {
                var c = options[key].check(argv[key], argv);
                if (c !== true) {
                    err.push(`-${key}: ${c}`);
                }
            }
        }
        return err.length ? err.join("\n") : true;
    })
    .strict()
    .version(infos.version)
    .alias("v", "version");

argv = argv.argv;
delete argv._;
delete argv.$0;

// clean argv
var optNames = [],
    cliOnly = [];

for (let k in options) {
    var name = options[k].alias || k;
    optNames.push(name);
    if (options[k].launcher === false) {
        cliOnly.push(name);
    }
}

for (var i in argv) {
    if (argv[i] === false || !optNames.includes(i)) {
        delete argv[i];
    }
}
delete argv._;
delete argv.$0;

// are we in a terminal ?
var cli = false;
for (let i in argv) {
    if (!cliOnly.includes(i)) cli = true;
}
if (!process.versions.electron || process.env.ELECTRON_RUN_AS_NODE) {
    cli = true;
}

var settings = {
    options: argv,
    recentSessions: [],
    checkForUpdates: true
};

// store cli-only options (read-only)
for (let k in argv) {
    if (options[k] && options[k].launcher === false) {
        settings[k] = argv[k];
    }
}

///////////////// config paths

var baseDir,
    configPath,
    configPathExists = true,
    config = {};

if (argv["cache-dir"]) {
    baseDir = path.isAbsolute(argv["cache-dir"])
        ? argv["cache-dir"]
        : path.resolve(process.cwd(), argv["cache-dir"]);
} else {
    envPaths = require("env-paths");
    baseDir = envPaths(infos.name, {
        suffix: ""
    }).config;
}

if (!fs.existsSync(baseDir)) {
    try {
        fs.mkdirSync(baseDir);
    } catch (e) {
        configPathExists = false;
        console.error("(ERROR) Could not create config folder:" + baseDir);
        console.error(e);
    }
}

if (configPathExists) {
    if (argv["config-file"]) {
        configPath = path.isAbsolute(argv["config-file"])
            ? argv["config-file"]
            : path.resolve(process.cwd(), argv["config-file"]);
    } else {
        configPath = path.join(baseDir, "config.json");
    }
    if (fs.existsSync(configPath)) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch (e) {
            console.error(
                "(ERROR) Could not read config from file:" + configPath
            );
            console.error(e);
        }
    } else {
        try {
            fs.writeFileSync(configPath, "{}");
        } catch (e) {
            console.error("(ERROR) Could not create config file:" + configPath);
            console.error(e);
        }
    }
    if (cli) {
        for (let k in config) {
            if (k === "options") continue;
            settings[k] = config[k];
        }
    } else {
        for (let k in config) {
            if (k === "options") {
                Object.assign(config.options, settings.options);
            }
            settings[k] = config[k];
        }
    }
}

if (!configPath) {
    console.warn(
        "(WARNING) Config directory not found, settings and session history will not be saved."
    );
}

/////////////////

module.exports = {
    options: options,
    read: function(key) {
        return settings.options[key] !== undefined
            ? settings.options[key]
            : settings[key];
    },
    write: function(key, value, tmp, sync) {
        settings[key] = value;

        if (!tmp && configPathExists) {
            if (process.send) {
                // server running as child process of launcher
                // -> just pass the modification to the launcher process
                process.send(["settings.write", [key, value]]);
            } else {
                config[key] = value;
                if (config.options) {
                    // don't save cli-only options
                    for (var k in config.options) {
                        if (options[k] && options[k].launcher === false) {
                            delete config.options[k];
                        }
                    }
                }
                if (sync) {
                    fs.writeFileSync(
                        configPath,
                        JSON.stringify(config, null, 4)
                    );
                } else {
                    fs.writeFile(
                        configPath,
                        JSON.stringify(config, null, 4),
                        function(err, data) {
                            if (err) throw err;
                        }
                    );
                }
            }
        }

        // we are in launcher process -> update server process' config
        if (global.serverProcess) {
            global.serverProcess.send(["settings.write", [key, value]]);
        }
    },
    cli: cli,
    configPath: baseDir,
    infos: infos,
    appAddresses: () =>
        address(
            module.exports.read("use-ssl") ? "https://" : "http://",
            settings.options.port || 8080
        )
};

if (process.send) {
    // server running as child process of launcher
    // update local config when the main config is modified
    process.on("message", function(data) {
        var [command, args] = data;
        if (command === "settings.write") {
            module.exports.write(args[0], args[1], true);
        }
    });
}
