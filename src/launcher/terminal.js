var { ipcRenderer } = require("electron"),
    ansiHTML = require("ansi-html"),
    html = require("nanohtml");

ansiHTML.setColors({
    magenta: "B48EAD",
    cyan: "81A1C1"
});

class Terminal {
    constructor(options) {
        this.content = DOM.get(options.selector)[0];
        this.autoSroll = true;
        this.length = 0;
        this.maxLength = 500;

        ipcRenderer.on("stdout", (e, msg) => {
            this.log(ansiHTML(msg), "log");
        });

        ipcRenderer.on("stderr", (e, msg) => {
            if (msg.includes("\n    at") && msg.split("\n    at").length > 2) {
                msg =
                    msg.replace(
                        "\n    at",
                        "<div class=\"trace\"><div class=\"trace-button\"></div>    at"
                    ) + "</div>";
            }
            this.log(ansiHTML(msg), "error");
        });

        this.content.addEventListener("click", (e) => {
            if (e.target.classList.contains("trace-button")) {
                e.target.parentNode.classList.toggle("show");
            }
        });
    }

    log(message, iclass = "") {
        var node = html`<div class="${iclass}"></div>`;
        node.innerHTML = message;

        this.content.appendChild(node);

        if (++this.length > this.maxLength) this.purge();

        if (this.autoSroll) {
            node.scrollIntoView();
        }
    }

    purge() {
        var children = [...this.content.children];
        for (var i = 0; i < this.maxLength / 2; i++) {
            this.content.removeChild(children[i]);
        }
        this.length = this.maxLength / 2 + 1;
    }

    clear() {
        this.content.innerHTML = "";
        this.length = 0;
    }
}

module.exports = new Terminal({ selector: "#osc-terminal" });
