module.exports = {
    // console
    console: "Terminal",
    console_enabled: "Włączony",
    console_clear: "Wyczyść terminal",

    // editor
    editor: "Edytor",
    editor_enabled: "Włączony",
    editor_grid: "Siatka",
    editor_tree: "Drzewo projekty",
    editor_inspector: "Inspektor",
    editor_percents: "Jednostki względne (%)",

    // editor context-menu
    editor_show_in_tree: "Pokaż w drzewie",
    editor_show_in_session: "Pokaż w sesji",
    editor_front: "Przenieś na pierwszy plan",
    editor_closer: "Przenieś wyżej",
    editor_back: "Przenieś na ostatni plan",
    editor_farther: "Przenieś niżej",
    editor_copy: "Kopiuj",
    editor_cut: "Wytnij",
    editor_paste: "Wklej",
    editor_pasteindent: "Wklej i zwiększ ID o 1",
    editor_clone: "Sklonuj",
    editor_addwidget: "Dodaj widget",
    editor_addtab: "Dodaj kartę",
    editor_delete: "Usuń",

    editor_fragment: "Fragment",
    editor_fragment_export: "Eksportuj",
    editor_fragment_import: "Importuj",

    editor_ace_help: "Pomoc",
    editor_ace_help_title: "Skróty klawiszowe edytora kodu",

    // loadings
    loading_upload: "Wysyłanie pliku…",
    loading_newclient: "Nowy klient podłączony…",
    loading_server: "Podłączanie do serwera…",
    loading_session: "Wczytywanie sesji…",

    // file
    file_open: "Otwórz",
    file_open_recent: "Ostatnio otwierane",
    file_open_recent_wait:
        "Lista nie jest jeszcze załadowana, zamknij i otwórz ponownie to menu",
    file_save: "Zapisz",
    file_save_as: "Zapisz jako…",
    file_backup: "Zapisz kopię zapasową",
    file_import: "Importuj",
    file_export: "Eksportuj",

    // keyboard
    keyboard: "Klawiatura wirtualna",
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
    fragment_mode: "Tryb fragmentów",
    fragment_mode_warning: "Tryb fragmentów włączony",
    fragment_mode_explanation:
        "Ta sesja zostanie zapisana jako fragment: tylko pierwsze dziecko roota zostanie zapisane.",

    // fullscreen
    fullscreen: "Tryb pełnoekranowy",
    fullscreen_unnavailable: "Tryb pełnoekranowy niedostęĻny",
    fullscreen_addtohome:
        "Musisz dodać tę stronę do Twojego ekranu domowego by otworzyć ja w trybie pełnoekranowym",

    // inspector
    inspector_error: "Wystąpił błąd, otwórz terminal by dowiedzieć się więcej.",
    inspector_zoom_in: "Przybliż",
    inspector_zoom_reset: "Domyślny stopień przybliżenia",
    inspector_zoom_ou: "Oddal",
    inspector_reset_selection: "Odznacz widget(y)",
    inspector_toggle_grid: "Pokaż/ukryj siatkę",

    // nosleep
    nosleep: "Nie pozwalaj na uśpienie ekranu",

    // notifications
    notifications: "Powiadomienia",

    // remote save
    remotesave_open: "Otwórz (na serwerze)",
    remotesave_save: "Sapisz (na serwerze)",
    remotesave_overwrite: "Ten plik już istnieje, czy chcesz go nadpisać?",
    remotesave_fail:
        "Ten plik nie mógł zostać zapisany na serwerze, użyj eksportu",
    remotesave_success: "Plik zapisany pomyślnie",
    remotesave_forbidden:
        "Nie masz uprawnień do zapisania pliku na serwerze, użyj eksportu",

    // server
    server_disconnected: "Połączenie z serwerem zostało przerwane",
    server_connected: "Połączenie z serwerem zostało nawiązane",

    // session
    session: "Sesja",
    session_new: "Nowa sesja",
    session_malformed: "Niewłaściwy plik sesji.",
    session_parsingerror: "Błąd parsowania pliku sesji.",
    session_uploaderror: "Nie udało się przesłać pliku sesji.",
    session_unsaved:
        "Jeśli zamkniesz tę sesję bez uprzedniego zapisu, wprowadzone zmiany zostaną utracone. Czy chcesz kontynuować?",
    session_oldversion_title: "Ostrzeżenie",
    session_oldversion:
        "Ta sesja została stworzona przy użyciu starszej wersji tego oprogramowania - dokonano automatycznej konwersji. Po zapisaniu, sesja ta prawdopodobnie nie będzie ładować się poprawnie ze starszymi wersjami, zaleca się wykonanie kopii bezpieczeństwa.",

    // state
    state: "Stan",
    state_store: "Zachowaj",
    state_recall: "Przywołaj",
    state_send: "Wyślij wszystkie",
    state_import: "Importuj",
    state_export: "Eksportuj",
    state_uploaderror: "Nie udało się przesłać pliku stanu.",
    state_storesuccess: "Zapisano stan",
    state_recallsuccess: "Przywołano stan",
    state_sendsuccess: "Wysłano stan",

    // tree
    tree_filter: "Filtruj",

    // misc
    error: "Błąd"
};
