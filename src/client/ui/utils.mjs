import fastdom from 'fastdom'
import {DOM} from '../globals.mjs'

export function icon(i) {
    var iclass = i.split('.').join(' fa-')
    return `<i class="fa fa-fw fa-${iclass}"></i>`
}

export function iconify(string){
    return String(string).replace(/\^[^\s]{2,}/g,(x)=>{return icon(x.substring(1))})
}

export function updateMobileThemeColor(root) {

    fastdom.measure(()=>{

        var style = window.getComputedStyle(root ? root.widget : document.documentElement),
            color = style.getPropertyValue('--color-background').trim()

        fastdom.mutate(()=>{

            for (var el of DOM.get('meta[name="theme-color"], meta[name="apple-mobile-web-app-status-bar-style"]')) {
                el.setAttribute('content', color)
            }

        })

    })

}
