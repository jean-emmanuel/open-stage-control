import {networkInterfaces} from 'os'

export default (proto, port)=>{
    var address = Object.values(networkInterfaces())
        .reduce((a,b)=>a.concat(b), [])
        .filter(i=>i.family === 'IPv4')
        .map(i=>i.address + ':')

    return address.map(x=>proto + x + port)
}
