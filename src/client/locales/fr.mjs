export default {

    // console
    console: 'Console',
    console_enabled: 'Activée',
    console_clear: 'Vider la console',

    // editor
    editor: 'Editeur',
    editor_enabled: 'Activé',
    editor_grid: 'Grille',
    editor_tree: 'Arborescence',
    editor_inspector: 'Inspecteur',
    editor_percents: 'Unités relatives (%)',

    // editor context-menu
    editor_show_in_tree: 'Voir dans l\'arborescence',
    editor_show_in_session: 'Voir dans la session',
    editor_front: 'Amener devant',
    editor_closer: 'Amener plus près',
    editor_back: 'Envoyer à l\'arrière',
    editor_farther: 'Envoyer plus loin',
    editor_copy: 'Copier',
    editor_cut: 'Couper',
    editor_paste: 'Coller',
    editor_pasteindent: 'ID + 1',
    editor_clone: 'Clone',
    editor_addwidget: 'Ajouter widget',
    editor_addtab: 'Ajouter onglet',
    editor_delete: 'Supprimer',

    editor_fragment: 'Fragment',
    editor_fragment_export: 'Exporter',
    editor_fragment_import: 'Importer',

    editor_ace_help: 'Aide',
    editor_ace_help_title: 'Raccourcis claviers de l\'éditeur',

    // loadings
    loading_upload: 'Téléversement…',
    loading_newclient: 'Connexion d\'un nouveau client…',
    loading_server: 'Connexion au serveur…',
    loading_session: 'Chargement de la session…',

    // file
    file_open: 'Ouvrir',
    file_open_recent: 'Récemment ouvert(s)',
    file_open_recent_wait: 'Liste non chargée, veuillez fermer puis ouvrir le menu à nouveau',
    file_save: 'Enregistrer',
    file_save_as: 'Enregistrer sous…',
    file_backup: 'Enregistrer une sauvegarde',
    file_import: 'Importer',
    file_export: 'Exporter',

    // keyboard
    keyboard: 'Clavier virtuel',
    keyboard_layout: {
        default: [
            '{esc} \u00B2 & \u00E9 \" \' ( - \u00E8 _ \u00E7 \u00E0 ) = {bksp}',
            '{tab} a z e r t y u i o p ^ $',
            '{lock} q s d f g h j k l m \u00F9 * {enter}',
            '{shift} < w x c v b n , ; : ! {shift}',
            '{space}',
        ],
        shift: [
            '{esc} ` 1 2 3 4 5 6 7 8 9 0 \u00B0 + {bksp}',
            '{tab} A Z E R T Y U I O P \u00A8 \u00A3',
            '{lock} Q S D F G H J K L M % \u00B5 {enter}',
            '{shift} > W X C V B N ? . / \u00A7 {shift}',
            '{space}'
        ]
    },
    keyboard_escape: 'Échap',

    // fullscreen
    fullscreen: 'Plein écran',
    fs_unnavailable: 'Plein écran indisponible',
    fs_addtohome: 'Vous devez ajouter cette page à votre écran d\'accueil pour pouvoir l\'ouvrir en plein écran.',

    // fragment mode
    fragment_mode: 'Mode fragment',
    fragment_mode_warning: 'Mode fragment activé',
    fragment_mode_explanation: 'La session sera enregistrée sous forme de fragment : seul le premier descendant de l\'élément root sera sauvegardé.',

    // inspector
    inspector_error: 'Une erreur vient de survenir, ouvrez la console pour en savoir plus.',
    inspector_zoom_in: 'Zoom avant',
    inspector_zoom_reset: 'Zoom initial',
    inspector_zoom_out: 'Zoom arrière',
    inspector_reset_selection: 'Déséléctionner',
    inspector_toggle_grid: 'Afficher / masquer la grille',


    // nosleep
    nosleep: 'Empêcher la veille',

    // notifications
    notifications: 'Notifications',

    // remote save
    remotesave_open: 'Ouvrir (sur le serveur)',
    remotesave_save: 'Enregistrer (sur le serveur)',
    remotesave_overwrite: 'Un fichier du même nom existe déjà, voulez le remplacer ?',
    remotesave_fail: 'Le fichier n\'a pas pu être enregistré sur le serveur, utilisez la fonction "exporter"',
    remotesave_success: 'Le fichier a été enregistré avec succès',
    remotesave_forbidden: 'Vous n\'êtes pas autorisé à sauvegarder sur le serveur, utilisez la fonction "exporter"',

    // server
    server_disconnected: 'La connexion avec le serveur a été interrompue',
    server_connected: 'La connexion avec le serveur a été rétablie',

    // session
    session: 'Session',
    session_new: 'Nouvelle session',
    session_malformed: 'Fichier de session mal formé.',
    session_parsingerror: 'Erreur à l\'ouverture de la session.',
    session_uploaderror: 'Échec à l\'envoi du fichier de session.',
    session_unsaved: 'Vos modifications seront perdues si vous fermez la session actuelle sans sauvegarder, continuer ?',
    session_oldversion_title: 'Attention',
    session_oldversion: 'Cette session a été créée avec une ancienne version de ce logiciel, une conversion automatique a été appliquée. Une fois sauvegardée, cette session risque de ne plus charger correctement avec les anciennes versions, il est recommandé d\'en faire une copie de sauvegarde.',

    // state
    state: 'État',
    state_store: 'Sauver',
    state_recall: 'Rappeler',
    state_send: 'Envoyer',
    state_import: 'Importer',
    state_export: 'Exporter',
    state_uploaderror: 'Échec à l\'envoi du fichier d\'état.',
    state_storesuccess: 'État de l\'interface sauvegardé',
    state_recallsuccess: 'État de l\'interface restauré',
    state_sendsuccess: 'État de de l\'interface envoyé',

    // tree
    tree_filter: 'Filtrer',

    // misc
    error: 'Erreur'


}
