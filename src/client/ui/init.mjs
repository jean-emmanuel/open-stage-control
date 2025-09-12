import './zoom.mjs'
import '../events/click.mjs'
import './ios.mjs'
import './notifications.mjs'
import './ui-workspace.mjs'
import './main-menu.mjs'
import './ui-console.mjs'
import {updateMobileThemeColor} from './utils.mjs'

updateMobileThemeColor()

if (!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
    import('./ui-keyboard.mjs')
}
