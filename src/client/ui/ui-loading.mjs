import notifications from './notifications.mjs'

var loading = null, timeout = null

export default function(title) {

    if (title === false && loading) {
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            notifications.remove(loading)
            loading = null
        }, 500)
    } else if (title !== false) {
        notifications.add({
            id: 'LOADING',
            icon: 'spinner fa-spin',
            message: title
        })
        loading = notifications.toasts[notifications.toasts.length - 1]
    }

}
