import UiSidePanel from './ui-sidepanel'
import locales from '../locales'

export const leftUiSidePanel = new UiSidePanel({selector: 'osc-panel-container.left', label: locales('editor_tree')})
export const rightUiSidePanel= new UiSidePanel({selector: 'osc-panel-container.right', label: locales('editor_inspector')})
