import './zoom.mjs'
import '../events/click.mjs'
import './ios.mjs'
import './notifications.mjs'
import './ui-workspace.mjs'
import './main-menu.mjs'
import './ui-console.mjs'
import {updateMobileThemeColor, device} from './utils.mjs'

updateMobileThemeColor()

if (!device.is('mobile') && !device.is('tablet')) {
    import('./ui-keyboard.mjs')
}
