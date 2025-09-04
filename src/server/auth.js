var settings = require("./settings"),
    auth = null;

if (settings.read("authentication")) {
    var [name, pwd] = settings.read("authentication").split(":"),
        httpAuth = require("http-auth");

    auth = httpAuth.basic(
        {
            realm: "Open Stage Control"
        },
        (username, password, callback) => {
            // Custom authentication method.
            callback(username === name && password === pwd);
        }
    );
}

module.exports = auth;
