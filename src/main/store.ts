import Store from 'electron-store'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import type { AppState, Soundboard, Sound, Settings } from '../shared/types'

const defaultSettings: Settings = { language: 'en', outputDeviceIds: [], masterVolume: 1 }

const store = new Store<AppState>({
  defaults: { soundboards: [], settings: defaultSettings }
})

export function getSoundsDir(): string {
  const dir = path.join(app.getPath('userData'), 'sounds')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function getState(): AppState {
  return { soundboards: store.get('soundboards'), settings: store.get('settings') }
}

export function getSoundboards(): Soundboard[] {
  return store.get('soundboards')
}

export function setSoundboards(boards: Soundboard[]): void {
  store.set('soundboards', boards)
}

export function getSettings(): Settings {
  return store.get('settings')
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
