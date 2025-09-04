module.exports = {
    // console
    console: "Console",
    console_enabled: "Enabled",
    console_clear: "Clear console",

    // editor
    editor: "Editor",
    editor_enabled: "Enabled",
    editor_grid: "Grid",
    editor_tree: "Project tree",
    editor_inspector: "Inspector",
    editor_percents: "Relative units (%)",

    // editor context-menu
    editor_show_in_tree: "Show in tree",
    editor_show_in_session: "Show in session",
    editor_front: "Bring to front",
    editor_closer: "Bring closer",
    editor_back: "Send to back",
    editor_farther: "Send farther",
    editor_copy: "Copy",
    editor_cut: "Cut",
    editor_paste: "Paste",
    editor_pasteindent: "ID + 1",
    editor_clone: "Clone",
    editor_addwidget: "Add widget",
    editor_addtab: "Add tab",
    editor_delete: "Delete",

    editor_fragment: "Fragment",
    editor_fragment_export: "Export",
    editor_fragment_import: "Import",

    editor_ace_help: "Help",
    editor_ace_help_title: "Code editor keyboard shortcuts",

    // loadings
    loading_upload: "Uploading file…",
    loading_newclient: "New client connecting…",
    loading_server: "Connecting server…",
    loading_session: "Loading session…",

    // file
    file_open: "Open",
    file_open_recent: "Open recent",
    file_open_recent_wait:
        "List not loaded yet, please close and reopen the menu",
    file_save: "Save",
    file_save_as: "Save as…",
    file_backup: "Save backup",
    file_import: "Import",
    file_export: "Export",

    // keyboard
    keyboard: "Virtual keyboard",
    keyboard_layout: {
        default: [
            "{esc} ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            "{space}"
        ],
        shift: [
            "{esc} ~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            "{lock} A S D F G H J K L : \" {enter}",
            "{shift} Z X C V B N M < > ? {shift}",
            "{space}"
        ]
    },
    keyboard_escape: "Esc",

    // fragment mode
    fragment_mode: "Fragment mode",
    fragment_mode_warning: "Fragment mode enabled",
    fragment_mode_explanation:
        "The session will be saved as a fragment: only the first child of root will be saved.",

    // fullscreen
    fullscreen: "Fullscreen",
    fullscreen_unnavailable: "Fullscreen not available",
    fullscreen_addtohome:
        "You must add this page to your home screen to launch it in fullscreen",

    // inspector
    inspector_error: "An error just occurred, open the console to read more.",
    inspector_zoom_in: "Zoom in",
    inspector_zoom_reset: "Reset zoom",
    inspector_zoom_ou: "Zoom out",
    inspector_reset_selection: "Unselect widget(s)",
    inspector_toggle_grid: "Show/hide the grid",

    // nosleep
    nosleep: "Prevent sleep",

    // notifications
    notifications: "Notifications",

    // remote save
    remotesave_open: "Open (on the server)",
    remotesave_save: "Save (on the server)",
    remotesave_overwrite:
        "This file already exists, do you want to overwrite it?",
    remotesave_fail:
        "The file could not be saved on the server, use \"export\" instead",
    remotesave_success: "File saved successfully",
    remotesave_forbidden:
        "You're note allowed to save on server, use \"export\" instead",

    // server
    server_disconnected: "The connection to the server has been interrupted",
    server_connected: "The connection to the server has been restored",

    // session
    session: "Session",
    session_new: "New session",
    session_malformed: "Malformed session file.",
    session_parsingerror: "Parsing error.",
    session_uploaderror: "Failed to upload session file.",
    session_unsaved:
        "Your changes will be lost if you close this session without saving, continue?",
    session_oldversion_title: "Warning",
    session_oldversion:
        "This session was created with an older version of this software, an automatic conversion has been done. Once saved, this session will probably not load correctly with older versions, it is recommended to make a backup copy of it.",

    // state
    state: "State",
    state_store: "Store",
    state_recall: "Recall",
    state_send: "Send All",
    state_import: "Import",
    state_export: "Export",
    state_uploaderror: "Failed to upload state file.",
    state_storesuccess: "State saved",
    state_recallsuccess: "State recalled",
    state_sendsuccess: "State sent",

    // tree
    tree_filter: "Filter",

    // misc
    error: "Error"
};
