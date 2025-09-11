import balanced from 'balanced-match'

export function clip(value,range) {

    value = parseFloat(value)

    if (isNaN(value)) value = range[0]

    return Math.max(Math.min(range[0], range[1]), Math.min(value, Math.max(range[0], range[1])))

}

// map a value from a scale to another
//     value: number
//     rangeIn: [number, number]
//     rangeOut: [number, number]
//     decimals: number (-1 to bypass)
//     log: true, or manual log scale (max log value)
//     revertLog: boolean
export function mapToScale(value, rangeIn, rangeOut, decimals, log, revertlog) {

    // clip in
    value = clip(value,[rangeIn[0], rangeIn[1]])


    // normalize
    value = (value - rangeIn[0]) / (rangeIn[1] - rangeIn[0])

    // log scale
    if (log) {

        var logScale = revertlog ? Math.abs(rangeIn[1] - rangeIn[0]) :
                        Math.abs(rangeOut[1] - rangeOut[0])

        if (log !== true && log !== -1) logScale = Math.abs(log)
        else if (logScale >= 100) logScale /= 10
        else logScale = Math.max(logScale, 10)

        if (log < 0) revertlog = !revertlog

        value = revertlog ?
            Math.log(value * (logScale - 1) + 1) / Math.log(logScale) :
            Math.pow(logScale, value) / (logScale - 1) - 1 / (logScale - 1)

    }

    // scale out
    value = value * (rangeOut[1] - rangeOut[0]) + rangeOut[0]

    // clip out
    value = clip(value, [rangeOut[0], rangeOut[1]])

    // decimals
    if (decimals !== -1) value = parseFloat(value.toFixed(decimals))

    return value

}

export function hsbToRgb(hsb) {
    var rgb = {}
    var h = hsb.h
    var s = hsb.s*255/100
    var v = hsb.b*255/100
    if(s == 0) {
        rgb.r = rgb.g = rgb.b = v
    } else {
        var t1 = v
        var t2 = (255-s)*v/255
        var t3 = (t1-t2)*(h%60)/60
        if(h==360) h = 0
        if(h<60) {rgb.r=t1;    rgb.b=t2; rgb.g=t2+t3}
        else if(h<120) {rgb.g=t1; rgb.b=t2;    rgb.r=t1-t3}
        else if(h<180) {rgb.g=t1; rgb.r=t2;    rgb.b=t2+t3}
        else if(h<240) {rgb.b=t1; rgb.r=t2;    rgb.g=t1-t3}
        else if(h<300) {rgb.b=t1; rgb.g=t2;    rgb.r=t2+t3}
        else if(h<360) {rgb.r=t1; rgb.g=t2;    rgb.b=t1-t3}
        else {rgb.r=0; rgb.g=0;    rgb.b=0}
    }
    return rgb
}

export function rgbToHsb(rgb) {
    var hsb = {h: 0, s: 0, b: 0}
    var min = Math.min(rgb.r, rgb.g, rgb.b)
    var max = Math.max(rgb.r, rgb.g, rgb.b)
    var delta = max - min
    hsb.b = max
    hsb.s = max != 0 ? 255 * delta / max : 0
    if (hsb.s != 0) {
        if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta
        else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta
        else hsb.h = 4 + (rgb.r - rgb.g) / delta
    } else hsb.h = 0
    hsb.h *= 60
    if (hsb.h < 0) hsb.h += 360
    hsb.s *= 100/255
    hsb.b *= 100/255
    return hsb
}


var urlParser = (()=>{

    var parser = document.createElement('a'),
        localUrlRe = /(^127\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^172\.1[6-9]{1}[0-9]{0,1}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^172\.2[0-9]{1}[0-9]{0,1}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^172\.3[0-1]{1}[0-9]{0,1}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^192\.168\.[0-9]{1,3}\.[0-9]{1,3}$)/

    parser.isLocal = ()=>{
        return parser.hostname.match(localUrlRe)
    }

    return (url)=>{
        parser.href = url
        return parser
    }

})()

export {urlParser}

export function balancedReplace(tag, open, close, string, replacement) {

    var start, lastStart = -1

    while ((start = string.indexOf(tag + open)) >= 0 && lastStart !== start) {

        var substring = string.slice(start + tag.length),
            b = balanced(open, close, substring)

        if (b) {

            if (typeof replacement === 'function') {

                substring = b.pre + replacement(b.body) + b.post

            } else {

                substring = b.pre + replacement + b.post

            }

            string = string.slice(0, start) + substring

        }

        lastStart = start

    }

    return string

}
