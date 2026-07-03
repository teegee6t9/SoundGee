import AdmZip from 'adm-zip'
import { dialog, BrowserWindow } from 'electron'
import path from 'path'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import { getSoundboards, setSoundboards, getSoundsDir, findSoundboard, getState } from './store'
import type { Soundboard, Sound, AppState } from '../shared/types'

interface PackManifest {
  name: string
  sounds: Array<{ id: string; name: string; fileName: string; color?: string; volume: number }>
}

export async function exportSoundboard(
  win: BrowserWindow,
  soundboardId: string
): Promise<{ ok: boolean; path?: string }> {
  const board = findSoundboard(getSoundboards(), soundboardId)
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: 'Export soundboard',
    defaultPath: `${board.name.replace(/[^a-z0-9-_]+/gi, '_')}.sgpack.zip`,
    filters: [{ name: 'SoundGee pack', extensions: ['zip'] }]
  })
  if (canceled || !filePath) return { ok: false }

  const zip = new AdmZip()
  const manifest: PackManifest = {
    name: board.name,
    sounds: board.sounds.map((s) => ({
      id: s.id,
      name: s.name,
      fileName: s.fileName,
      color: s.color,
      volume: s.volume
    }))
  }
  zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2)))

  const soundsDir = getSoundsDir()
  for (const sound of board.sounds) {
    const filePathOnDisk = path.join(soundsDir, sound.fileName)
    if (fs.existsSync(filePathOnDisk)) {
      zip.addLocalFile(filePathOnDisk, 'sounds')
    }
  }
  zip.writeZip(filePath)
  return { ok: true, path: filePath }
}

export async function importSoundboardPack(win: BrowserWindow): Promise<AppState | null> {
  const { filePaths, canceled } = await dialog.showOpenDialog(win, {
    title: 'Import soundboard pack',
    filters: [{ name: 'SoundGee pack', extensions: ['zip'] }],
    properties: ['openFile']
  })
  if (canceled || filePaths.length === 0) return null

  const zip = new AdmZip(filePaths[0])
  const manifestEntry = zip.getEntry('manifest.json')
  if (!manifestEntry) throw new Error('Invalid pack: missing manifest.json')
  const manifest = JSON.parse(zip.readAsText(manifestEntry)) as PackManifest

  const soundsDir = getSoundsDir()
  const newSounds: Sound[] = []
  for (const s of manifest.sounds) {
    const entry = zip.getEntry(`sounds/${s.fileName}`)
    if (!entry) continue
    const ext = path.extname(s.fileName) || '.mp3'
    const newFileName = `${uuid()}${ext}`
    fs.writeFileSync(path.join(soundsDir, newFileName), entry.getData())
    newSounds.push({ id: uuid(), name: s.name, fileName: newFileName, color: s.color, volume: s.volume ?? 1 })
  }

  const boards = getSoundboards()
  const newBoard: Soundboard = { id: uuid(), name: manifest.name, sounds: newSounds }
  boards.push(newBoard)
  setSoundboards(boards)
  return getState()
}
