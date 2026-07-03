import { app, BrowserWindow, ipcMain, dialog, protocol, net, session } from 'electron'
import { pathToFileURL } from 'url'
import path from 'path'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import { createMainWindow } from './window'
import { createTray, updateTrayMenu } from './tray'
import {
  getSoundsDir,
  getState,
  getSoundboards,
  setSoundboards,
  getSettings,
  setSettings,
  findSoundboard,
  findSound
} from './store'
import {
  registerHotkey as registerHotkeyGlobal,
  unregisterHotkey as unregisterHotkeyGlobal,
  registerAllFromStore,
  unregisterAll
} from './hotkeys'
import { exportSoundboard, importSoundboardPack } from './pack'
import { IPC } from '../shared/ipcChannels'
import { setQuitting, isQuitting } from './appState'
import type { Language } from '../shared/types'

protocol.registerSchemesAsPrivileged([
  { scheme: 'sgsound', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } }
])

let mainWindow: BrowserWindow | null = null

function resolveSoundPath(requestUrl: string): string | null {
  const url = new URL(requestUrl)
  const fileName = decodeURIComponent(url.pathname.replace(/^\/+/, '') || url.hostname)
  const soundsDir = getSoundsDir()
  const resolved = path.join(soundsDir, fileName)
  if (!resolved.startsWith(soundsDir)) return null
  return resolved
}

function safeUnlinkSound(fileName: string): void {
  try {
    fs.unlinkSync(path.join(getSoundsDir(), fileName))
  } catch {
    // file already gone, nothing to clean up
  }
}

app.whenReady().then(() => {
  protocol.handle('sgsound', async (request) => {
    const filePath = resolveSoundPath(request.url)
    if (!filePath || !fs.existsSync(filePath)) {
      return new Response('Not found', { status: 404 })
    }
    return net.fetch(pathToFileURL(filePath).toString())
  })

  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permission === 'media')
  })

  mainWindow = createMainWindow()
  createTray(mainWindow, getSettings().language)
  registerAllFromStore(mainWindow)

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  registerIpcHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    } else {
      mainWindow?.show()
    }
  })
})

app.on('before-quit', () => setQuitting(true))
app.on('will-quit', () => unregisterAll())
app.on('window-all-closed', () => {
  // Intentionally no-op: SoundGee keeps running via the tray while gaming.
})

