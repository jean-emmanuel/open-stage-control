require("./zoom");
require("../events/click");
require("./ios");
require("./notifications");
require("./ui-workspace");
require("./main-menu");
require("./ui-console");
require("./utils").updateMobileThemeColor();

if (!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
    require("./ui-keyboard");
}
