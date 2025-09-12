import UiWidget from './ui-widget.mjs'
import {setScrollbarColor} from './utils.mjs'

class UiWorkspace extends UiWidget {

    constructor(options) {

        super(options)

        setScrollbarColor(this.container)

    }

}

export default new UiWorkspace({selector: 'osc-workspace'})
