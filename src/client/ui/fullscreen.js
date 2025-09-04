var screenfull = require("screenfull"),
    UiModal = require("./ui-modal"),
    locales = require("../locales"),
    iOS = require("./ios");

var fullscreen;

if (screenfull.isEnabled && !iOS) {
    fullscreen = screenfull;
} else {
    class IOSFullScreen {
        constructor() {
            this.enabled = !navigator.standalone;
            this.isFullScreen = navigator.standalone;
        }

        toggle() {
            new UiModal({
                title: locales("fullscreen_unnavailable"),
                content: locales("fullscreen_addtohome"),
                closable: true
            });
        }

        on() {}
    }

    fullscreen = new IOSFullScreen();
}

window.ELECTRON_FULLSCREEN = () => {
    fullscreen.toggle();
};

module.exports = fullscreen;
