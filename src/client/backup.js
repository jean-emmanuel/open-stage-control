var cache = require("./managers/cache"),
    localBackup = cache.get("backup", false);

module.exports = {
    exists: localBackup !== null,

    save: () => {
        var session = require("./managers/session/"),
            state = require("./managers/state"),
            editor = require("./editor/");

        if (session.session) {
            cache.set(
                "backup",
                {
                    session: session.session.data,
                    saveMode: session.saveMode,
                    sessionPath: session.sessionPath,
                    fragments: session.fragments,
                    state: state.get(),
                    history: editor.history,
                    historyState: editor.historyState,
                    editorEnabled: editor.enabled
                },
                false
            );
        }
    },

    load: () => {
        var session = require("./managers/session/"),
            state = require("./managers/state"),
            editor = require("./editor/"),
            ipc = require("./ipc/");

        if (localBackup) {
            var data = localBackup;

            cache.remove("backup", false);
            for (let k in data.fragments) {
                session.setFragment({
                    path: k,
                    fileContent: JSON.parse(data.fragments[k])
                });
            }
            session.load(data.session, () => {
                session.setSaveMode(data.saveMode);
                state.set(data.state, false);

                editor.clearHistory();
                editor.history = data.history;
                editor.historyState = data.historyState;

                if (data.editorEnabled) editor.enable();

                ipc.send("sessionSetPath", { path: data.sessionPath });
                session.setSessionPath(data.sessionPath);
            });
        }
    }
};
