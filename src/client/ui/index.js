var UiSidePanel = require("./ui-sidepanel"),
    locales = require("../locales");

module.exports = {
    leftUiSidePanel: new UiSidePanel({
        selector: "osc-panel-container.left",
        label: locales("editor_tree")
    }),
    rightUiSidePanel: new UiSidePanel({
        selector: "osc-panel-container.right",
        label: locales("editor_inspector")
    })
};
