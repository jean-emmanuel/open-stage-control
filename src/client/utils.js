module.exports = {

    deepCopy: function(obj, decimals) {

        var copy = obj

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (let key in obj) {
                copy[key] = module.exports.deepCopy(obj[key], decimals)
            }
        } else if (typeof obj == 'number') {
            return decimals === undefined ? copy : parseFloat(copy.toFixed(decimals))
        }

        return copy

    },

    deepEqual: function(a, b) {

        var ta = typeof a,
            tb = typeof b

        if (ta !== tb) {
            return false
        } else if (ta === 'object') {
            return JSON.stringify(a) === JSON.stringify(b)
        } else {
            return a === b
        }

    },

    isJSON: function(str) {
        // heuristic to avoid using JSON when unnecessary
        // if the string doesn't start with one of these chars
        // it's going to fail
        // ref in source: https://github.com/douglascrockford/JSON-js
        return ' 	\n+-eE{([0123456789tfn"'.indexOf(str[0]) !== -1

    },

    isJSONObject: function(str) {
        // same, but only for object/array/bool/null
        return '{[tfn'.indexOf(str[0]) !== -1
    }

}
