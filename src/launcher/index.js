require("../client/globals");

document.addEventListener("DOMContentLoaded", function(event) {
    DOM.init();
    require("../client/events/event-emitter");
    require("../client/ui/ui-workspace");
    require("../client/ui/zoom");

    setTimeout(() => {
        require("./main");
    }, 10);
});
