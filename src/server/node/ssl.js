import * as settings from './settings'
import forge from 'node-forge'

var pki = forge.pki,
    certificate = settings.read('ssl-certificate')

forge.options.usePureJavaScript = true

// Generate a random Serial number for the certificate
// matth-c3 @ https://github.com/digitalbazaar/forge/issues/673#issuecomment-500900852
function randomSerialNumber() {
    var hexString = forge.util.bytesToHex(forge.random.getBytesSync(16))

    var mostSiginficativeHexAsInt = parseInt(hexString[0], 16)
    if (mostSiginficativeHexAsInt < 8) {
        return hexString
    }

    mostSiginficativeHexAsInt -= 8
    return mostSiginficativeHexAsInt.toString() + hexString.substring(1)
}

function createCertificate() {

    console.log('(INFO) Creating self signed ssl certificate...')

    var keys = pki.rsa.generateKeyPair(2048),
        cert = pki.createCertificate()

    cert.publicKey = keys.publicKey
    cert.validity.notBefore = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
    cert.serialNumber = randomSerialNumber()

    var attrs = [
        {name:'commonName',value: settings.infos.name},
        {name:'subjectAltName',value: settings.infos.productName}
    ]

    cert.setSubject(attrs)
    cert.setIssuer(attrs)
    cert.sign(keys.privateKey)

    settings.write('ssl-certificate', {
        key:  pki.privateKeyToPem(keys.privateKey),
        cert: pki.certificateToPem(cert)
    })

}

if (settings.read('use-ssl')){

    if (!certificate) {

        createCertificate()

    } else {

        var cert = pki.certificateFromPem(certificate.cert)

        if (
            cert.serialNumber === '00' ||
            new Date() > new Date(cert.validity.notAfter) ||
            cert.subject.attributes[1].value !== settings.infos.productName
        ) {
            console.log('(INFO) Self-signed ssl certificate in cache has expired or is invalid')
            createCertificate()
        } else {
            console.log('(INFO) Using self-signed ssl certificate in cache')
        }

    }

}
