import './zoom'
import '../events/click'
import './ios'
import './notifications'
import './ui-workspace'
import './main-menu'
import './ui-console'
import {updateMobileThemeColor} from './utils'

updateMobileThemeColor()

if (!navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
    import('./ui-keyboard')
}
