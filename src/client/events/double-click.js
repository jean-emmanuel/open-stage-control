module.exports = (element, callback, options = {}) => {
    var lastTapTime = 0,
        lastTapX,
        lastTapY;

    element.addEventListener(
        options.click ? "click" : "fast-click",
        (event) => {
            if (event.capturedByEditor && !options.ignoreEditorCapture) return;

            var tapTime = Date.now(),
                tapLength = tapTime - lastTapTime,
                eventData = options.click ? event : event.detail;

            if (
                tapLength < DOUBLE_TAP_TIME &&
                Math.abs(lastTapX - eventData.pageX) < 20 &&
                Math.abs(lastTapY - eventData.pageY) < 20 &&
                (!options.click || event.pageX !== 0) // prevent fake click emitted with keyboard focus events
            ) {
                // execute callback at next cycle to ensure draginit events are resolved first
                setTimeout(() => {
                    callback(event.detail);
                }, 0);
                lastTapTime = 0;

                // prevent touchend
                if (!options.click) event.detail.preventOriginalEvent = true;
            } else {
                lastTapTime = tapTime;
                lastTapX = eventData.pageX;
                lastTapY = eventData.pageY;
            }
        }
    );
};
