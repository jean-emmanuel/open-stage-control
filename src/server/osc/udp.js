var osc = require("./osc"),
    settings = require("../settings"),
    zeroconf = require("../zeroconf"),
    oscInPort = settings.read("osc-port") || settings.read("port") || 8080;

var oscUDPServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscInPort,
    metadata: true,
    broadcast: true
});

oscUDPServer.on("error", function(e) {
    if (e.code === "EADDRINUSE") {
        console.error(
            `(ERROR, UDP) could not open port ${oscInPort} (already in use) `
        );
    } else {
        console.error("(ERROR, UDP)", e);
    }
});

zeroconf.publish({
    name:
        settings.infos.productName +
        (settings.read("instance-name")
            ? " (" + settings.read("instance-name") + ")"
            : ""),
    protocol: "udp",
    type: "osc",
    port: oscInPort
});

module.exports = oscUDPServer;
