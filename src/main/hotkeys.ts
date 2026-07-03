import { globalShortcut, BrowserWindow } from 'electron'
import type { HotkeyResult, HotkeyTriggeredPayload } from '../shared/types'
import { IPC } from '../shared/ipcChannels'
import { getSoundboards } from './store'

const acceleratorToSound = new Map<string, HotkeyTriggeredPayload>()
const soundToAccelerator = new Map<string, string>()

function soundKey(soundboardId: string, soundId: string): string {
  return `${soundboardId}:${soundId}`
}

export function registerHotkey(
  win: BrowserWindow,
  soundboardId: string,
  soundId: string,
  accelerator: string
): HotkeyResult {
  const key = soundKey(soundboardId, soundId)
  const existingAccel = soundToAccelerator.get(key)
  if (existingAccel === accelerator) return { ok: true }
  if (globalShortcut.isRegistered(accelerator)) {
    return { ok: false, error: 'conflict' }
  }

  const success = globalShortcut.register(accelerator, () => {
    win.webContents.send(IPC.HOTKEY_TRIGGERED, { soundboardId, soundId } as HotkeyTriggeredPayload)
  })
  if (!success) return { ok: false, error: 'register-failed' }

  if (existingAccel) {
    globalShortcut.unregister(existingAccel)
    acceleratorToSound.delete(existingAccel)
  }
  acceleratorToSound.set(accelerator, { soundboardId, soundId })
  soundToAccelerator.set(key, accelerator)
  return { ok: true }
}

export function unregisterHotkey(soundboardId: string, soundId: string): void {
  const key = soundKey(soundboardId, soundId)
  const accel = soundToAccelerator.get(key)
  if (accel) {
    globalShortcut.unregister(accel)
    acceleratorToSound.delete(accel)
    soundToAccelerator.delete(key)
  }
}

export function registerAllFromStore(win: BrowserWindow): void {
  for (const board of getSoundboards()) {
    for (const sound of board.sounds) {
      if (sound.hotkey) {
        registerHotkey(win, board.id, sound.id, sound.hotkey)
      }
    }
  }
}

export function unregisterAll(): void {
  globalShortcut.unregisterAll()
  acceleratorToSound.clear()
  soundToAccelerator.clear()
}
