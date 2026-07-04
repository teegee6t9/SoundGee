import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipcChannels'
import type { AppState, ConfigureResult, HotkeyResult, HotkeyTriggeredPayload, Language } from '../shared/types'

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
    patch: Partial<{
      language: Language
      outputDeviceIds: string[]
      masterVolume: number
      launchAtStartup: boolean
      launchMinimized: boolean
      lastSeenVersion: string
    }>
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
  importSoundboardPack: (): Promise<AppState | null> => ipcRenderer.invoke(IPC.IMPORT_SOUNDBOARD),

  listRunningApps: (): Promise<{ processName: string; title: string }[]> =>
    ipcRenderer.invoke(IPC.APPS_LIST_RUNNING),
  updateSoundboardApps: (soundboardId: string, appMatchers: string[]): Promise<AppState> =>
    ipcRenderer.invoke(IPC.UPDATE_BOARD_APPS, soundboardId, appMatchers),
  getActiveBoards: (): Promise<string[]> => ipcRenderer.invoke(IPC.GET_ACTIVE_BOARDS),
  onActiveBoardsChanged: (callback: (ids: string[]) => void): (() => void) => {
    const listener = (_e: Electron.IpcRendererEvent, ids: string[]): void => callback(ids)
    ipcRenderer.on(IPC.ACTIVE_BOARDS_CHANGED, listener)
    return () => ipcRenderer.removeListener(IPC.ACTIVE_BOARDS_CHANGED, listener)
  },

  minimizeWindow: (): void => ipcRenderer.send(IPC.WINDOW_MINIMIZE),
  closeWindow: (): void => ipcRenderer.send(IPC.WINDOW_CLOSE),

  onUpdateReady: (callback: () => void): (() => void) => {
    const listener = (): void => callback()
    ipcRenderer.on(IPC.UPDATE_READY, listener)
    return () => ipcRenderer.removeListener(IPC.UPDATE_READY, listener)
  },
  installUpdate: (): void => ipcRenderer.send(IPC.INSTALL_UPDATE),

  registerMasterHotkey: (accelerator: string): Promise<HotkeyResult & { state: AppState }> =>
    ipcRenderer.invoke(IPC.REGISTER_MASTER_HOTKEY, accelerator),
  unregisterMasterHotkey: (): Promise<AppState> => ipcRenderer.invoke(IPC.UNREGISTER_MASTER_HOTKEY),
  toggleSoundboardsEnabled: (): Promise<AppState> => ipcRenderer.invoke(IPC.TOGGLE_SOUNDBOARDS),
  onSoundboardsEnabledChanged: (callback: (enabled: boolean) => void): (() => void) => {
    const listener = (_e: Electron.IpcRendererEvent, enabled: boolean): void => callback(enabled)
    ipcRenderer.on(IPC.SOUNDBOARDS_ENABLED_CHANGED, listener)
    return () => ipcRenderer.removeListener(IPC.SOUNDBOARDS_ENABLED_CHANGED, listener)
  },

  getAppVersion: (): Promise<string> => ipcRenderer.invoke(IPC.GET_APP_VERSION),
  checkVoicemeeterInstalled: (): Promise<boolean> => ipcRenderer.invoke(IPC.CHECK_VOICEMEETER_INSTALLED),
  configureVoicemeeterMixing: (): Promise<ConfigureResult> => ipcRenderer.invoke(IPC.CONFIGURE_VOICEMEETER_MIXING)
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
