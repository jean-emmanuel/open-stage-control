import QRCode from 'qrcode'
import * as settings from './settings'

export default function qrcode(mode, callback){

    var qrstring = '',
        promises = []

    if (mode == 'file') {
        promises.push(QRCode.toString(settings.appAddresses().pop(), {type:'svg', small: true, margin: 1}))
    } else {
        for (var add of settings.appAddresses().filter(a=>!a.includes('127.0.0.1') && !a.includes('localhost'))) {
            if (mode == 'svg') {
                promises.push(QRCode.toString(add,{type:'svg', small: true, margin: 1}))
            } else if (mode == 'terminal') {
                promises.push(QRCode.toString(add,{type:'terminal', small: true}))
            }
        }
    }

    Promise.all(promises).then(values=>{
        for (var qr of values) {
            if (mode === 'svg') {
                qrstring += '<div class="qrcode" title="' + add + '">' + qr + '</div>'
                if (values.length > 1) {
                    qrstring += '(' + add + ')'
                }
            } else {
                qrstring += '\n' + qr.replace(/^/gm, '    ' + '')
                if (values.length > 1) {
                    qrstring += '    (' + add + ')'
                }
            }
        }
        callback(qrstring)
    })


}
