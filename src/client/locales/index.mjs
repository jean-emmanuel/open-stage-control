import en from './en.mjs'
import fr from './fr.mjs'
import de from './de.mjs'
import pl from './pl.mjs'
import {LANG} from '../globals.mjs'

var locales = {
    en, fr, de, pl,
    debug: {
        /* empty */
        keyboard_layout: en.keyboard_layout
    }
}

var lang = locales[LANG] ? LANG : 'en'

export default key=>locales[lang][key] || `!${key}!`
