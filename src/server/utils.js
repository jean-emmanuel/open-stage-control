module.exports = {
    deepCopy: function(obj) {
        var copy = obj;

        if (obj === null) {
            return obj;
        }

        if (typeof obj === "object") {
            copy = Array.isArray(obj) ? [] : {};
            for (let key in obj) {
                copy[key] = module.exports.deepCopy(obj[key]);
            }
        }

        return copy;
    },

    resolveHomeDir: function(p) {
        // Resolve '~' to user's home directory
        if (!p) return "";
        return String(p).replace(
            /^(~|\/~)/,
            process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"]
        );
    }
};
