export function deepCopy(obj) {

    var copy = obj

    if (obj === null) {
        return obj
    }

    if (typeof obj === 'object') {
        copy = Array.isArray(obj) ? [] : {}
        for (let key in obj) {
            copy[key] = deepCopy(obj[key])
        }
    }

    return copy

}

export function resolveHomeDir(p) {
    // Resolve '~' to user's home directory
    if (!p) return ''
    return String(p).replace(/^(~|\/~)/, process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'])
}
