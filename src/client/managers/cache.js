var keyPrefix = 'osc.'

class Cache {

    set(key, value, persistent = true) {

        var storage = persistent ? localStorage : sessionStorage

        storage.setItem(keyPrefix + key, JSON.stringify(value))

    }

    get(key, persistent = true) {

        var storage = persistent ? localStorage : sessionStorage

        return JSON.parse(storage.getItem(keyPrefix + key))

    }

    remove(key, persistent = true) {

        var storage = persistent ? localStorage : sessionStorage

        storage.removeItem(keyPrefix + key)

    }

    clear(domain) {

        if (domain) {

            for (let storage of [localStorage, sessionStorage]) {

                for (let k in storage) {
                    if (k.indexOf(keyPrefix + domain) === 0) {
                        storage.removeItem(k)
                    }
                }

            }


        } else {

            localStorage.clear()
            sessionStorage.clear()

        }

    }

}

export default new Cache()
