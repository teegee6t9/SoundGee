import { Tray, Menu, BrowserWindow, app, nativeImage } from 'electron'
import { getIconPath } from './resources'
import { setQuitting } from './appState'
import type { Language } from '../shared/types'

let trayInstance: Tray | null = null

const labels: Record<Language, { show: string; quit: string }> = {
  en: { show: 'Show SoundGee', quit: 'Quit' },
  fr: { show: 'Afficher SoundGee', quit: 'Quitter' }
}

export function createTray(win: BrowserWindow, lang: Language): Tray {
  const icon = nativeImage.createFromPath(getIconPath('tray-icon.png'))
  trayInstance = new Tray(icon)
  trayInstance.setToolTip('SoundGee')
  trayInstance.on('click', () => {
    win.show()
    win.focus()
  })
  updateTrayMenu(win, lang)
  return trayInstance
}

export function updateTrayMenu(win: BrowserWindow, lang: Language): void {
  if (!trayInstance) return
  const l = labels[lang] ?? labels.en
  const menu = Menu.buildFromTemplate([
    {
      label: l.show,
      click: () => {
        win.show()
        win.focus()
      }
    },
    { type: 'separator' },
    {
      label: l.quit,
      click: () => {
        setQuitting(true)
        app.quit()
      }
    }
  ])
  trayInstance.setContextMenu(menu)
}
