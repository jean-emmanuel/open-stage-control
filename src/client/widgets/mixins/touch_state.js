module.exports = (self, options) => {
    if (self.parent.preventChildrenTouchState) return;

    self.touched = 0;
    self.setValueTouchedQueue = undefined;

    self.on(
        "draginit",
        (e) => {
            self.setValueTouchedQueue = undefined;

            if (self.shouldDrag && !self.shouldDrag(e)) {
                e.cancelDragEvent = true;
                return;
            }
            self.touched += 1;
            if (self.touched == 1) {
                self.trigger("touch", { stopPropagation: true, touch: 1 });
            }
        },
        options
    );

    self.on(
        "dragend",
        (e) => {
            if (self.touched == 1) {
                self.touched = 0;

                if (self.setValueTouchedQueue !== undefined) {
                    self.setValue(...self.setValueTouchedQueue);
                    self.setValueTouchedQueue = undefined;
                }

                self.trigger("touch", { stopPropagation: true, touch: 0 });
            } else if (self.touched > 1) {
                self.touched -= 1;
            }
        },
        options
    );

    self.onRemove = () => {
        if (self.touched > 0) {
            self.setValueTouchedQueue = undefined;
            self.trigger("touch", { stopPropagation: true, touch: 0 });
        }
        self.__proto__.onRemove.call(self);
    };
};
