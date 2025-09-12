import httpAuth from 'http-auth'
import * as settings from './settings'

var auth = null

if (settings.read('authentication')) {

    var [name, pwd] = settings.read('authentication').split(':')

    auth = httpAuth.basic(
        {
            realm: 'Open Stage Control'
        },
        (username, password, callback) => {
            // Custom authentication method.
            callback(username === name && password === pwd)
        }
    )

}


export default auth
