import Store from 'electron-store'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import type { AppState, Soundboard, Sound, Settings } from '../shared/types'

const defaultSettings: Settings = {
  language: 'en',
  outputDeviceIds: [],
  masterVolume: 1,
  launchAtStartup: false,
  launchMinimized: false,
  soundboardsEnabled: true,
  // On a brand new install this matches the running version, so no "what's new" popup fires.
  // Existing installs upgrading from an older version keep their persisted (older) value here,
  // which is what makes the popup trigger on the first launch after an update.
  lastSeenVersion: app.getVersion()
}

const store = new Store<AppState>({
  defaults: { soundboards: [], settings: defaultSettings }
})

export function getSoundsDir(): string {
  const dir = path.join(app.getPath('userData'), 'sounds')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function getState(): AppState {
  return { soundboards: getSoundboards(), settings: getSettings() }
}

export function getSoundboards(): Soundboard[] {
  return store.get('soundboards')
}

export function setSoundboards(boards: Soundboard[]): void {
  store.set('soundboards', boards)
}

export function getSettings(): Settings {
  // Merge with defaults so settings persisted by older versions (missing newer fields) don't
  // end up with `undefined` for booleans that must default to a specific value.
  return { ...defaultSettings, ...store.get('settings') }
}

export function setSettings(settings: Settings): void {
  store.set('settings', settings)
}

export function findSoundboard(boards: Soundboard[], id: string): Soundboard {
  const board = boards.find((b) => b.id === id)
  if (!board) throw new Error(`Soundboard not found: ${id}`)
  return board
}

export function findSound(board: Soundboard, id: string): Sound {
  const sound = board.sounds.find((s) => s.id === id)
  if (!sound) throw new Error(`Sound not found: ${id}`)
  return sound
}

export default store
