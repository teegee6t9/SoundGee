import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipcChannels'
import type { AppState, HotkeyResult, HotkeyTriggeredPayload, Language } from '../shared/types'

const api = {
  getState: (): Promise<AppState> => ipcRenderer.invoke(IPC.GET_STATE),

  createSoundboard: (name: string): Promise<AppState> => ipcRenderer.invoke(IPC.CREATE_SOUNDBOARD, name),
  renameSoundboard: (id: string, name: string): Promise<AppState> =>
    ipcRenderer.invoke(IPC.RENAME_SOUNDBOARD, id, name),
  deleteSoundboard: (id: string): Promise<AppState> => ipcRenderer.invoke(IPC.DELETE_SOUNDBOARD, id),

  pickAudioFile: (): Promise<string | null> => ipcRenderer.invoke(IPC.PICK_AUDIO_FILE),
  addSoundFromFile: (soundboardId: string, sourcePath: string, name: string): Promise<AppState> =>
    ipcRenderer.invoke(IPC.ADD_SOUND_FROM_FILE, soundboardId, sourcePath, name),
  addSoundFromUrl: (soundboardId: string, url: string, name: string): Promise<AppState> =>
    ipcRenderer.invoke(IPC.ADD_SOUND_FROM_URL, soundboardId, url, name),
  updateSound: (
    soundboardId: string,
    soundId: string,
    patch: Partial<{ name: string; color: string; volume: number }>
  ): Promise<AppState> => ipcRenderer.invoke(IPC.UPDATE_SOUND, soundboardId, soundId, patch),
  deleteSound: (soundboardId: string, soundId: string): Promise<AppState> =>
    ipcRenderer.invoke(IPC.DELETE_SOUND, soundboardId, soundId),

  updateSettings: (
    patch: Partial<{ language: Language; outputDeviceIds: string[]; masterVolume: number }>
  ): Promise<AppState> => ipcRenderer.invoke(IPC.UPDATE_SETTINGS, patch),

  registerHotkey: (
    soundboardId: string,
    soundId: string,
    accelerator: string
  ): Promise<HotkeyResult & { state: AppState }> =>
    ipcRenderer.invoke(IPC.REGISTER_HOTKEY, soundboardId, soundId, accelerator),
  unregisterHotkey: (soundboardId: string, soundId: string): Promise<AppState> =>
    ipcRenderer.invoke(IPC.UNREGISTER_HOTKEY, soundboardId, soundId),
  onHotkeyTriggered: (callback: (payload: HotkeyTriggeredPayload) => void): (() => void) => {
    const listener = (_e: Electron.IpcRendererEvent, payload: HotkeyTriggeredPayload): void => callback(payload)
    ipcRenderer.on(IPC.HOTKEY_TRIGGERED, listener)
    return () => ipcRenderer.removeListener(IPC.HOTKEY_TRIGGERED, listener)
  },

  exportSoundboard: (soundboardId: string): Promise<{ ok: boolean; path?: string }> =>
    ipcRenderer.invoke(IPC.EXPORT_SOUNDBOARD, soundboardId),
  importSoundboardPack: (): Promise<AppState | null> => ipcRenderer.invoke(IPC.IMPORT_SOUNDBOARD)
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
