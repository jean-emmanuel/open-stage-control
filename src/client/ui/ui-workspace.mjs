import UiWidget from './ui-widget'
import {setScrollbarColor} from './utils'

class UiWorkspace extends UiWidget {

    constructor(options) {

        super(options)

        setScrollbarColor(this.container)

    }

}

export default new UiWorkspace({selector: 'osc-workspace'})
