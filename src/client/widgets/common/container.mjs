import Widget from './widget'

var Container = (Class=Widget)=> class extends Class {

    constructor(options) {

        super(options)

        this.isContainer = true

        this.on('widget-created', (e)=>{

            if (e.widget.parent === this) {

                var index = e.index
                if (index !== undefined) {
                    if (!this.children[index]) {
                        this.children[index] = e.widget
                    } else {
                        this.children.splice(index, 0, e.widget)
                    }
                } else {
                    this.children.push(e.widget)
                }
            }

        })

        this.on('widget-removed', (e)=>{

            if (e.widget.parent === this) {
                this.children.splice(this.children.indexOf(e.widget), 1)
            }

        })

    }

    alignChildrenProps() {

        // this is needed after editor.undo to fix data shifting:
        // say we have children [a, b, c] bound with session data [a, b, c]
        // we delete one widget [   b, c] the data changes too:   [   b, c]
        // undo first only mutates the data:                      [a, b, c]
        // so children have their data mutated too, child 'b' gets data 'a' and so on
        // each child has to get the data corresponding to its index again.
        // ...right ? :)
        var tabs = this.getProp('tabs'),
            widgets= this.getProp('widgets'),
            type = tabs && tabs.length ? 'tabs' : widgets && widgets.length ? 'widgets' : null,
            data = type ? this.getProp(type) : null

        if (!type) return


        for (let i in this.children) {
            if (this.children[i] && data[i]) {
                this.children[i].props = data[i]
                this.children[i].cachedProps[type] = this.children[i].props[type]
                if (this.children[i].alignChildrenProps) {
                    this.children[i].alignChildrenProps()
                }
            }
        }

    }

    onRemove() {

        super.onRemove()

    }

}


export default Container