function registerIpcHandlers(): void {
  ipcMain.handle(IPC.GET_STATE, () => getState())

  ipcMain.handle(IPC.CREATE_SOUNDBOARD, (_e, name: string) => {
    const boards = getSoundboards()
    boards.push({ id: uuid(), name, sounds: [] })
    setSoundboards(boards)
    return getState()
  })

  ipcMain.handle(IPC.RENAME_SOUNDBOARD, (_e, id: string, name: string) => {
    const boards = getSoundboards()
    findSoundboard(boards, id).name = name
    setSoundboards(boards)
    return getState()
  })

  ipcMain.handle(IPC.DELETE_SOUNDBOARD, (_e, id: string) => {
    const boards = getSoundboards()
    const board = findSoundboard(boards, id)
    for (const sound of board.sounds) {
      unregisterHotkeyGlobal(id, sound.id)
      safeUnlinkSound(sound.fileName)
    }
    setSoundboards(boards.filter((b) => b.id !== id))
    return getState()
  })

  ipcMain.handle(IPC.PICK_AUDIO_FILE, async () => {
    if (!mainWindow) return null
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Choisir un fichier audio',
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac'] }],
      properties: ['openFile']
    })
    if (canceled || filePaths.length === 0) return null
    return filePaths[0]
  })

  ipcMain.handle(IPC.ADD_SOUND_FROM_FILE, async (_e, soundboardId: string, sourcePath: string, name: string) => {
    const boards = getSoundboards()
    const board = findSoundboard(boards, soundboardId)
    const ext = path.extname(sourcePath) || '.mp3'
    const fileName = `${uuid()}${ext}`
    await fs.promises.copyFile(sourcePath, path.join(getSoundsDir(), fileName))
    board.sounds.push({ id: uuid(), name, fileName, volume: 1 })
    setSoundboards(boards)
    return getState()
  })

  ipcMain.handle(IPC.ADD_SOUND_FROM_URL, async (_e, soundboardId: string, url: string, name: string) => {
    const boards = getSoundboards()
    const board = findSoundboard(boards, soundboardId)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Download failed: ${res.status}`)
    const contentType = res.headers.get('content-type') || ''
    const buffer = Buffer.from(await res.arrayBuffer())
    let ext = path.extname(new URL(url).pathname)
    if (!ext) {
      if (contentType.includes('wav')) ext = '.wav'
      else if (contentType.includes('ogg')) ext = '.ogg'
      else if (contentType.includes('m4a') || contentType.includes('mp4')) ext = '.m4a'
      else ext = '.mp3'
    }
    const fileName = `${uuid()}${ext}`
    await fs.promises.writeFile(path.join(getSoundsDir(), fileName), buffer)
    board.sounds.push({ id: uuid(), name, fileName, volume: 1 })
    setSoundboards(boards)
    return getState()
  })

  ipcMain.handle(
    IPC.UPDATE_SOUND,
    (_e, soundboardId: string, soundId: string, patch: Partial<{ name: string; color: string; volume: number }>) => {
      const boards = getSoundboards()
      const board = findSoundboard(boards, soundboardId)
      const sound = findSound(board, soundId)
      Object.assign(sound, patch)
      setSoundboards(boards)
      return getState()
    }
  )

  ipcMain.handle(IPC.DELETE_SOUND, (_e, soundboardId: string, soundId: string) => {
    const boards = getSoundboards()
    const board = findSoundboard(boards, soundboardId)
    const sound = findSound(board, soundId)
    unregisterHotkeyGlobal(soundboardId, soundId)
    safeUnlinkSound(sound.fileName)
    board.sounds = board.sounds.filter((s) => s.id !== soundId)
    setSoundboards(boards)
    return getState()
  })

  ipcMain.handle(
    IPC.UPDATE_SETTINGS,
    (_e, patch: Partial<{ language: Language; outputDeviceIds: string[]; masterVolume: number }>) => {
      const settings = { ...getSettings(), ...patch }
      setSettings(settings)
      if (mainWindow) updateTrayMenu(mainWindow, settings.language)
      return getState()
    }
  )

  ipcMain.handle(IPC.REGISTER_HOTKEY, (_e, soundboardId: string, soundId: string, accelerator: string) => {
    if (!mainWindow) return { ok: false, error: 'no-window', state: getState() }
    const result = registerHotkeyGlobal(mainWindow, soundboardId, soundId, accelerator)
    if (result.ok) {
      const boards = getSoundboards()
      const board = findSoundboard(boards, soundboardId)
      findSound(board, soundId).hotkey = accelerator
      setSoundboards(boards)
    }
    return { ...result, state: getState() }
  })

  ipcMain.handle(IPC.UNREGISTER_HOTKEY, (_e, soundboardId: string, soundId: string) => {
    unregisterHotkeyGlobal(soundboardId, soundId)
    const boards = getSoundboards()
    const board = findSoundboard(boards, soundboardId)
    findSound(board, soundId).hotkey = undefined
    setSoundboards(boards)
    return getState()
  })

  ipcMain.handle(IPC.EXPORT_SOUNDBOARD, async (_e, soundboardId: string) => {
    if (!mainWindow) return { ok: false }
    return exportSoundboard(mainWindow, soundboardId)
  })

  ipcMain.handle(IPC.IMPORT_SOUNDBOARD, async () => {
    if (!mainWindow) return null
    return importSoundboardPack(mainWindow)
  })
}
