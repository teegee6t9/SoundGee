export interface Sound {
  id: string
  name: string
  fileName: string
  hotkey?: string
  color?: string
  volume: number
}

export interface Soundboard {
  id: string
  name: string
  sounds: Sound[]
}

export type Language = 'fr' | 'en'

export interface Settings {
  language: Language
  outputDeviceIds: string[]
  masterVolume: number
}

export interface AppState {
  soundboards: Soundboard[]
  settings: Settings
}

export interface HotkeyResult {
  ok: boolean
  error?: string
}

export interface HotkeyTriggeredPayload {
  soundboardId: string
  soundId: string
}
