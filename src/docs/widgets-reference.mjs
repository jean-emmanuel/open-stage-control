import './client-shim.mjs'
import baseClass from '../client/widgets/common/widget.mjs'
import * as widgets from '../client/widgets/index.mjs'

// Here we go
var base = baseClass.defaults(),
    doc = ['<!-- This file is generated automatically from the widget class declarations. See scripts/build-widget-reference.js -->']


doc.push(`

## Common

??? api "<div id="generic_properties">Generic properties<a class="headerlink" href="#generic_properties" title="Permanent link">#</a></div>"
    Properties shared by all widgets

    `
)

for (var categoryName in base) {
    doc.push(`\n

=== "${categoryName}"

    | property | type |default | description |
    | --- | --- | --- | --- |`
    )
    var notEmpty = false

    for (var propName in base[categoryName]) {

        var prop = base[categoryName][propName],
            permalink = propName

        if (propName === '_props' || propName[0] === '_') continue

        var help = Array.isArray(prop.help) ? prop.help.join('<br/><br/>').replace(/<br\/>-/g, '-') : prop.help || '',
            dynamic = baseClass.dynamicProps.includes(propName) ? '<sup><i class="fas fa-bolt" title="dynamic"></i></sup>' : ''

        if (prop.choices) {
            if (help) help += '<br/><br/>'
            help += 'Choices: ' + prop.choices.map(x=>'`' + x + '`').join(', ')
        }

        doc.push(`
        | <h6 id="${permalink}">${propName}${dynamic}<a class="headerlink" href="#${permalink}" title="Permanent link">#</a></h6> | \`${prop.type.replace(/\|/g,'\`&vert;<br/>\`')}\` | <code>${(JSON.stringify(prop.value, null, '&nbsp;') || '').replace(/\n/g,'<br/>').replace('{','\\{')}</code> | ${help} |`
        )
        notEmpty = true

    }
    if (!notEmpty) doc.pop()

}

for (var k in widgets.categories) {
    var category = widgets.categories[k]
    if (k == 'Containers') {
        category.push('root')
        category.push('tab')
    }

    doc.push(`
## ${k}`
    )

    for (var kk in category) {
        var type = category[kk],
            defaults = widgets.widgets[type].defaults(),
            description = widgets.widgets[type].description()

        doc.push(`

??? api "<div id="${type}">${type}<a class="headerlink" href="#${type}" title="Permanent link">#</a></div>"
    ${description}`

        )

        for (var categoryName in defaults) {
            doc.push(`\n
    === "${categoryName == 'class_specific' ? type : categoryName}"

        | property | type |default | description |
        | --- | --- | --- | --- |`
            )
            var notEmpty = false

            for (var propName in defaults[categoryName]) {

                var prop = defaults[categoryName][propName],
                    permalink = type + '_' + propName


                if (propName === '_props' || propName[0] === '_' || JSON.stringify(prop) == JSON.stringify((base[categoryName]||{})[propName])) continue

                var help = Array.isArray(prop.help) ? prop.help.join('<br/><br/>').replace(/<br\/>-/g, '-') : prop.help || '',
                    dynamic = widgets.widgets[type].dynamicProps.includes(propName) ? '<sup><i class="fas fa-bolt" title="dynamic"></i></sup>' : ''

                if (prop.choices) {
                    if (help) help += '<br/><br/>'
                    help += 'Choices: ' + prop.choices.map(x=>'`' + x + '`').join(', ')
                }
                doc.push(`
            | <h6 id="${permalink}">${propName}${dynamic}<a class="headerlink" href="#${permalink}" title="Permanent link">#</a></h6> | \`${prop.type.replace(/\|/g,'\`&vert;<br/>\`')}\` | <code>${(JSON.stringify(prop.value, null, '&nbsp;') || '').replace(/\n/g,'<br/>').replace('{','\\{')}</code> | ${help} |`
                )
                notEmpty = true
            }

            if (!notEmpty) doc.pop()



        }


    }
}

console.log(doc.join(''))

process.exit(0) // avoid setTimeout errors in required modules
