import { app, shell } from 'electron'
import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import type { ConfigureResult } from '../shared/types'

// Direct download link confirmed working against VB-Audio's official host. It embeds a version
// number (v2122) that will go stale whenever VB-Audio ships a new Voicemeeter release - if the
// fetch fails, fall back to opening the product page so the user can grab the current link.
const VOICEMEETER_ZIP_URL = 'https://download.vb-audio.com/Download_CABLE/VoicemeeterSetup_v2122.zip'
const VOICEMEETER_PAGE_URL = 'https://vb-audio.com/Voicemeeter/banana.htm'

export function openVoicemeeterDownloadPage(): void {
  shell.openExternal(VOICEMEETER_PAGE_URL)
}

export async function downloadAndLaunchVoicemeeterInstaller(): Promise<ConfigureResult> {
  try {
    const res = await fetch(VOICEMEETER_ZIP_URL)
    if (!res.ok) {
      openVoicemeeterDownloadPage()
      return { ok: false, error: 'download-failed' }
    }
    const buffer = Buffer.from(await res.arrayBuffer())

    const tmpDir = path.join(app.getPath('temp'), 'soundgee-voicemeeter-install')
    fs.mkdirSync(tmpDir, { recursive: true })
    const zipPath = path.join(tmpDir, 'VoicemeeterSetup.zip')
    fs.writeFileSync(zipPath, buffer)

    const zip = new AdmZip(zipPath)
    const setupEntry = zip.getEntries().find((e) => /\.exe$/i.test(e.entryName))
    if (!setupEntry) {
      openVoicemeeterDownloadPage()
      return { ok: false, error: 'installer-not-found' }
    }
    zip.extractAllTo(tmpDir, true)

    const openError = await shell.openPath(path.join(tmpDir, setupEntry.entryName))
    if (openError) {
      openVoicemeeterDownloadPage()
      return { ok: false, error: 'launch-failed' }
    }
    return { ok: true }
  } catch {
    openVoicemeeterDownloadPage()
    return { ok: false, error: 'download-failed' }
  }
}
