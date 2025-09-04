var { resolvePath, ipc } = require("./server"),
    callbacks = require("./callbacks"),
    chokidar = require("chokidar");

class FragmentManager {
    constructor() {
        this.fragments = {}; // fragment files contents
        this.watchers = {}; // fragment files watchers
        this.clients = {}; // client ids for each watched fragment file
    }

    read(path, raw, clientId, then) {
        callbacks.fileRead(
            { path: path, raw: raw },
            clientId,
            true,
            (result) => {
                this.fragments[path] = result;
                then(result);
            },
            (error) => {
                ipc.send(
                    "errorLog",
                    `Could not open fragment file:\n ${error}`,
                    clientId
                );
                ipc.send("fragmentLoad", { path: path, notFound: true });
                this.deleteFragment(path);
            }
        );
    }

    loadFragment(data, clientId) {
        var path = data.path;
        var resolvedPath = resolvePath(path, clientId);

        if (!resolvedPath) {
            ipc.send("fragmentLoad", { path: path, notFound: true });
            return;
        }

        if (!this.clients[resolvedPath]) this.clients[resolvedPath] = [];
        if (!this.clients[resolvedPath].includes(clientId))
            this.clients[resolvedPath].push(clientId);

        if (!this.fragments[resolvedPath]) {
            this.fragments[resolvedPath] = "LOADING";

            this.read(resolvedPath, data.raw, clientId, (result) => {
                ipc.send(
                    "fragmentLoad",
                    {
                        path: path,
                        fileContent: this.fragments[resolvedPath],
                        raw: data.raw
                    },
                    clientId
                );
            });

            this.watchers[resolvedPath] = chokidar
                .watch(resolvedPath, {
                    awaitWriteFinish: { stabilityThreshold: 200 }
                })
                .on("change", () => {
                    this.read(resolvedPath, data.raw, clientId, (result) => {
                        for (let id of this.clients[resolvedPath]) {
                            ipc.send(
                                "fragmentLoad",
                                {
                                    path: path,
                                    fileContent: this.fragments[resolvedPath],
                                    raw: data.raw
                                },
                                id
                            );
                        }
                    });
                })
                .on("unlink", () => {
                    this.deleteFragment(resolvedPath);
                });
        } else if (this.fragments[resolvedPath] !== "LOADING") {
            ipc.send(
                "fragmentLoad",
                {
                    path: path,
                    fileContent: this.fragments[resolvedPath],
                    raw: data.raw
                },
                clientId
            );
        }
    }

    deleteFragment(path) {
        this.watchers[path].close();
        delete this.clients[path];
        delete this.fragments[path];
        delete this.fragments[path];
    }
}

module.exports = new FragmentManager();
