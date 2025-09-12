import Panel from './panel.mjs'
import StaticProperties from '../mixins/static_properties.mjs'
import {updateMobileThemeColor} from '../../ui/utils.mjs'

var mainMenu
;(async()=>{
    mainMenu = (await import('../../ui/main-menu.mjs')).default
})()

class Root extends StaticProperties(Panel, {visible: true, label: false, id: 'root'}) {

    static description() {

        return 'Main (unique) container'

    }

    static defaults() {

        return super.defaults().extend({
            widgets: {
                visible: null,
            },
            geometry: {
                left: null,
                top: null,
                expand: null,
            },
            style: {
                colorFill: null,
                colorStroke: null,
                alphaStroke: null,
                alphaFillOff: null,
                lineWidth: null,
                _separator_root_style: 'Root style',
                hideMenu: {type: 'boolean', value: false, help: 'Set to `true` to hide the main menu button.'},

            },
            scripting: {
                onPreload: {type: 'script', value: '', editor: 'javascript', help: ['Script executed before any other widget is created. See <a href="https://openstagecontrol.ammd.net/docs/widgets/scripting/">documentation</a>.']},
            }
        })

    }

    constructor(options) {

        options.root = true
        options.props.id = 'root'

        super(options)

        this.widget.classList.add('root')
        this.root = true

        this.checkMenuVisibility()

        DOM.each(this.widget, '> .navigation', (el)=>{
            el.classList.add('main')
        })

    }

    checkMenuVisibility() {

        if (this.getProp('hideMenu')) {
            mainMenu.container.style.display = 'none'
        } else {
            mainMenu.container.style.display = ''
        }

    }

    isVisible() {

        return true

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'hideMenu':
                this.checkMenuVisibility()
                return
            case 'colorBg':
                updateMobileThemeColor(this)

        }

    }


    setContainerStyles(styles) {

        super.setContainerStyles(styles)

        this.container.classList.toggle('auto-height', this.getProp('height') === 'auto')

    }

    setCssVariables() {

        super.setCssVariables()
        updateMobileThemeColor(this)

    }

}

Root.dynamicProps = Root.prototype.constructor.dynamicProps.concat(
    'hideMenu'
)


export default Root
