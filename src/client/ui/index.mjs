import UiSidePanel from './ui-sidepanel.mjs'
import locales from '../locales/index.mjs'

export const leftUiSidePanel = new UiSidePanel({selector: 'osc-panel-container.left', label: locales('editor_tree')})
export const rightUiSidePanel= new UiSidePanel({selector: 'osc-panel-container.right', label: locales('editor_inspector')})
