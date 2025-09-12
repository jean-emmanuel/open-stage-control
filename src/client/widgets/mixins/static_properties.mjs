let StaticProperties = (superclass, props) => class extends superclass {

    createPropsCache() {

        super.createPropsCache()

        for (var k in props) {
            this.cachedProps[k] = props[k]
        }


    }

}

export default StaticProperties
