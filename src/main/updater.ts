import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow } from 'electron'
import { IPC } from '../shared/ipcChannels'

export function initAutoUpdater(win: BrowserWindow): void {
  if (!app.isPackaged) return

  autoUpdater.autoDownload = true
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send(IPC.UPDATE_READY)
  })
  autoUpdater.on('error', (err) => {
    console.error('[updater]', err)
  })

  autoUpdater.checkForUpdates().catch((err) => console.error('[updater] check failed', err))
  setInterval(
    () => {
      autoUpdater.checkForUpdates().catch(() => {})
    },
    60 * 60 * 1000
  )
}

export function installUpdateNow(): void {
  autoUpdater.quitAndInstall()
}
