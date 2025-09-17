import chroma from 'chroma-js'
import fastdom from 'fastdom'
import {DOM} from '../globals.mjs'

export function icon(i) {
    var iclass = i.split('.').join(' fa-')
    return `<i class="fa fa-fw fa-${iclass}"></i>`
}

export function iconify(string){
    return String(string).replace(/\^[^\s]{2,}/g,(x)=>{return icon(x.substring(1))})
}

export function setScrollbarColor(container) {

    fastdom.measure(()=>{

        var computedStyle = window.getComputedStyle(container),
            alpha = parseFloat(computedStyle.getPropertyValue('--alpha-scrollbar')),
            alphaOn = parseFloat(computedStyle.getPropertyValue('--alpha-scrollbar-on')),
            color = computedStyle.getPropertyValue('--color-fill').trim()

        if (color === 'transparent') {
            // prevent chroma-js error
            // irrelevant case, but still...
            color = 'rgb(0, 0, 0)'
            alpha = 0
            alphaOn = 0
        }

        if (color) {
            fastdom.mutate(()=>{
                try {
                    container.style.setProperty('--color-scrollbar', chroma(color).alpha(alpha).css())
                    container.style.setProperty('--color-scrollbar-on', chroma(color).alpha(alphaOn).css())
                } catch(e) {}
            })
        }

    })

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
