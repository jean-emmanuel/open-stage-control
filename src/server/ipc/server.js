var EventEmitter = require("events").EventEmitter,
    WebSocketServer = require("ws").Server,
    Client = require("./client"),
    settings = require("../settings");

class Ipc extends EventEmitter {
    constructor(server) {
        super();

        this.clients = {};
        this.server = null;

        this.server = new WebSocketServer({ server: server });

        this.server.on("connection", (socket, req) => {
            var url = req.url.split("/"),
                auth = url.pop().replace("_", "/"),
                id = url.pop();

            if (settings.read("authentication")) {
                if (
                    settings.read("authentication") !==
                    Buffer.from(auth, "base64").toString()
                ) {
                    console.log(
                        `(WARNING) Client connexion refused for ${req.connection.remoteAddress} (authentication failed)`
                    );
                    socket.close();
                    return;
                }
            }

            if (!id) return;

            id = decodeURI(id);

            if (!this.clients[id]) {
                var client = new Client(
                    socket,
                    id,
                    req.connection.remoteAddress
                );
                this.clients[id] = client;

                this.emit("connection", client);

                client.on("destroyed", () => {
                    delete this.clients[id];
                });
            } else {
                this.clients[id].open(socket);
                this.clients[id].flush();
            }

            this.clients[id].emit("created");
        });
    }

    send(event, data, id, except) {
        var clients = id ? [this.clients[id]] : this.clients;

        for (var k in clients) {
            if (!except || this.clients[k] != this.clients[except]) {
                if (clients[k]) clients[k].send(event, data);
            }
        }
    }
}

module.exports = Ipc;
