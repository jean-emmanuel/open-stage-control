module.exports = {
    // console
    console: "Konsole",
    console_enabled: "Aktiv",
    console_clear: "Konsole leeren",

    // editor
    editor: "Editor",
    editor_enabled: "Aktiv",
    editor_grid: "Raster",
    editor_tree: "Projektbaum",
    editor_inspector: "Inspektor",
    editor_percents: "Relative Einheiten (%)",

    // editor context-menu
    editor_show_in_tree: "Zeige in Baum",
    editor_show_in_session: "Zeige in Sitzung",
    editor_front: "In den Vordergrund",
    editor_closer: "Eine Ebene nach vorne",
    editor_back: "In den Hintergrund",
    editor_farther: "Eine Ebene nach hinten",
    editor_copy: "Kopieren",
    editor_cut: "Ausschneiden",
    editor_paste: "Einfügen",
    editor_pasteindent: "ID + 1",
    editor_clone: "Duplizieren",
    editor_addwidget: "Widget hinzufügen",
    editor_addtab: "Tab hinzufügen",
    editor_delete: "Löschen",

    editor_fragment: "Fragment",
    editor_fragment_export: "Export",
    editor_fragment_import: "Import",

    editor_ace_help: "Hilfe",
    editor_ace_help_title: "Tastenkombinationen für den Code-Editor",

    // loadings
    loading_upload: "Datei wird hochgeladen…",
    loading_newclient: "Neuer Client verbindet sich…",
    loading_server: "Server verbinden…",
    loading_session: "Sitzung laden…",

    // file
    file_open: "Öffnen",
    file_open_recent: "Kürzlich geöffnet",
    file_open_recent_wait:
        "Liste noch nicht geladen, bitte schließen Sie das Menü und öffnen Sie es erneut",
    file_save: "Speichern",
    file_save_as: "Speichern unter…",
    file_backup: "Backup speichern",
    file_import: "Importieren",
    file_export: "Exportieren",

    // keyboard
    keyboard: "Virtuelle Tastatur",
    keyboard_layout: {
        default: [
            "{esc} ` 1 2 3 4 5 6 7 8 9 0 - = {zrck}",
            "{tab} q w e r t z u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            "{leer}"
        ],
        shift: [
            "{esc} ~ ! @ # $ % ^ & * ( ) _ + {zrck}",
            "{tab} Q W E R T Y U I O P { } |",
            "{lock} A S D F G H J K L : \" {enter}",
            "{shift} Z X C V B N M < > ? {shift}",
            "{leer}"
        ]
    },
    keyboard_escape: "Esc",

    // fragment mode
    fragment_mode: "Fragment Modus",
    fragment_mode_warning: "Fragment Modus aktiviert",
    fragment_mode_explanation:
        "Die Sitzung wird als Fragment gespeichert: nur das erste untergeordnete Element von root wird gespeichert.",

    // fullscreen
    fullscreen: "Vollbild",
    fullscreen_unnavailable: "Vollbild nicht verfügbar",
    fullscreen_addtohome:
        "Sie müssen diese Seite zu Ihrem Startbildschirm hinzufügen, um sie im Vollbildmodus zu starten",

    // inspector
    inspector_error:
        "Es ist ein Fehler aufgetreten. Öffne die Konsole, um mehr zu lesen.",
    inspector_zoom_in: "Vergrößern",
    inspector_zoom_reset: "Zoom zurücksetzen",
    inspector_zoom_ou: "Verkleinern",
    inspector_reset_selection: "Widget(s) abwählen",
    inspector_toggle_grid: "Raster ein-/ausblenden",

    // nosleep
    nosleep: "Prevent sleep",

    // notifications
    notifications: "Benachrichtigungen",

    // remote save
    remotesave_open: "Öffnen (auf dem Server)",
    remotesave_save: "Speichern (auf dem Server)",
    remotesave_overwrite:
        "Diese Datei existiert bereits, möchtest du sie überschreiben?",
    remotesave_fail:
        "Die Datei konnte nicht auf dem Server gespeichert werden, verwende stattdessen \"export\".",
    remotesave_success: "Datei erfolgreich gespeichert",
    remotesave_forbidden:
        "Speichern auf dem Server nicht möglich, verwende stattdessen \"exportieren\".",

    // server
    server_disconnected: "Die Verbindung zum Server ist unterbrochen worden",
    server_connected: "Die Verbindung zum Server wurde wiederhergestellt",

    // session
    session: "Sitzung",
    session_new: "Neue Sitzung",
    session_malformed: "Fehlerhafte Sitzungsdatei.",
    session_parsingerror: "Fehler beim Parsing.",
    session_uploaderror: "Hochladen der Sitzungsdatei fehlgeschlagen.",
    session_unsaved:
        "Die Änderungen gehen verloren, wenn du diese Sitzung schließt, ohne zu speichern. Fortfahren?",
    session_oldversion_title: "Warnung",
    session_oldversion:
        "Diese Sitzung wurde mit einer älteren Version dieser Software erstellt - eine automatische Konvertierung wurde durchgeführt. Nach dem Speichern wird diese Sitzung wahrscheinlich nicht korrekt mit älteren Versionen geladen, es wird empfohlen, eine Sicherungskopie davon zu erstellen.",

    // state
    state: "Status",
    state_store: "Laden",
    state_recall: "Abrufen",
    state_send: "Alle senden",
    state_import: "Import",
    state_export: "Export",
    state_uploaderror: "Hochladen der Statusdatei fehlgeschlagen.",
    state_storesuccess: "Status gespeichert",
    state_recallsuccess: "Status abgerufen",
    state_sendsuccess: "Status gesendet",

    // tree
    tree_filter: "Filter",

    // misc
    error: "Error"
};
