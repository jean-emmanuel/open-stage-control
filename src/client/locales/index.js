import en from './en'
import fr from './fr'
import de from './de'
import pl from './pl'

var locales = {
    en, fr, de, pl,
    debug: {
        /* empty */
        keyboard_layout: en.keyboard_layout
    }
}

var lang = locales[LANG] ? LANG : 'en'

export default key=>locales[lang][key] || `!${key}!`
