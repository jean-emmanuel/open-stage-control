require("./client-shim");

// Here we go
var widgets = require("../src/client/widgets"),
    baseClass = require("../src/client/widgets/common/widget"),
    base = baseClass.defaults(),
    doc = [
        "<!-- This file is generated automatically from the widget class declarations. See scripts/build-widget-reference.js -->"
    ];

doc.push(`

## Common

??? api "<div id="generic_properties">Generic properties<a class="headerlink" href="#generic_properties" title="Permanent link">#</a></div>"
    Properties shared by all widgets

    `);

for (var categoryName in base) {
    doc.push(`\n

=== "${categoryName}"

    | property | type |default | description |
    | --- | --- | --- | --- |`);
    var notEmpty = false;

    for (var propName in base[categoryName]) {
        var prop = base[categoryName][propName],
            permalink = propName;

        if (propName === "_props" || propName[0] === "_") continue;

        var help = Array.isArray(prop.help)
                ? prop.help.join("<br/><br/>").replace(/<br\/>-/g, "-")
                : prop.help || "",
            dynamic = baseClass.dynamicProps.includes(propName)
                ? '<sup><i class="fas fa-bolt" title="dynamic"></i></sup>'
                : "";

        if (prop.choices) {
            if (help) help += "<br/><br/>";
            help +=
                "Choices: " + prop.choices.map((x) => "`" + x + "`").join(", ");
        }

        doc.push(`
        | <h6 id="${permalink}">${propName}${dynamic}<a class="headerlink" href="#${permalink}" title="Permanent link">#</a></h6> | \`${prop.type.replace(/\|/g, "\`&vert;<br/>\`")}\` | <code>${(JSON.stringify(prop.value, null, "&nbsp;") || "").replace(/\n/g, "<br/>").replace("{", "\\{")}</code> | ${help} |`);
        notEmpty = true;
    }
    if (!notEmpty) doc.pop();
}

for (var k in widgets.categories) {
    var currentCategory = widgets.categories[k];
    if (k == "Containers") {
        currentCategory.push("root");
        currentCategory.push("tab");
    }

    doc.push(`
## ${k}`);

    for (var kk in currentCategory) {
        var type = currentCategory[kk],
            currentDefaults = widgets.widgets[type].defaults(),
            description = widgets.widgets[type].description();

        doc.push(`

??? api "<div id="${type}">${type}<a class="headerlink" href="#${type}" title="Permanent link">#</a></div>"
    ${description}`);

        for (var currentCategoryName in currentDefaults) {
            doc.push(`\n
    === "${currentCategoryName == "class_specific" ? type : currentCategoryName}"

        | property | type |default | description |
        | --- | --- | --- | --- |`);
            var isNotEmpty = false;

            for (var currentPropName in currentDefaults[currentCategoryName]) {
                var currentProp =
                        currentDefaults[currentCategoryName][currentPropName],
                    currentPermalink = type + "_" + currentPropName;

                if (
                    currentPropName === "_props" ||
                    currentPropName[0] === "_" ||
                    JSON.stringify(currentProp) ==
                        JSON.stringify(
                            (base[currentCategoryName] || {})[currentPropName]
                        )
                )
                    continue;

                var currentHelp = Array.isArray(currentProp.help)
                        ? currentProp.help
                              .join("<br/><br/>")
                              .replace(/<br\/>-/g, "-")
                        : currentProp.help || "",
                    currentDynamic = widgets.widgets[
                        type
                    ].dynamicProps.includes(currentPropName)
                        ? '<sup><i class="fas fa-bolt" title="dynamic"></i></sup>'
                        : "";

                if (currentProp.choices) {
                    if (currentHelp) currentHelp += "<br/><br/>";
                    currentHelp +=
                        "Choices: " +
                        currentProp.choices
                            .map((x) => "`" + x + "`")
                            .join(", ");
                }
                doc.push(`
            | <h6 id="${currentPermalink}">${currentPropName}${currentDynamic}<a class="headerlink" href="#${currentPermalink}" title="Permanent link">#</a></h6> | \`${currentProp.type.replace(/\|/g, "\`&vert;<br/>\`")}\` | <code>${(JSON.stringify(currentProp.value, null, "&nbsp;") || "").replace(/\n/g, "<br/>").replace("{", "\\{")}</code> | ${currentHelp} |`);
                isNotEmpty = true;
            }

            if (!isNotEmpty) doc.pop();
        }
    }
}

console.log(doc.join(""));

process.exit(0); // avoid setTimeout errors in required modules
